import { useState } from "react";
import { AuthPage } from "./Auth";
import { Dashboard } from "./Dashboard";
import { AgreementGenerator } from "./AgreementGenerator";

type AppState = "auth" | "dashboard" | "generator";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<AppState>("auth");

  const handleAuthSuccess = () => {
    setCurrentPage("dashboard");
  };

  const handleCreateNew = () => {
    setCurrentPage("generator");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentPage("auth");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "auth":
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case "dashboard":
        return (
          <Dashboard
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
          />
        );
      case "generator":
        return <AgreementGenerator onBack={handleBackToDashboard} />;
      default:
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return <>{renderPage()}</>;
};

export default Index;
