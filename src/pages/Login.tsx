
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="glass-panel p-8 w-full max-w-md mx-auto shadow-lg animate-fade-in">
        <LoginForm onSuccess={() => navigate("/dashboard")} />
      </div>
    </div>
  );
};

export default Login;
