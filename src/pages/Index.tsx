import { useState, useEffect } from "react";
import { AuthPage } from "./Auth";
import { Dashboard } from "./Dashboard";
import { AgreementGenerator } from "./AgreementGenerator";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

type AppState = "dashboard" | "generator";

const Index = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppState>("dashboard");

  const handleCreateNew = () => {
    setCurrentPage("generator");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleAgreementCreated = () => {
    setCurrentPage("dashboard");
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-app flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show appropriate page based on current state
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onCreateNew={handleCreateNew} />;
      case "generator":
        return (
          <AgreementGenerator 
            onBack={handleBackToDashboard}
            onAgreementCreated={handleAgreementCreated}
          />
        );
      default:
        return <Dashboard onCreateNew={handleCreateNew} />;
    }
  };

  return <>{renderPage()}</>;
};

export default Index;
