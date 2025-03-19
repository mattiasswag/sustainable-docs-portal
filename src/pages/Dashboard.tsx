
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
  Loader2,
  Calendar,
  Tag
} from "lucide-react";
import AccountingPeriodSelector from "@/components/accounting/AccountingPeriodSelector";

interface CompanyData {
  name: string;
  description: string;
  employees: string;
  industry: string;
  [key: string]: string;
}

interface Document {
  id: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  accountingPeriod?: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [latestDocument, setLatestDocument] = useState<Document | null>(null);
  const [documentCount, setDocumentCount] = useState(0);
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

        // Load documents
        const savedDocs = localStorage.getItem("documents");
        if (savedDocs) {
          const parsedDocs = JSON.parse(savedDocs);
          setDocuments(parsedDocs);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Update document stats when period or documents change
  useEffect(() => {
    if (documents.length > 0) {
      // Filter documents by current period
      const periodDocs = currentPeriod 
        ? documents.filter(doc => !doc.accountingPeriod || doc.accountingPeriod === currentPeriod)
        : documents;
      
      setDocumentCount(periodDocs.length);
      
      // Find latest document
      if (periodDocs.length > 0) {
        const latest = [...periodDocs].sort((a, b) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )[0];
        setLatestDocument(latest);
      } else {
        setLatestDocument(null);
      }
    } else {
      setDocumentCount(0);
      setLatestDocument(null);
    }
  }, [documents, currentPeriod]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getCategoryLabel = (value: string) => {
    const categoryOptions = [
      { value: "gender_equality", label: "Jämställdhet" },
      { value: "environment", label: "Miljö & Klimat" },
      { value: "social_responsibility", label: "Socialt ansvar" },
      { value: "governance", label: "Bolagsstyrning" },
      { value: "supply_chain", label: "Leverantörskedja" },
      { value: "human_rights", label: "Mänskliga rättigheter" },
      { value: "diversity", label: "Mångfald & Inkludering" },
      { value: "other", label: "Övrigt" }
    ];
    
    const category = categoryOptions.find(cat => cat.value === value);
    return category ? category.label : value;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Overview */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Dokumentöversikt
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/documents")}
                >
                  Visa alla
                </Button>
              </div>
              <CardDescription>
                Dokumentinformation för vald räkenskapsperiod
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Antal dokument</h3>
                    <p className="text-2xl font-bold">{documentCount}</p>
                  </div>
                  
                  <div className="bg-secondary/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Senaste uppladdning</h3>
                    <p className="text-lg font-medium truncate">
                      {latestDocument ? formatDate(latestDocument.uploadDate) : "Inga dokument"}
                    </p>
                  </div>
                </div>
                
                {latestDocument ? (
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Senaste dokumentet</h3>
                    <div className="flex items-start space-x-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{latestDocument.fileName}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(latestDocument.uploadDate)}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Tag className="h-3 w-3 mr-1" />
                            <span>{getCategoryLabel(latestDocument.category)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => navigate("/documents")}
                    >
                      Hantera dokument
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">Inga dokument</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      Du har inte laddat upp några dokument för denna räkenskapsperiod.
                    </p>
                    <Button 
                      onClick={() => navigate("/documents")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Ladda upp dokument
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
