import { useState } from "react";
import { LoginForm } from "@/components/Auth/LoginForm";
import { RegisterForm } from "@/components/Auth/RegisterForm";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Sparkles, Globe, Shield, Zap, Atom } from "lucide-react";
import heroImage from "@/assets/hero-legal-cosmic.jpg";

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "⚡ AI-Powered Generation",
      description: "Create professional agreements in seconds using advanced AI",
      gradient: "primary-gradient"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "🌍 English ↔ Tamil Translation",
      description: "Seamlessly translate agreements between languages",
      gradient: "secondary-gradient"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "📄 Beautiful PDF Export",
      description: "Download stunning, formatted PDF documents",
      gradient: "primary-gradient"
    },
    {
      icon: <Atom className="h-6 w-6" />,
      title: "🚀 Quantum Security",
      description: "Your data is encrypted and protected with advanced security",
      gradient: "secondary-gradient"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-app relative overflow-hidden">
      {/* Cosmic Hero Background */}
      <div 
        className="fixed inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Enhanced Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl cosmic-float" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-secondary/15 rounded-full blur-3xl cosmic-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl cosmic-float" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-secondary/8 rounded-full blur-xl cosmic-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left side - Enhanced Hero content */}
          <div className="space-y-10 animate-fade-in-left">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 morphing-bg rounded-2xl shadow-xl neon-glow">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div className="h-1 w-20 morphing-bg rounded-full"></div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="text-cosmic block">Agreement</span>
                <span className="text-gradient block">Generator</span>
                <span className="text-primary block text-4xl md:text-5xl font-light">✨ Pro</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                🚀 Create <span className="text-primary font-semibold">AI-powered</span> legal agreements in seconds with 
                seamless translation and stunning PDF exports. <span className="text-secondary">The future is here.</span>
              </p>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="glass-morph border border-primary/20 shadow-xl levitate-card hover:scale-105 transition-all duration-500 animate-fade-in-up group" 
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="flex items-start space-x-6 p-6">
                    <div className={`p-4 ${feature.gradient} rounded-xl shadow-lg neon-glow`}>
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-cosmic">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Enhanced Auth forms */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Card className="glass-morph border border-primary/30 shadow-2xl backdrop-blur-2xl levitate-card">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="mx-auto p-4 morphing-bg rounded-full w-20 h-20 flex items-center justify-center neon-glow mb-4">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-cosmic mb-2">
                      {isLogin ? '🚀 Welcome Back' : '✨ Join the Future'}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {isLogin ? 'Access your AI-powered legal workspace' : 'Start creating amazing legal documents'}
                    </p>
                  </div>
                  
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};