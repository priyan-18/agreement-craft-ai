import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { AgreementViewer } from "@/components/AgreementViewer";
import { Plus, FileText, Eye, Download, Trash2, Globe, LogOut, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgreements } from "@/hooks/useAgreements";
import heroImage from "@/assets/hero-legal-cosmic.jpg";

interface DashboardProps {
  onCreateNew: () => void;
  onLogout: () => void;
}

export const Dashboard = ({ onCreateNew, onLogout }: DashboardProps) => {
  const { toast } = useToast();
  const { agreements, loading, deleteAgreement, getStats } = useAgreements();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewingAgreement, setViewingAgreement] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleDownload = (agreementId: string) => {
    const agreement = agreements.find(a => a.id === agreementId);
    if (!agreement) return;
    
    // Create PDF blob and download
    const content = agreement.content || 'No content available';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agreement.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download completed",
      description: "Your agreement has been downloaded successfully.",
    });
  };

  const handleDelete = (agreementId: string) => {
    try {
      deleteAgreement(agreementId);
      toast({
        title: "Agreement deleted",
        description: "The agreement has been removed from your account.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleViewAgreement = (agreementId: string) => {
    const agreement = agreements.find(a => a.id === agreementId);
    if (agreement) {
      setViewingAgreement(agreement);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30 neon-glow">
          ✨ Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
        📝 Draft
      </span>
    );
  };

  // If viewing an agreement, show the viewer
  if (viewingAgreement) {
    return (
      <AgreementViewer 
        agreement={viewingAgreement} 
        onBack={() => setViewingAgreement(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-app relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl cosmic-float" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl cosmic-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl cosmic-float" 
             style={{ animationDelay: '4s' }} />
        <div 
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 glass-morph border-b border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center space-x-4">
              <div className="p-3 morphing-bg rounded-xl shadow-xl neon-glow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-cosmic">Agreement Generator Pro</h1>
                <p className="text-sm text-muted-foreground">✨ AI-Powered Legal Documents</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="btn-hover glass-morph border-primary/30 text-primary hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Enhanced Welcome Section */}
        <div className="text-center animate-fade-in-down">
          <h2 className="text-4xl font-bold text-cosmic mb-4">
            Welcome back, {currentUser?.firstName || 'User'}! 🚀
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Ready to craft your next <span className="text-primary font-semibold">AI-powered</span> legal masterpiece?
          </p>
        </div>

        {/* Stats */}
        <DashboardStats stats={getStats()} />

        {/* Enhanced Quick Actions */}
        <div className="animate-fade-in-up">
          <Card className="glass-morph border border-primary/20 shadow-2xl levitate-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-cosmic flex items-center justify-center">
                <Sparkles className="h-8 w-8 mr-3 animate-pulse-glow" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-lg">
                🎯 Start creating or managing your agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Button 
                  onClick={onCreateNew}
                  className="h-32 btn-cosmic text-white text-xl font-bold relative group overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <Plus className="h-8 w-8 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Create New Agreement</span>
                    <span className="text-sm opacity-80 mt-1">✨ AI-Powered</span>
                  </div>
                </Button>
                
                <div className="grid gap-3">
                  <Button variant="outline" className="btn-hover h-14 glass-morph border-primary/30 text-primary">
                    <FileText className="h-5 w-5 mr-2" />
                    📋 View Templates
                  </Button>
                  <Button variant="outline" className="btn-hover h-14 glass-morph border-secondary/30 text-secondary">
                    <Globe className="h-5 w-5 mr-2" />
                    🌍 Translation History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Agreements */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gradient">Recent Agreements</CardTitle>
              <CardDescription>
                Your latest created agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agreements.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No agreements yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first agreement to get started
                  </p>
                  <Button onClick={onCreateNew} className="primary-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agreement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {agreements.map((agreement, index) => (
                    <Card key={agreement.id} className="border border-border/50 shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{agreement.title}</h3>
                              {getStatusBadge(agreement.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <FileText className="h-4 w-4 mr-1" />
                                {agreement.type}
                              </span>
                              <span>Created {new Date(agreement.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="btn-hover" onClick={() => handleViewAgreement(agreement.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="btn-hover" onClick={() => handleDownload(agreement.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="btn-hover text-destructive" onClick={() => handleDelete(agreement.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </div>
    </div>
  );
};