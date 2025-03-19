
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock, Loader2 } from "lucide-react";
import { authStateChanged } from "@/components/Navbar";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Vänligen ange både e-post och lösenord");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear all localStorage to start fresh
      localStorage.clear();
      
      // Simple "mock" auth for demo
      // In production, this would be a real API call
      if (email === "demo@example.com" && password === "password") {
        // Store mock token and user data
        localStorage.setItem("auth-token", "mock-jwt-token");
        localStorage.setItem("user-data", JSON.stringify({
          id: "user-1",
          email: "demo@example.com",
          name: "Demo Användare",
          company: ""
        }));
        
        // Dispatch auth state change event
        window.dispatchEvent(authStateChanged);
        
        toast.success("Inloggning lyckades!");
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Felaktiga inloggningsuppgifter");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ett fel uppstod vid inloggning. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Logga in</h1>
        <p className="text-muted-foreground">
          Ange dina inloggningsuppgifter för att fortsätta
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="namn@företag.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              autoComplete="email"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Lösenord</Label>
            <a 
              href="#" 
              className="text-sm text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Funktionen för att återställa lösenord är inte implementerad i denna demo.");
              }}
            >
              Glömt lösenord?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loggar in...
            </>
          ) : (
            "Logga in"
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Demo inloggning: <span className="font-medium">demo@example.com</span> / <span className="font-medium">password</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
