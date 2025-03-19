
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
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from "recharts";
import {
  FileText,
  Building2,
  BarChart2,
  Upload,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Loader2
} from "lucide-react";

// Document category options and their labels
const categoryOptions: Record<string, string> = {
  "gender_equality": "Jämställdhet",
  "environment": "Miljö & Klimat",
  "social_responsibility": "Socialt ansvar",
  "governance": "Bolagsstyrning",
  "supply_chain": "Leverantörskedja",
  "human_rights": "Mänskliga rättigheter", 
  "diversity": "Mångfald & Inkludering",
  "other": "Övrigt"
};

// Mock category colors
const CATEGORY_COLORS: Record<string, string> = {
  "gender_equality": "#8884d8",
  "environment": "#82ca9d",
  "social_responsibility": "#ffc658",
  "governance": "#0088fe",
  "supply_chain": "#00C49F",
  "human_rights": "#FFBB28",
  "diversity": "#FF8042",
  "other": "#777777"
};

// Helper to safely get color
const getCategoryColor = (category: string) => {
  return CATEGORY_COLORS[category] || "#777777";
};

// Helper to get category name
const getCategoryName = (category: string) => {
  return categoryOptions[category] || category;
};

interface DocumentData {
  id: string;
  name: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
}

interface CompanyData {
  name: string;
  description: string;
  employees: string;
  industry: string;
  [key: string]: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [userData, setUserData] = useState<any>(null);
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
          setDocuments(JSON.parse(savedDocs));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Format date to locale format
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get document category distribution for chart
  const getDocumentCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    
    documents.forEach(doc => {
      categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Get recent documents (last 5)
  const getRecentDocuments = () => {
    return [...documents]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 5);
  };

  // Calculate completeness based on documents and company info
  const calculateCompleteness = () => {
    let score = 0;
    const maxScore = 100;
    
    // Company profile completeness (max 40 points)
    if (company) {
      const requiredFields = ['name', 'description', 'industry', 'employees'];
      const completedFields = requiredFields.filter(field => !!company[field]);
      score += (completedFields.length / requiredFields.length) * 40;
    }
    
    // Document completeness (max 60 points)
    // Assume we need at least 10 documents with good distribution
    const categoryCount = new Set(documents.map(doc => doc.category)).size;
    const docScore = Math.min(documents.length, 10) * 4; // Max 40 points for doc count
    const categoryScore = Math.min(categoryCount, 5) * 4; // Max 20 points for category variety
    
    score += docScore + categoryScore;
    
    return Math.min(Math.round(score), maxScore);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completeness = calculateCompleteness();
  const recentDocuments = getRecentDocuments();
  const categoryData = getDocumentCategoryData();

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
        
        {/* Status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Färdigställande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completeness}%</div>
              <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Baserat på profil och dokumentation
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dokument
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Uppladdade dokument
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kategorier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(documents.map(doc => doc.category)).size}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Täckta hållbarhetsområden
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Senaste aktivitet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.length > 0 
                  ? formatDate(
                      documents.reduce((latest, doc) => 
                        new Date(doc.uploadDate) > new Date(latest) 
                          ? doc.uploadDate 
                          : latest, 
                        documents[0].uploadDate
                      )
                    )
                  : "Ingen aktivitet"
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Senaste uppladdning
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company information */}
          <Card className="bg-card lg:col-span-2">
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
          
          {/* Document distribution */}
          <Card className="bg-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Dokumentfördelning
              </CardTitle>
              <CardDescription>
                Fördelning per hållbarhetskategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${getCategoryName(name)}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Inga dokument ännu</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Ladda upp hållbarhetsdokument för att se fördelningen.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/documents")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Ladda upp dokument
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent documents & Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent documents */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Senaste dokument
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
                Nyligen uppladdade hållbarhetsdokument
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentDocuments.length > 0 ? (
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mr-4">
                        <div className="p-2 rounded-md bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                          <p className="text-xs text-muted-foreground">
                            {formatDate(doc.uploadDate)}
                          </p>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryName(doc.category)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Inga dokument uppladdade</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Börja med att ladda upp dina hållbarhetsdokument.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/documents")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Ladda upp dokument
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle>Snabbåtgärder</CardTitle>
              <CardDescription>
                Vanliga uppgifter och navigering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/documents")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ladda upp dokument
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/profile")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Uppdatera företagsprofil
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/analysis")}
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Se hållbarhetsanalys
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* CSRD Compliance */}
        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              CSRD Status
            </CardTitle>
            <CardDescription>
              Status för efterlevnad av Corporate Sustainability Reporting Directive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Färdigställande</span>
                  <span className="text-sm font-medium">{Math.round(completeness * 0.8)}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${Math.round(completeness * 0.8)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Baserat på dokumenttyper och kategorier
                </p>
              </div>
              
              <Button onClick={() => navigate("/analysis")}>
                Visa analys
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
