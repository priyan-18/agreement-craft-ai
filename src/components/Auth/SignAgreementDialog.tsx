import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSupabaseAgreements } from '@/hooks/useSupabaseAgreements';
import { CheckCircle, PenTool, Shield, AlertTriangle } from 'lucide-react';

interface SignAgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreementId: string | null;
}

export const SignAgreementDialog: React.FC<SignAgreementDialogProps> = ({
  open,
  onOpenChange,
  agreementId,
}) => {
  const [signatureType, setSignatureType] = useState<'digital' | 'otp'>('digital');
  const [digitalSignature, setDigitalSignature] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { signAgreement, getAgreement } = useSupabaseAgreements();

  const agreement = agreementId ? getAgreement(agreementId) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementId || !confirmed) return;

    try {
      setLoading(true);
      
      const signatureData = signatureType === 'digital' 
        ? { digitalSignature, timestamp: new Date().toISOString() }
        : { otpCode, verified: true, timestamp: new Date().toISOString() };

      await signAgreement(agreementId, signatureType, signatureData);
      
      // Reset form
      setDigitalSignature('');
      setOtpCode('');
      setConfirmed(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Sign error:', error);
      // Error is handled by the hook with toast
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDigitalSignature('');
    setOtpCode('');
    setConfirmed(false);
    onOpenChange(false);
  };

  const isFormValid = () => {
    if (!confirmed) return false;
    if (signatureType === 'digital') return digitalSignature.trim().length > 0;
    if (signatureType === 'otp') return otpCode.trim().length >= 6;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            Sign Agreement
          </DialogTitle>
          <DialogDescription>
            You are about to provide your digital signature for "{agreement?.title}". 
            Please review the document carefully before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agreement Info */}
          {agreement && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Agreement Details</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><span className="font-medium">Title:</span> {agreement.title}</p>
                <p><span className="font-medium">Type:</span> {agreement.type}</p>
                <p><span className="font-medium">Status:</span> {agreement.status}</p>
              </div>
            </div>
          )}

          {/* Signature Type Selection */}
          <div className="space-y-3">
            <Label>Signature Method</Label>
            <RadioGroup
              value={signatureType}
              onValueChange={(value: 'digital' | 'otp') => setSignatureType(value)}
            >
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <RadioGroupItem value="digital" id="digital" />
                <div className="flex-1">
                  <Label htmlFor="digital" className="font-medium">Digital Signature</Label>
                  <p className="text-sm text-muted-foreground">Type your full name as your digital signature</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <RadioGroupItem value="otp" id="otp" />
                <div className="flex-1">
                  <Label htmlFor="otp" className="font-medium">OTP Verification</Label>
                  <p className="text-sm text-muted-foreground">Use a one-time password for verification</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Signature Input */}
          {signatureType === 'digital' && (
            <div className="space-y-2">
              <Label htmlFor="signature">Your Digital Signature</Label>
              <Input
                id="signature"
                type="text"
                placeholder="Type your full name"
                value={digitalSignature}
                onChange={(e) => setDigitalSignature(e.target.value)}
                required
                disabled={loading}
                className="focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                By typing your name, you agree that this constitutes your legal signature
              </p>
            </div>
          )}

          {signatureType === 'otp' && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                disabled={loading}
                maxLength={6}
                className="focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                For demo purposes, use any 6-digit code
              </p>
            </div>
          )}

          {/* Legal Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Legal Notice:</p>
                <p>
                  By providing your signature, you acknowledge that you have read, understood, 
                  and agree to be legally bound by the terms and conditions of this agreement.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1"
              disabled={loading}
            />
            <div>
              <Label htmlFor="confirm" className="font-medium">
                I confirm that I have read and agree to this agreement
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I understand that this signature will be legally binding and cannot be undone.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign Agreement
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};