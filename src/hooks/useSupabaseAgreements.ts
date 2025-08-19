import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

export interface Agreement {
  id: string;
  title: string;
  type: string;
  content: string;
  form_data: Record<string, any>;
  status: 'draft' | 'pending' | 'partially_signed' | 'completed' | 'rejected';
  creator_id: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  creator_profile?: {
    username: string;
    first_name: string;
    last_name: string;
  };
  parties?: AgreementParty[];
  signatures?: Signature[];
}

export interface AgreementParty {
  id: string;
  agreement_id: string;
  user_id: string;
  role: 'creator' | 'signer';
  status: 'pending' | 'viewed' | 'signed' | 'rejected';
  invited_at: string;
  responded_at?: string;
  profile?: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Signature {
  id: string;
  agreement_id: string;
  user_id: string;
  signature_type: 'digital' | 'otp';
  signature_data: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  signed_at: string;
  profile?: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

export const useSupabaseAgreements = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAgreements();
    }
  }, [user]);

  const loadAgreements = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get agreements where user is creator or party
      const { data: agreementsData, error } = await supabase
        .from('agreements')
        .select(`
          *,
          creator_profile:profiles!creator_id (
            username,
            first_name,
            last_name
          ),
          parties:agreement_parties (
            *,
            profile:profiles (
              username,
              first_name,
              last_name,
              email
            )
          ),
          signatures (
            *,
            profile:profiles (
              username,
              first_name,
              last_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAgreements((agreementsData as any[]) || []);
    } catch (error: any) {
      console.error('Error loading agreements:', error);
      toast({
        title: "Error",
        description: "Failed to load agreements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAgreement = async (agreementData: {
    title: string;
    type: string;
    content: string;
    form_data: Record<string, any>;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('agreements')
        .insert({
          ...agreementData,
          creator_id: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      // Create audit log
      await createAuditLog(data.id, 'created', { title: agreementData.title });

      await loadAgreements();
      
      toast({
        title: "Success",
        description: "Agreement created successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating agreement:', error);
      throw new Error(error.message || 'Failed to create agreement');
    }
  };

  const updateAgreement = async (id: string, updates: Partial<Agreement>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('agreements')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Create audit log
      await createAuditLog(id, 'updated', updates);

      await loadAgreements();

      toast({
        title: "Success",
        description: "Agreement updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating agreement:', error);
      throw new Error(error.message || 'Failed to update agreement');
    }
  };

  const deleteAgreement = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('agreements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadAgreements();

      toast({
        title: "Success",
        description: "Agreement deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting agreement:', error);
      throw new Error(error.message || 'Failed to delete agreement');
    }
  };

  const inviteParty = async (agreementId: string, email: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Find user by email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, email')
        .eq('email', email)
        .single();

      if (profileError || !profileData) {
        throw new Error('User with this email not found. They must register first.');
      }

      // Check if already invited
      const { data: existingParty } = await supabase
        .from('agreement_parties')
        .select('id')
        .eq('agreement_id', agreementId)
        .eq('user_id', profileData.id)
        .single();

      if (existingParty) {
        throw new Error('This user has already been invited to this agreement.');
      }

      // Add as party
      const { error } = await supabase
        .from('agreement_parties')
        .insert({
          agreement_id: agreementId,
          user_id: profileData.id,
          role: 'signer',
          status: 'pending'
        });

      if (error) throw error;

      // Send notification email
      const agreement = agreements.find(a => a.id === agreementId);
      if (agreement) {
        const inviteLink = `${window.location.origin}/agreement/${agreementId}`;
        
        await supabase.functions.invoke('send-notification', {
          body: {
            to: email,
            type: 'invitation',
            agreementTitle: agreement.title,
            senderName: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || 'Someone',
            agreementId: agreementId,
            inviteLink: inviteLink
          }
        });
      }

      // Create audit log
      await createAuditLog(agreementId, 'party_invited', { email, invitedUserId: profileData.id });

      await loadAgreements();

      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });

      return profileData;
    } catch (error: any) {
      console.error('Error inviting party:', error);
      throw new Error(error.message || 'Failed to invite party');
    }
  };

  const signAgreement = async (agreementId: string, signatureType: 'digital' | 'otp', signatureData: Record<string, any> = {}) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Create signature
      const { error: signatureError } = await supabase
        .from('signatures')
        .insert({
          agreement_id: agreementId,
          user_id: user.id,
          signature_type: signatureType,
          signature_data: signatureData,
          ip_address: null, // Could be populated by edge function
          user_agent: navigator.userAgent
        });

      if (signatureError) throw signatureError;

      // Update party status
      const { error: partyError } = await supabase
        .from('agreement_parties')
        .update({
          status: 'signed',
          responded_at: new Date().toISOString()
        })
        .eq('agreement_id', agreementId)
        .eq('user_id', user.id);

      if (partyError) throw partyError;

      // Check if all parties have signed
      const { data: parties } = await supabase
        .from('agreement_parties')
        .select('status')
        .eq('agreement_id', agreementId);

      const allSigned = parties?.every(p => p.status === 'signed');
      const newStatus = allSigned ? 'completed' : 'partially_signed';

      // Update agreement status
      const { error: agreementError } = await supabase
        .from('agreements')
        .update({ status: newStatus })
        .eq('id', agreementId);

      if (agreementError) throw agreementError;

      // Create audit log
      await createAuditLog(agreementId, 'signed', { signatureType, allSigned });

      // If completed, notify all parties
      if (allSigned) {
        const agreement = agreements.find(a => a.id === agreementId);
        if (agreement?.parties) {
          const inviteLink = `${window.location.origin}/agreement/${agreementId}`;
          
          for (const party of agreement.parties) {
            if (party.profile?.email) {
              await supabase.functions.invoke('send-notification', {
                body: {
                  to: party.profile.email,
                  type: 'completed',
                  agreementTitle: agreement.title,
                  senderName: 'Agreement Generator',
                  agreementId: agreementId,
                  inviteLink: inviteLink
                }
              });
            }
          }
        }
      }

      await loadAgreements();

      toast({
        title: "Success",
        description: allSigned ? "Agreement completed! All parties have signed." : "Your signature has been recorded.",
      });

      return { completed: allSigned };
    } catch (error: any) {
      console.error('Error signing agreement:', error);
      throw new Error(error.message || 'Failed to sign agreement');
    }
  };

  const createAuditLog = async (agreementId: string, action: string, details: Record<string, any> = {}) => {
    if (!user) return;

    try {
      await supabase.rpc('create_audit_log', {
        p_agreement_id: agreementId,
        p_user_id: user.id,
        p_action: action,
        p_details: details,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  };

  const getAgreement = (id: string) => {
    return agreements.find(agreement => agreement.id === id);
  };

  const getAgreementsByStatus = (status: Agreement['status']) => {
    return agreements.filter(agreement => agreement.status === status);
  };

  const getStats = () => {
    const total = agreements.length;
    const completed = agreements.filter(a => a.status === 'completed').length;
    const pending = agreements.filter(a => a.status === 'pending' || a.status === 'partially_signed').length;
    const drafts = agreements.filter(a => a.status === 'draft').length;
    
    // Calculate this month's agreements
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = agreements.filter(a => {
      const createdAt = new Date(a.created_at);
      return createdAt >= firstDayOfMonth;
    }).length;

    return { total, completed, pending, drafts, thisMonth };
  };

  return {
    agreements,
    loading,
    createAgreement,
    updateAgreement,
    deleteAgreement,
    inviteParty,
    signAgreement,
    getAgreement,
    getAgreementsByStatus,
    getStats,
    refresh: loadAgreements,
  };
};