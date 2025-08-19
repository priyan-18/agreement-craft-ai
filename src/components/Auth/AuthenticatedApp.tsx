import { useState } from 'react';
import { useSupabaseAgreements, Agreement } from '@/hooks/useSupabaseAgreements';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  Download, 
  Eye,
  LogOut,
  Trash2,
  Share2,
  PenTool,
  AlertCircle
} from 'lucide-react';
import { AgreementGenerator } from '@/pages/AgreementGenerator';
import { AgreementViewer } from '@/components/AgreementViewer';
import { InvitePartyDialog } from './InvitePartyDialog';
import { SignAgreementDialog } from './SignAgreementDialog';
import { toast } from '@/hooks/use-toast';
import { DashboardStats } from '@/components/Dashboard/DashboardStats';

type ViewType = 'dashboard' | 'generator' | 'view';

export const AuthenticatedApp = () => {
  const { user, signOut } = useAuth();
  const { 
    agreements, 
    loading, 
    deleteAgreement, 
    inviteParty, 
    signAgreement, 
    getStats 
  } = useSupabaseAgreements();
  
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [inviteAgreementId, setInviteAgreementId] = useState<string | null>(null);
  const [signAgreementId, setSignAgreementId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDelete = async (agreementId: string) => {
    if (!confirm('Are you sure you want to delete this agreement?')) return;
    
    try {
      await deleteAgreement(agreementId);
      toast({
        title: "Agreement deleted",
        description: "The agreement has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (agreementId: string) => {
    const agreement = agreements.find(a => a.id === agreementId);
    if (!agreement) return;

    try {
      toast({
        title: "PDF Download",
        description: "Generating your agreement PDF...",
      });

      const { downloadPDF } = await import('@/services/pdfService');
      await downloadPDF(agreement);
      
      toast({
        title: "PDF Downloaded",
        description: "Your agreement has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleInviteParty = async (email: string) => {
    if (!inviteAgreementId) return;
    
    try {
      await inviteParty(inviteAgreementId, email);
      setShowInviteDialog(false);
      setInviteAgreementId(null);
    } catch (error: any) {
      toast({
        title: "Invite failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSign = async (signatureType: 'digital' | 'otp', signatureData: any = {}) => {
    if (!signAgreementId) return;
    
    try {
      await signAgreement(signAgreementId, signatureType, signatureData);
      setShowSignDialog(false);
      setSignAgreementId(null);
    } catch (error: any) {
      toast({
        title: "Sign failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Agreement['status']) => {
    const statusConfig = {
      draft: { color: 'secondary', icon: Clock, label: 'Draft' },
      pending: { color: 'default', icon: AlertCircle, label: 'Pending' },
      partially_signed: { color: 'orange', icon: PenTool, label: 'Partially Signed' },
      completed: { color: 'success', icon: CheckCircle, label: 'Completed' },
      rejected: { color: 'destructive', icon: AlertCircle, label: 'Rejected' }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.color as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // View specific agreement
  if (currentView === 'view' && selectedAgreement) {
    const agreement = agreements.find(a => a.id === selectedAgreement);
    if (agreement) {
      return (
        <AgreementViewer 
          agreement={agreement}
          onBack={() => {
            setCurrentView('dashboard');
            setSelectedAgreement(null);
          }}
        />
      );
    }
  }

  // Agreement generator view
  if (currentView === 'generator') {
    return (
      <AgreementGenerator
        onBack={() => setCurrentView('dashboard')}
        onAgreementCreated={() => setCurrentView('dashboard')}
      />
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-app">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Welcome back, {user?.user_metadata?.first_name || 'User'}! 🚀
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your agreements with AI-powered tools
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="btn-hover glass-morph border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats stats={getStats()} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setCurrentView('generator')}
            className="primary-gradient text-white btn-hover shadow-lg"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Agreement
          </Button>
        </div>

        {/* Agreements List */}
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gradient flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Your Agreements
            </CardTitle>
            <CardDescription>
              Manage and track all your legal agreements in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your agreements...</p>
                </div>
              </div>
            ) : agreements.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No agreements yet</h3>
                <p className="text-muted-foreground mb-6">Create your first AI-powered agreement to get started</p>
                <Button 
                  onClick={() => setCurrentView('generator')}
                  className="primary-gradient text-white btn-hover"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agreement
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {agreements.map((agreement) => (
                  <Card key={agreement.id} className="glass-morph border border-primary/20 shadow-md hover:shadow-lg transition-all duration-300 card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{agreement.title}</h3>
                            {getStatusBadge(agreement.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {agreement.type}
                            </span>
                            <span>Created {new Date(agreement.created_at).toLocaleDateString()}</span>
                            {agreement.parties && agreement.parties.length > 0 && (
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {agreement.parties.length} parties
                              </span>
                            )}
                          </div>
                          
                          {agreement.parties && agreement.parties.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm text-muted-foreground mb-2">Parties:</p>
                              <div className="flex flex-wrap gap-2">
                                {agreement.parties.map((party) => (
                                  <Badge 
                                    key={party.id} 
                                    variant={party.status === 'signed' ? 'default' : 'secondary'}
                                    className="flex items-center gap-1"
                                  >
                                    {party.profile?.email || 'Unknown'}
                                    {party.status === 'signed' && <CheckCircle className="h-3 w-3" />}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="btn-hover" 
                            onClick={() => {
                              setSelectedAgreement(agreement.id);
                              setCurrentView('view');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="btn-hover" 
                            onClick={() => handleDownload(agreement.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {agreement.status === 'draft' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="btn-hover text-primary" 
                              onClick={() => {
                                setInviteAgreementId(agreement.id);
                                setShowInviteDialog(true);
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          {agreement.status !== 'draft' && !agreement.signatures?.find(s => s.user_id === user?.id) && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="btn-hover text-green-600" 
                              onClick={() => {
                                setSignAgreementId(agreement.id);
                                setShowSignDialog(true);
                              }}
                            >
                              <PenTool className="h-4 w-4" />
                            </Button>
                          )}
                          {agreement.status === 'draft' && agreement.creator_id === user?.id && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="btn-hover text-destructive hover:bg-destructive/10" 
                              onClick={() => handleDelete(agreement.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <InvitePartyDialog
        open={showInviteDialog}
        onOpenChange={(open) => {
          setShowInviteDialog(open);
          if (!open) setInviteAgreementId(null);
        }}
        agreementId={inviteAgreementId}
      />

      <SignAgreementDialog
        open={showSignDialog}
        onOpenChange={(open) => {
          setShowSignDialog(open);
          if (!open) setSignAgreementId(null);
        }}
        agreementId={signAgreementId}
      />
    </div>
  );
};