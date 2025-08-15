import { useState } from "react";
import { LoginForm } from "@/components/Auth/LoginForm";
import { RegisterForm } from "@/components/Auth/RegisterForm";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Globe, Shield } from "lucide-react";
import heroImage from "@/assets/hero-legal-tech.jpg";

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "AI-Powered Generation",
      description: "Create professional agreements in seconds using advanced AI"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "English ↔ Tamil Translation",
      description: "Seamlessly translate agreements between languages"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "PDF Export",
      description: "Download beautiful, formatted PDF documents"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-app">
      {/* Hero Background Image */}
      <div 
        className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl floating-element" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl floating-element" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Hero content */}
          <div className="space-y-8 animate-fade-in-left">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-gradient">Agreement</span>
                <br />
                <span className="text-foreground">Generator</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Create professional legal agreements in seconds with AI-powered generation, 
                seamless translation, and beautiful PDF exports.
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass-card border-0 shadow-md animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="flex items-start space-x-4 p-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <div className="text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md animate-fade-in-right">
              {isLogin ? (
                <LoginForm 
                  onLoginSuccess={onAuthSuccess}
                  onSwitchToRegister={() => setIsLogin(false)}
                />
              ) : (
                <RegisterForm 
                  onRegisterSuccess={() => setIsLogin(true)}
                  onSwitchToLogin={() => setIsLogin(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};