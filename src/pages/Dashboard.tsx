
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  FileText,
  Building2,
  Upload,
  Loader2
} from "lucide-react";
import AccountingPeriodSelector from "@/components/accounting/AccountingPeriodSelector";

interface CompanyData {
  name: string;
  description: string;
  employees: string;
  industry: string;
  [key: string]: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const navigate = useNavigate();

  // Check authentication and load data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");
      
      if (!token) {
        navigate("/");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Load user data
        if (userData) {
          setUserData(JSON.parse(userData));
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Load company data
        const companyData = localStorage.getItem("company-data");
        if (companyData) {
          setCompany(JSON.parse(companyData));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-8 animate-fade-in">
        {/* Welcome header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Välkommen, {userData?.name || 'Användare'}
          </h1>
          <p className="text-muted-foreground">
            {company?.name 
              ? `Här är en överblick av ${company.name}s hållbarhetsdata`
              : 'Här är en överblick av din hållbarhetsdata'}
          </p>
        </div>
        
        {/* Accounting Period Selector */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Räkenskapsperiod</h2>
          <div className="max-w-md">
            <AccountingPeriodSelector
              value={currentPeriod}
              onChange={setCurrentPeriod}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Välj eller skapa en räkenskapsperiod för att hantera dina dokument
          </p>
        </div>
        
        {/* Main dashboard content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Company information */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Företagsinformation
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/profile")}
                >
                  Hantera
                </Button>
              </div>
              <CardDescription>
                {company?.name 
                  ? `Information om ${company.name}`
                  : 'Klicka på "Hantera" för att lägga till företagsinformation'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {company ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Företagsnamn</p>
                      <p className="text-muted-foreground">{company.name || "Ej angivet"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Bransch</p>
                      <p className="text-muted-foreground">{company.industry || "Ej angivet"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Beskrivning</p>
                    <p className="text-muted-foreground line-clamp-3">
                      {company.description || "Ingen beskrivning tillgänglig"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Antal anställda</p>
                      <p className="text-muted-foreground">
                        {company.employees ? `${company.employees} medarbetare` : "Ej angivet"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Lägg till företagsinformation</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    För att komma igång, lägg till information om ditt företag för att förbättra analysen.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/profile")}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Lägg till företagsuppgifter
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Document Upload CTA */}
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center py-8">
                <FileText className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Hantera hållbarhetsdokument</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Ladda upp, kategorisera och analysera dina hållbarhetsdokument enkelt.
                </p>
                <Button 
                  onClick={() => navigate("/documents")}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Hantera dokument
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
