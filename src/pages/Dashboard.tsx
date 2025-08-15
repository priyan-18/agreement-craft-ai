import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { Plus, FileText, Eye, Download, Trash2, Globe, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agreement {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  status: "draft" | "completed";
}

interface DashboardProps {
  onCreateNew: () => void;
  onLogout: () => void;
}

export const Dashboard = ({ onCreateNew, onLogout }: DashboardProps) => {
  const { toast } = useToast();
  const [agreements] = useState<Agreement[]>([
    {
      id: "1",
      title: "Office Rental Agreement - Mumbai",
      type: "Rental",
      createdAt: "2024-01-15",
      status: "completed"
    },
    {
      id: "2", 
      title: "Software Development Service Agreement",
      type: "Service",
      createdAt: "2024-01-12",
      status: "completed"
    },
    {
      id: "3",
      title: "Product Design NDA",
      type: "NDA",
      createdAt: "2024-01-10",
      status: "draft"
    }
  ]);

  const handleDownload = (agreementId: string) => {
    toast({
      title: "Download started",
      description: "Your PDF is being generated and will download shortly.",
    });
  };

  const handleDelete = (agreementId: string) => {
    toast({
      title: "Agreement deleted",
      description: "The agreement has been removed from your account.",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Draft
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-app">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 primary-gradient rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Agreement Generator</h1>
                <p className="text-sm text-muted-foreground">Professional legal documents</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="btn-hover"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in-down">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Welcome back, John! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to create your next professional agreement?
          </p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="animate-fade-in-up">
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gradient">Quick Actions</CardTitle>
              <CardDescription>
                Start creating or managing your agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  onClick={onCreateNew}
                  className="h-24 primary-gradient text-white btn-hover text-lg"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Create New Agreement
                </Button>
                
                <div className="grid gap-2">
                  <Button variant="outline" className="btn-hover">
                    <FileText className="h-4 w-4 mr-2" />
                    View Templates
                  </Button>
                  <Button variant="outline" className="btn-hover">
                    <Globe className="h-4 w-4 mr-2" />
                    Translation History
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
                            <Button variant="outline" size="sm" className="btn-hover">
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