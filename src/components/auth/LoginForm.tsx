import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Zap } from "lucide-react";
import cyberBackground from "@/assets/cyber-background.jpg";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onToggleMode: () => void;
  isSignUp: boolean;
}

export function LoginForm({ onLogin, onToggleMode, isSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cyberBackground})` }}
      >
        <div className="absolute inset-0 bg-background/80"></div>
      </div>

      <Card className="glow-card w-full max-w-md z-10 animate-glow">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 rounded-lg cyber-gradient">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold glow-text">MARK ONE</span>
          </div>
          <CardTitle className="text-xl">
            {isSignUp ? "Criar Conta" : "Entrar no Sistema"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Configure sua conta para monitorar sensores" 
              : "Acesse o dashboard de sensores de temperatura"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-input border-border/50 focus:border-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-input border-border/50 focus:border-primary/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full cyber-gradient hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading 
                ? "Processando..." 
                : isSignUp ? "Criar Conta" : "Entrar"
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp 
                ? "Já tem uma conta? Entrar" 
                : "Não tem conta? Criar uma"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}