
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
  Legend,
  LineChart,
  Line
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
  RefreshCw,
  TrendingUp,
  Lightbulb,
  Calendar
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
  accountingPeriod: string;
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

interface PredictiveData {
  year: string;
  co2: number;
  energy: number;
  gender: number;
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

const generatePredictiveData = (): PredictiveData[] => [
  { year: "2024", co2: 12.5, energy: 68, gender: 42 },
  { year: "2025", co2: 11.2, energy: 72, gender: 45 },
  { year: "2026", co2: 10.1, energy: 76, gender: 47 },
  { year: "2027", co2: 9.0, energy: 80, gender: 49 },
  { year: "2028", co2: 8.2, energy: 85, gender: 50 }
];

const generatePredictiveInsights = (): string[] => [
  "Baserat på nuvarande trender förväntas CO2-utsläppen minska med 34% fram till 2028.",
  "Användningen av förnybar energi förväntas öka till 85% år 2028, vilket överträffar branschgenomsnittet.",
  "Könsfördelningen förväntas bli jämn (50/50) omkring år 2028 om nuvarande utveckling fortsätter.",
  "För att accelerera minskningen av CO2-utsläpp rekommenderas ytterligare investeringar i energieffektivisering.",
  "Den förväntade utvecklingen för leverantörskedjan visar en förbättringspotential som kan kräva ytterligare åtgärder."
];

interface AnalysisViewProps {
  accountingPeriod: string;
}

const AnalysisView = ({ accountingPeriod }: AnalysisViewProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisSummary | null>(null);
  const [predictiveData, setPredictiveData] = useState<PredictiveData[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<string[]>([]);
  const [showPredictive, setShowPredictive] = useState(false);
  const [periodName, setPeriodName] = useState("");

  useEffect(() => {
    if (accountingPeriod) {
      const savedPeriods = localStorage.getItem("accounting-periods");
      if (savedPeriods) {
        const periods = JSON.parse(savedPeriods);
        const period = periods.find((p: any) => p.id === accountingPeriod);
        if (period) {
          setPeriodName(period.name);
        }
      }
    }
  }, [accountingPeriod]);

  useEffect(() => {
    if (accountingPeriod) {
      loadData();
    }
  }, [accountingPeriod]);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedDocs = localStorage.getItem("documents");
      let docs = savedDocs ? JSON.parse(savedDocs) : [];
      
      if (accountingPeriod) {
        docs = docs.filter((doc: Document) => doc.accountingPeriod === accountingPeriod);
      }
      
      setDocuments(docs);
      
      if (docs.length > 0) {
        await generateAnalysis(docs);
        setPredictiveData(generatePredictiveData());
        setPredictiveInsights(generatePredictiveInsights());
      } else {
        setAnalysis(null);
        setPredictiveData([]);
        setPredictiveInsights([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Ett fel uppstod vid laddning av analysdata");
    } finally {
      setIsLoading(false);
    }
  };

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
      setPredictiveData(generatePredictiveData());
      setPredictiveInsights(generatePredictiveInsights());
      
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

  const handleTogglePredictive = () => {
    setShowPredictive(prev => !prev);
    
    if (!showPredictive && predictiveData.length === 0) {
      setPredictiveData(generatePredictiveData());
      setPredictiveInsights(generatePredictiveInsights());
    }
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
              {accountingPeriod ? (
                <>
                  Det finns inga dokument för räkenskapsperioden "{periodName}". 
                  Ladda upp hållbarhetsdokument för denna period för att skapa en analys.
                </>
              ) : (
                "Välj en räkenskapsperiod och ladda upp hållbarhetsdokument för att skapa en analys."
              )}
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
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="font-medium mr-2">{periodName}</span> | 
                <span className="ml-2">Senast uppdaterad: {formatDate(analysis.lastUpdated)}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showPredictive ? "default" : "outline"}
                onClick={handleTogglePredictive}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {showPredictive ? "Dölj prediktiv analys" : "Visa prediktiv analys"}
              </Button>
              
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
                {analysis.categories.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysis.categories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analysis.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    Ingen dokumentdata tillgänglig
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Nyckelinsikter
                </CardTitle>
                <CardDescription>
                  AI-genererade insikter baserade på dina dokument
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className="flex">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                Detaljerade mätvärden
              </CardTitle>
              <CardDescription>
                Nyckeltal extraherade från dina hållbarhetsdokument
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.metrics.map((metric) => (
                  <Card key={metric.id} className="bg-card/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: getCategoryColor(metric.category) }}>
                            {getCategoryIcon(metric.category)}
                          </div>
                          <CardTitle className="text-base">{metric.name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold">
                          {typeof metric.value === 'number' ? 
                            metric.value % 1 === 0 ? 
                              metric.value : 
                              metric.value.toFixed(1) : 
                            metric.value}
                          <span className="text-sm ml-1 font-normal text-muted-foreground">{metric.unit}</span>
                        </div>
                        <div className="text-sm">
                          {getTrendIndicator(metric.trend, metric.changePercentage)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {showPredictive && (
            <>
              <Separator className="my-8" />
              
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Prediktiv analys</h2>
                <p className="text-muted-foreground mb-6">
                  AI-genererad prognos baserad på nuvarande data och trender
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Prognostiserade trender
                      </CardTitle>
                      <CardDescription>
                        Förväntad utveckling av nyckeltal över tid
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={predictiveData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="co2"
                              name="CO2-utsläpp (ton)"
                              stroke="#ff7300"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="energy"
                              name="Förnybar energi (%)"
                              stroke="#82ca9d"
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="gender"
                              name="Könsfördelning (%)"
                              stroke="#8884d8"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                        Prediktiva insikter
                      </CardTitle>
                      <CardDescription>
                        AI-baserade prognoser och rekommendationer
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {predictiveInsights.map((insight, index) => (
                          <li key={index} className="flex">
                            <span className="text-primary font-bold mr-2">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground italic">
                    OBS: Prediktiva data är baserade på historisk utveckling och trender. 
                    Faktiska resultat kan variera beroende på framtida åtgärder och omständigheter.
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default AnalysisView;
