import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Calendar, 
  User, 
  Globe,
  Copy,
  Printer,
  Share2,
  Eye,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Agreement {
  id: string;
  title: string;
  type: string;
  content: string;
  status: string;
  createdAt: string;
  translation?: {
    tamil: string;
  };
}

interface AgreementViewerProps {
  agreement: Agreement;
  onBack: () => void;
}

export const AgreementViewer = ({ agreement, onBack }: AgreementViewerProps) => {
  const { toast } = useToast();
  const [showTranslation, setShowTranslation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
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
      title: "✨ Download Started",
      description: "Your agreement is being downloaded...",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(agreement.content);
    toast({
      title: "📋 Copied!",
      description: "Agreement content copied to clipboard.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: agreement.title,
        text: agreement.content,
      });
    } else {
      handleCopy();
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      // Check if it's a heading
      if (paragraph.includes('AGREEMENT') || paragraph.includes('TERMS') || paragraph.includes('CONDITIONS')) {
        return (
          <h2 key={index} className="text-xl font-bold text-gradient mb-4 animate-fade-in-up" 
              style={{ animationDelay: `${index * 0.1}s` }}>
            {paragraph.trim()}
          </h2>
        );
      }
      
      // Check if it's a clause number
      if (paragraph.match(/^\d+\./)) {
        return (
          <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}>
            {paragraph.trim()}
          </h3>
        );
      }
      
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4 animate-fade-in-up"
           style={{ animationDelay: `${index * 0.05}s` }}>
          {paragraph.trim()}
        </p>
      );
    }).filter(Boolean);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-app overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl floating-element" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl floating-element" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Animated Header */}
      <div className="relative z-10 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="btn-hover border-border/50 hover:border-primary/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-3 primary-gradient rounded-xl shadow-lg glow-effect">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient">Agreement Viewer</h1>
                  <p className="text-sm text-muted-foreground">Professional document preview</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 animate-fade-in-up">
              <Button variant="outline" size="sm" onClick={handleCopy} className="btn-hover">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="btn-hover">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="btn-hover">
                <Printer className="h-4 w-4" />
              </Button>
              <Button onClick={handleDownload} className="primary-gradient text-white btn-hover">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Agreement Info Card */}
          <Card className={`glass-card border-0 shadow-xl ${isAnimating ? 'animate-scale-in' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-3xl text-gradient flex items-center">
                      <Sparkles className="h-8 w-8 mr-3 text-primary animate-pulse-glow" />
                      {agreement.title}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {agreement.type}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(agreement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Active Document
                    </span>
                  </div>
                </div>
                
                <Badge variant="outline" className={`${getStatusColor(agreement.status)} animate-pulse-glow`}>
                  {agreement.status === 'completed' ? '✅ Completed' : '📝 Draft'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Translation Toggle */}
          {agreement.translation?.tamil && (
            <div className="flex justify-center animate-fade-in-up">
              <div className="flex items-center space-x-2 p-1 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
                <Button
                  variant={!showTranslation ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowTranslation(false)}
                  className={!showTranslation ? "primary-gradient text-white" : ""}
                >
                  English
                </Button>
                <Button
                  variant={showTranslation ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowTranslation(true)}
                  className={showTranslation ? "secondary-gradient text-white" : ""}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  தமிழ்
                </Button>
              </div>
            </div>
          )}

          {/* Content Viewer */}
          <Card className="glass-card border-0 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] p-8">
                <div className="prose prose-lg max-w-none text-foreground">
                  {formatContent(showTranslation ? agreement.translation?.tamil || agreement.content : agreement.content)}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Button variant="outline" onClick={onBack} className="btn-hover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={handleDownload} className="primary-gradient text-white btn-hover">
              <Download className="h-4 w-4 mr-2" />
              Download Agreement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};