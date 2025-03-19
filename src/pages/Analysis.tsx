
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnalysisView from "@/components/analysis/AnalysisView";

const Analysis = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hållbarhetsanalys</h1>
        <p className="text-muted-foreground">
          Insikter och nyckeltal extraherade från dina dokument
        </p>
      </div>
      
      <AnalysisView />
    </div>
  );
};

export default Analysis;
