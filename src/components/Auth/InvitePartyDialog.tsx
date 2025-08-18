import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSupabaseAgreements } from '@/hooks/useSupabaseAgreements';
import { Mail, Send } from 'lucide-react';

interface InvitePartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agreementId: string | null;
}

export const InvitePartyDialog: React.FC<InvitePartyDialogProps> = ({
  open,
  onOpenChange,
  agreementId,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { inviteParty } = useSupabaseAgreements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementId || !email) return;

    try {
      setLoading(true);
      await inviteParty(agreementId, email.trim());
      setEmail('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Invite error:', error);
      // Error is handled by the hook with toast
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Invite Party to Sign
          </DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite to review and sign this agreement.
            They must be registered on the platform to receive the invitation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• The invited party will receive an email notification</li>
                  <li>• They can review the agreement and provide their digital signature</li>
                  <li>• You'll be notified when they complete their signature</li>
                </ul>
              </div>
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
              disabled={loading || !email.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};