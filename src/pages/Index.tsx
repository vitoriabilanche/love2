import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication
    setUserEmail(email);
    setIsAuthenticated(true);
    
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo ao sistema, ${email}`,
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema",
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} userEmail={userEmail} />;
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onToggleMode={toggleMode}
      isSignUp={isSignUp}
    />
  );
};

export default Index;
