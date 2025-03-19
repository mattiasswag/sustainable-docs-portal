
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Users,
  Save,
  Loader2
} from "lucide-react";

interface CompanyData {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  employees: string;
  industry: string;
}

const initialCompanyData: CompanyData = {
  name: "",
  description: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Sverige",
  email: "",
  phone: "",
  website: "",
  employees: "",
  industry: "",
};

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState<CompanyData>(initialCompanyData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simulate loading company data
  useEffect(() => {
    const loadCompanyData = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have saved company data
        const savedData = localStorage.getItem("company-data");
        
        if (savedData) {
          setCompanyData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading company data:", error);
        toast.error("Ett fel uppstod vid laddning av företagsinformation");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompanyData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for demo purposes
      localStorage.setItem("company-data", JSON.stringify(companyData));
      
      toast.success("Företagsinformation sparad");
    } catch (error) {
      console.error("Error saving company data:", error);
      toast.error("Ett fel uppstod vid sparande av företagsinformation");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Företagsprofil</h2>
          <p className="text-muted-foreground">
            Hantera information om ditt företag för hållbarhetsrapportering
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Allmän information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Företagsnamn</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    value={companyData.name}
                    onChange={handleChange}
                    placeholder="Företagets namn"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Bransch</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={companyData.industry}
                  onChange={handleChange}
                  placeholder="t.ex. IT, Tillverkning, Detaljhandel"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Beskrivning av verksamheten</Label>
              <Textarea
                id="description"
                name="description"
                value={companyData.description}
                onChange={handleChange}
                placeholder="Beskriv företagets verksamhet och huvudsakliga fokusområden..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Kontaktinformation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleChange}
                    placeholder="kontakt@företag.se"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonnummer</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleChange}
                    placeholder="+46 123 456 789"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Webbplats</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="website"
                  name="website"
                  value={companyData.website}
                  onChange={handleChange}
                  placeholder="https://företag.se"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Adress</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Gatuadress</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleChange}
                  placeholder="Gatuadress"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postnummer</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={companyData.postalCode}
                  onChange={handleChange}
                  placeholder="123 45"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Ort</Label>
                <Input
                  id="city"
                  name="city"
                  value={companyData.city}
                  onChange={handleChange}
                  placeholder="Stockholm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Land</Label>
                <Input
                  id="country"
                  name="country"
                  value={companyData.country}
                  onChange={handleChange}
                  placeholder="Sverige"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Organisation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="employees">Antal anställda</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="employees"
                  name="employees"
                  type="number"
                  value={companyData.employees}
                  onChange={handleChange}
                  placeholder="t.ex. 42"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sparar...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Spara profil
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CompanyProfile;
