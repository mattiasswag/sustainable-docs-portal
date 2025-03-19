import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import {
  BarChart2,
  PieChart as PieChartIcon,
  Users,
  Leaf,
  ShieldCheck,
  Building,
  FileText,
  Loader2,
  Download,
  RefreshCw
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
}

interface KeyMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  trend?: "up" | "down" | "neutral";
  changePercentage?: number;
}

interface AnalysisSummary {
  completeness: number;
  documentCount: number;
  categories: { name: string; count: number }[];
  metrics: KeyMetric[];
  insights: string[];
  lastUpdated: string;
}

const CATEGORY_COLORS = {
  gender_equality: "#8884d8",
  environment: "#82ca9d",
  social_responsibility: "#ffc658",
  governance: "#0088fe",
  supply_chain: "#00C49F",
  human_rights: "#FFBB28",
  diversity: "#FF8042",
  other: "#777777"
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  gender_equality: <Users className="h-5 w-5" />,
  environment: <Leaf className="h-5 w-5" />,
  social_responsibility: <ShieldCheck className="h-5 w-5" />,
  governance: <Building className="h-5 w-5" />,
  supply_chain: <BarChart2 className="h-5 w-5" />,
  human_rights: <Users className="h-5 w-5" />,
  diversity: <Users className="h-5 w-5" />,
  other: <FileText className="h-5 w-5" />
};

const getCategoryColor = (category: string) => {
  return (CATEGORY_COLORS as any)[category] || "#777777";
};

const getCategoryIcon = (category: string) => {
  return CATEGORY_ICONS[category] || <FileText className="h-5 w-5" />;
};

const generateMockMetrics = (): KeyMetric[] => [
  {
    id: "metric-1",
    name: "Könsfördelning",
    value: 42,
    unit: "%",
    category: "gender_equality",
    trend: "up",
    changePercentage: 5
  },
  {
    id: "metric-2",
    name: "CO2-utsläpp",
    value: 12.5,
    unit: "ton",
    category: "environment",
    trend: "down",
    changePercentage: 8
  },
  {
    id: "metric-3",
    name: "Förnybar energi",
    value: 68,
    unit: "%",
    category: "environment",
    trend: "up",
    changePercentage: 12
  },
  {
    id: "metric-4",
    name: "Medarbetarnöjdhet",
    value: 4.2,
    unit: "av 5",
    category: "social_responsibility",
    trend: "up",
    changePercentage: 3
  },
  {
    id: "metric-5",
    name: "Leverantörer med hållbarhetspolicy",
    value: 87,
    unit: "%",
    category: "supply_chain",
    trend: "up",
    changePercentage: 15
  },
  {
    id: "metric-6",
    name: "Medarbetare som genomgått utbildning i mänskliga rättigheter",
    value: 76,
    unit: "%",
    category: "human_rights",
    trend: "neutral",
    changePercentage: 0
  }
];

const generateMockInsights = (): string[] => [
  "Företaget uppvisar en positiv trend när det gäller könsfördelning med en ökning på 5% jämfört med föregående period.",
  "CO2-utsläppen har minskat med 8%, vilket visar på effektiviteten i företagets miljöprogram.",
  "Andelen förnybar energi har ökat markant med 12%, vilket överträffar branschstandarden.",
  "Fokusområden för förbättring inkluderar mångfald bland leverantörer och transparens i leverantörskedjan.",
  "Företagets rapportering inom socialt ansvar är omfattande, men kräver mer detaljerade mätetal för att uppfylla CSRD-kraven fullt ut.",
  "Rekommendation: Utveckla mer detaljerade policyer kring mänskliga rättigheter i leverantörskedjan."
];

const AnalysisView = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisSummary | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const savedDocs = localStorage.getItem("documents");
        const docs = savedDocs ? JSON.parse(savedDocs) : [];
        setDocuments(docs);
        
        if (docs.length > 0) {
          await generateAnalysis(docs);
        } else {
          setAnalysis(null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Ett fel uppstod vid laddning av analysdata");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const generateAnalysis = async (docs: Document[]) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const categoryCounts: Record<string, number> = {};
      docs.forEach(doc => {
        categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
      });
      
      const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count
      }));
      
      const analysisSummary: AnalysisSummary = {
        completeness: Math.min(Math.round((docs.length / 10) * 100), 100),
        documentCount: docs.length,
        categories: categoryData,
        metrics: generateMockMetrics(),
        insights: generateMockInsights(),
        lastUpdated: new Date().toISOString()
      };
      
      setAnalysis(analysisSummary);
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast.error("Ett fel uppstod vid generering av analys");
    }
  };

  const handleRefreshAnalysis = async () => {
    if (documents.length === 0) {
      toast.error("Det finns inga dokument att analysera. Ladda upp dokument först.");
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await generateAnalysis(documents);
      
      toast.success("Analysen har uppdaterats");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Ett fel uppstod vid uppdatering av analysen");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTrendIndicator = (trend?: "up" | "down" | "neutral", changePercentage?: number) => {
    if (!trend || trend === "neutral") {
      return <span className="text-muted-foreground">→ Oförändrad</span>;
    }
    
    if (trend === "up") {
      return (
        <span className="text-green-600 dark:text-green-500 font-medium">
          ↑ {changePercentage}% ökning
        </span>
      );
    }
    
    return (
      <span className="text-amber-600 dark:text-amber-500 font-medium">
        ↓ {changePercentage}% minskning
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Ingen analys tillgänglig</CardTitle>
            <CardDescription>
              Det finns inga dokument att analysera. Ladda upp hållbarhetsdokument för att skapa en analys.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => toast.info("Navigera till 'Dokument' för att ladda upp filer.")}>
              <FileText className="h-4 w-4 mr-2" />
              Ladda upp dokument
            </Button>
          </CardFooter>
        </Card>
      ) : analysis ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Hållbarhetsanalys</h2>
              <p className="text-muted-foreground">
                Senast uppdaterad: {formatDate(analysis.lastUpdated)}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => toast.info("Nedladdningsfunktionen är inte implementerad i denna demo.")}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportera rapport
              </Button>
              
              <Button onClick={handleRefreshAnalysis} disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uppdaterar...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Uppdatera analys
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Färdigställande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.completeness}%</div>
                <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${analysis.completeness}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Baserat på antal uppladdade dokument
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Antal dokument
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.documentCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dokument uppladdade för analys
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Täckta kategorier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.categories.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Olika hållbarhetskategorier
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Identifierade nyckeltal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.metrics.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Extraherade mätvärden
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                  Dokumentfördelning
                </CardTitle>
                <CardDescription>
                  Fördelning av dokument per hållbarhetskategori
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          const displayName = typeof name === 'string' ? name.split('_').join(' ') : name;
                          return `${displayName} (${(percent * 100).toFixed(0)}%)`;
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analysis.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => {
                          return [value, typeof name === 'string' ? name.split('_').join(' ') : name];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                  Nyckeltal
                </CardTitle>
                <CardDescription>
                  Viktiga hållbarhetsmätetal extraherade från dokumenten
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analysis.metrics.map(m => ({ 
                        name: m.name.length > 20 ? m.name.substring(0, 20) + '...' : m.name,
                        value: m.value, 
                        category: m.category 
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const metric = analysis.metrics.find(m => m.name.startsWith(props.payload.name.split('...')[0]));
                          return [`${value} ${metric?.unit}`, metric?.name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Värde">
                        {analysis.metrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Detaljerade mätvärden</CardTitle>
              <CardDescription>
                Hållbarhetsmätetal extraherade från dina dokument
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.metrics.map((metric) => (
                  <div key={metric.id} className="flex space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${getCategoryColor(metric.category)}20` }}>
                        {getCategoryIcon(metric.category)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{metric.name}</h4>
                      <div className="text-2xl font-bold">
                        {metric.value} <span className="text-sm font-normal">{metric.unit}</span>
                      </div>
                      <div className="text-sm">
                        {getTrendIndicator(metric.trend, metric.changePercentage)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Insikter och rekommendationer</CardTitle>
              <CardDescription>
                AI-genererade insikter baserade på dina hållbarhetsdokument
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {index + 1}
                    </div>
                    <p className="text-foreground">{insight}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle>CSRD-efterlevnad</CardTitle>
              <CardDescription>
                Status för efterlevnad av Corporate Sustainability Reporting Directive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total efterlevnad</span>
                    <span className="font-bold">{Math.round(analysis.completeness * 0.8)}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.round(analysis.completeness * 0.8)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baserat på dokumentens täckning av CSRD-krav
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Rekommenderade åtgärder</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs">
                        !
                      </div>
                      <p className="text-sm">
                        Komplettera med mer detaljerad information om leverantörskedjan och due diligence-processer.
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs">
                        !
                      </div>
                      <p className="text-sm">
                        Utveckla mer konkreta klimatmål med tydliga åtgärdsplaner.
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs">
                        !
                      </div>
                      <p className="text-sm">
                        Inkludera mer information om affärsmodellen och hur hållbarhet integreras i den.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  Förberedd för CSRD-rapportering 2024
                </p>
                <Button 
                  variant="outline"
                  onClick={() => toast.info("Funktionen för att generera CSRD-rapport är inte implementerad i denna demo.")}
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generera CSRD-underlag
                </Button>
              </div>
            </CardFooter>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default AnalysisView;

