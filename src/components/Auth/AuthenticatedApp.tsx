import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  Plus, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  Eye,
  Download,
  Trash2,
  Send,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseAgreements } from '@/hooks/useSupabaseAgreements';
import { EnhancedFloatingElements } from '../EnhancedFloatingElements';
import { AgreementGenerator } from '@/pages/AgreementGenerator';
import { AgreementViewer } from '../AgreementViewer';
import { InvitePartyDialog } from './InvitePartyDialog';
import { SignAgreementDialog } from './SignAgreementDialog';

export const AuthenticatedApp = () => {
  const { user, profile, signOut } = useAuth();
  const { agreements, loading, deleteAgreement, getStats } = useSupabaseAgreements();
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'view'>('dashboard');
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [selectedAgreementForAction, setSelectedAgreementForAction] = useState<string | null>(null);

  const stats = getStats();

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
      partially_signed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const statusLabels = {
      draft: 'Draft',
      pending: 'Pending',
      partially_signed: 'Partially Signed',
      completed: 'Completed',
      rejected: 'Rejected'
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    );
  };

  const canUserSign = (agreement: any) => {
    if (!user) return false;
    
    // Check if user is a party and hasn't signed yet
    const userParty = agreement.parties?.find((p: any) => p.user_id === user.id);
    const userSignature = agreement.signatures?.find((s: any) => s.user_id === user.id);
    
    return userParty && !userSignature && agreement.status !== 'completed';
  };

  const isUserCreator = (agreement: any) => {
    return user && agreement.creator_id === user.id;
  };

  const handleViewAgreement = (agreementId: string) => {
    setSelectedAgreement(agreementId);
    setCurrentView('view');
  };

  const handleInviteParty = (agreementId: string) => {
    setSelectedAgreementForAction(agreementId);
    setInviteDialogOpen(true);
  };

  const handleSignAgreement = (agreementId: string) => {
    setSelectedAgreementForAction(agreementId);
    setSignDialogOpen(true);
  };

  const handleDelete = async (agreementId: string) => {
    if (confirm('Are you sure you want to delete this agreement?')) {
      try {
        await deleteAgreement(agreementId);
      } catch (error: any) {
        console.error('Delete error:', error);
      }
    }
  };

  if (currentView === 'create') {
    return (
      <AgreementGenerator 
        onBack={() => setCurrentView('dashboard')}
        onAgreementCreated={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'view' && selectedAgreement) {
    const agreement = agreements.find(a => a.id === selectedAgreement);
    if (agreement) {
      return (
        <AgreementViewer 
          agreement={{...agreement, createdAt: agreement.created_at}}
          onBack={() => {
            setCurrentView('dashboard');
            setSelectedAgreement(null);
          }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <EnhancedFloatingElements />
      
      {/* Header */}
      <div className="relative z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Agreement Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {profile?.first_name || profile?.username || user?.email}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setCurrentView('create')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Agreement
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Agreements</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed</p>
                  <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.drafts}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Agreements */}
        <Card className="bg-background/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              My Agreements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="signed">Signed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading agreements...</div>
                ) : agreements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No agreements found. Create your first agreement to get started!</p>
                  </div>
                ) : (
                  agreements.map((agreement) => (
                    <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{agreement.title}</h3>
                              {getStatusBadge(agreement.status)}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="capitalize">{agreement.type}</span>
                              <span>•</span>
                              <span>Created {new Date(agreement.created_at).toLocaleDateString()}</span>
                              {agreement.parties && agreement.parties.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{agreement.parties.length} parties</span>
                                </>
                              )}
                            </div>

                            {/* Parties info */}
                            {agreement.parties && agreement.parties.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Parties: {agreement.parties.map(p => 
                                    `${p.profile?.first_name || p.profile?.username}` + 
                                    (p.status === 'signed' ? ' ✓' : '')
                                  ).join(', ')}
                                </span>
                              </div>
                            )}

                            {/* Signing status */}
                            {canUserSign(agreement) && (
                              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-yellow-800">Your signature is required</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAgreement(agreement.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {isUserCreator(agreement) && agreement.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleInviteParty(agreement.id)}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            
                            {canUserSign(agreement) && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSignAgreement(agreement.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Sign
                              </Button>
                            )}
                            
                            {isUserCreator(agreement) && agreement.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(agreement.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Add filtered views for other tabs */}
              {['pending', 'signed', 'completed', 'drafts'].map(status => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {agreements
                    .filter(a => {
                      if (status === 'pending') return a.status === 'pending' || a.status === 'partially_signed';
                      if (status === 'signed') return a.signatures?.some(s => s.user_id === user?.id);
                      if (status === 'completed') return a.status === 'completed';
                      if (status === 'drafts') return a.status === 'draft';
                      return true;
                    })
                    .map((agreement) => (
                      <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{agreement.title}</h3>
                                {getStatusBadge(agreement.status)}
                              </div>
                              <p className="text-sm text-muted-foreground capitalize">{agreement.type}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAgreement(agreement.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              {canUserSign(agreement) && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSignAgreement(agreement.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Sign
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Invite Party Dialog */}
      <InvitePartyDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        agreementId={selectedAgreementForAction}
      />

      {/* Sign Agreement Dialog */}
      <SignAgreementDialog
        open={signDialogOpen}
        onOpenChange={setSignDialogOpen}
        agreementId={selectedAgreementForAction}
      />
    </div>
  );
};