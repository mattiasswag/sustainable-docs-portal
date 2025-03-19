
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnalysisView from "@/components/analysis/AnalysisView";
import AccountingPeriodSelector from "@/components/accounting/AccountingPeriodSelector";

const Analysis = () => {
  const [currentPeriod, setCurrentPeriod] = useState("");
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Load default accounting period if none selected
  useEffect(() => {
    if (!currentPeriod) {
      const savedPeriods = localStorage.getItem("accounting-periods");
      if (savedPeriods) {
        const periods = JSON.parse(savedPeriods);
        if (periods.length > 0) {
          setCurrentPeriod(periods[0].id);
        }
      }
    }
  }, [currentPeriod]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hållbarhetsanalys</h1>
            <p className="text-muted-foreground">
              Insikter, nyckeltal och prediktiva trender extraherade från dina dokument
            </p>
          </div>
          
          <div className="w-full md:max-w-md">
            <div className="space-y-1">
              <label className="text-sm font-medium">Räkenskapsperiod</label>
              <AccountingPeriodSelector
                value={currentPeriod}
                onChange={setCurrentPeriod}
              />
            </div>
          </div>
        </div>
      </div>
      
      <AnalysisView accountingPeriod={currentPeriod} />
    </div>
  );
};

export default Analysis;
