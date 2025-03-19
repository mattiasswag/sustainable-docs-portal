
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import { ArrowRight, FileText, BarChart2, Check, Shield } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // If logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  // Features list
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Dokumenthantering",
      description: "Ladda upp och organisera hållbarhetsdokument på ett säkert och strukturerat sätt."
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Avancerad analys",
      description: "Extrahera nyckeltal och insikter automatiskt med hjälp av AI-teknologi."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "CSRD-kompatibelt",
      description: "Generera underlag för hållbarhetsrapportering enligt CSRD-direktivet."
    }
  ];

  // Benefits list
  const benefits = [
    "Minskad arbetsbelastning för hållbarhetsrapportering",
    "Automatiserad dataextrahering från dokument",
    "Intelligenta insikter för förbättrad hållbarhetsstrategi",
    "Anpassat för svenska företag och regelverk",
    "Säker datalagring och hantering",
    "Kontinuerligt uppdaterade funktioner"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="relative">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero text */}
            <div className="space-y-6 max-w-xl animate-slide-up">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                Förenkla din hållbarhetsrapportering
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Hållbarhetsrapportering som <span className="text-primary">aldrig förr</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Ladda upp dina hållbarhetsdokument och låt AI:n extrahera nyckeltal, 
                skapa insikter och förbereda underlag för CSRD-rapportering.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!showLoginForm && (
                  <>
                    <Button 
                      size="lg" 
                      onClick={() => setShowLoginForm(true)}
                      className="relative overflow-hidden group"
                    >
                      <span className="relative z-10">Kom igång nu</span>
                      <span className="absolute inset-0 bg-primary/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                    >
                      Läs mer
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Right side - Login form or image */}
            <div className="lg:justify-self-end w-full max-w-md mx-auto lg:mx-0">
              {showLoginForm ? (
                <div className="glass-panel p-8 animate-scale-in">
                  <LoginForm 
                    onSuccess={() => {
                      setIsLoggedIn(true);
                      navigate("/dashboard");
                    }} 
                  />
                </div>
              ) : (
                <div className="glass-panel p-6 animate-fade-in">
                  <img 
                    src="https://images.unsplash.com/photo-1551651601-ee2d09c3cd49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Sustainability dashboard" 
                    className="w-full h-auto rounded-lg object-cover shadow-lg" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Allt du behöver för CSRD-rapportering</h2>
            <p className="text-xl text-muted-foreground">
              Vår plattform förenklar hanteringen av hållbarhetsdata och hjälper dig att uppfylla CSRD-kraven.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card border rounded-xl p-6 transition-all duration-300 hover:shadow-md scale-animation"
              >
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-6">Fördelar för ditt företag</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Vår plattform hjälper dig att effektivisera hållbarhetsrapporteringen och få värdefulla insikter.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                size="lg" 
                onClick={() => setShowLoginForm(true)}
                className="mt-8"
              >
                Prova nu 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="lg:justify-self-end">
              <div className="glass-panel p-1 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1611187401884-fef4c61dff92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Sustainability reporting" 
                  className="rounded-lg h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Redo att förenkla din hållbarhetsrapportering?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Börja använda vår plattform idag och spara tid samtidigt som du förbättrar kvaliteten på din rapportering.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowLoginForm(true)}
          >
            Kom igång nu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Hållbarhet. Alla rättigheter förbehållna.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Integritetspolicy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Användarvillkor</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
