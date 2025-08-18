-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create agreements table
CREATE TABLE public.agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'partially_signed', 'completed', 'rejected')),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on agreements
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- Create agreement_parties table for sharing
CREATE TABLE public.agreement_parties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_id UUID NOT NULL REFERENCES public.agreements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'signer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'signed', 'rejected')),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(agreement_id, user_id)
);

-- Enable RLS on agreement_parties
ALTER TABLE public.agreement_parties ENABLE ROW LEVEL SECURITY;

-- Create signatures table
CREATE TABLE public.signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_id UUID NOT NULL REFERENCES public.agreements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signature_type TEXT NOT NULL CHECK (signature_type IN ('digital', 'otp')),
  signature_data JSONB NOT NULL DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agreement_id, user_id)
);

-- Enable RLS on signatures
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_id UUID NOT NULL REFERENCES public.agreements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('agreements', 'agreements', false, 52428800, ARRAY['application/pdf']::text[]);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for agreements
CREATE POLICY "Users can view agreements they are party to"
ON public.agreements FOR SELECT
USING (
  auth.uid() = creator_id OR 
  EXISTS (
    SELECT 1 FROM public.agreement_parties 
    WHERE agreement_id = agreements.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own agreements"
ON public.agreements FOR INSERT
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own draft agreements"
ON public.agreements FOR UPDATE
USING (auth.uid() = creator_id AND status = 'draft');

-- RLS Policies for agreement_parties
CREATE POLICY "Users can view agreement parties for their agreements"
ON public.agreement_parties FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.agreements a 
    WHERE a.id = agreement_id AND (a.creator_id = auth.uid() OR user_id = auth.uid())
  )
);

CREATE POLICY "Agreement creators can invite parties"
ON public.agreement_parties FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.agreements a 
    WHERE a.id = agreement_id AND a.creator_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own party status"
ON public.agreement_parties FOR UPDATE
USING (user_id = auth.uid());

-- RLS Policies for signatures
CREATE POLICY "Users can view signatures for their agreements"
ON public.signatures FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.agreements a 
    WHERE a.id = agreement_id AND (a.creator_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM public.agreement_parties ap WHERE ap.agreement_id = a.id AND ap.user_id = auth.uid()))
  )
);

CREATE POLICY "Users can create their own signatures"
ON public.signatures FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.agreement_parties ap 
    WHERE ap.agreement_id = signatures.agreement_id AND ap.user_id = auth.uid()
  )
);

-- RLS Policies for audit_logs
CREATE POLICY "Users can view audit logs for their agreements"
ON public.audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.agreements a 
    WHERE a.id = agreement_id AND (a.creator_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM public.agreement_parties ap WHERE ap.agreement_id = a.id AND ap.user_id = auth.uid()))
  )
);

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- Storage policies for agreements bucket
CREATE POLICY "Users can view PDFs for their agreements"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'agreements' AND
  EXISTS (
    SELECT 1 FROM public.agreements a 
    WHERE a.pdf_url = storage.objects.name AND 
    (a.creator_id = auth.uid() OR 
     EXISTS (SELECT 1 FROM public.agreement_parties ap WHERE ap.agreement_id = a.id AND ap.user_id = auth.uid()))
  )
);

CREATE POLICY "System can upload agreement PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'agreements');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, first_name, last_name, mobile)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'mobile'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agreements_updated_at
  BEFORE UPDATE ON public.agreements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_agreement_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_details JSONB DEFAULT '{}'::jsonb,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (agreement_id, user_id, action, details, ip_address, user_agent)
  VALUES (p_agreement_id, p_user_id, p_action, p_details, p_ip_address, p_user_agent)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;