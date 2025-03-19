import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useToast } from "@/hooks/use-toast"; 
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Home, 
  User, 
  FileText, 
  BarChart2, 
  LogOut
} from "lucide-react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate auth check - would use a real auth hook in production
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsLoggedIn(!!token);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle route changes to close mobile menu
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Updated logout function with proper feedback and navigation
  const handleLogout = () => {
    // Clear all localStorage to start fresh
    localStorage.clear();
    
    setIsLoggedIn(false);
    
    // Show confirmation toast
    toast({
      title: "Utloggad",
      description: "Du har loggats ut från systemet",
      duration: 3000,
    });
    
    // Redirect to home page
    navigate("/");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary font-bold text-xl transition-all duration-300 hover:opacity-80"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
              <span className="hidden md:block">Hållbarhet</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                <NavLink to="/dashboard" active={location.pathname === "/dashboard"}>
                  <Home className="w-4 h-4 mr-2" />
                  Översikt
                </NavLink>
                <NavLink to="/profile" active={location.pathname === "/profile"}>
                  <User className="w-4 h-4 mr-2" />
                  Företag
                </NavLink>
                <NavLink to="/documents" active={location.pathname === "/documents"}>
                  <FileText className="w-4 h-4 mr-2" />
                  Dokument
                </NavLink>
                <NavLink to="/analysis" active={location.pathname === "/analysis"}>
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Analys
                </NavLink>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium ml-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logga ut
                </Button>
              </>
            ) : (
              <NavLink to="/login" active={location.pathname === "/login"}>
                Logga in
              </NavLink>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full hover:bg-muted transition-all duration-300"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isLoggedIn && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-full hover:bg-muted transition-all duration-300 md:hidden"
                title="Logga ut"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logga ut</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full hover:bg-muted transition-all duration-300 md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel m-4 animate-scale-in">
          <nav className="flex flex-col space-y-2 p-4">
            {isLoggedIn ? (
              <>
                <MobileNavLink to="/dashboard" active={location.pathname === "/dashboard"}>
                  <Home className="w-5 h-5 mr-2" />
                  Översikt
                </MobileNavLink>
                <MobileNavLink to="/profile" active={location.pathname === "/profile"}>
                  <User className="w-5 h-5 mr-2" />
                  Företag
                </MobileNavLink>
                <MobileNavLink to="/documents" active={location.pathname === "/documents"}>
                  <FileText className="w-5 h-5 mr-2" />
                  Dokument
                </MobileNavLink>
                <MobileNavLink to="/analysis" active={location.pathname === "/analysis"}>
                  <BarChart2 className="w-5 h-5 mr-2" />
                  Analys
                </MobileNavLink>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logga ut
                </Button>
              </>
            ) : (
              <MobileNavLink to="/login" active={location.pathname === "/login"}>
                Logga in
              </MobileNavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
