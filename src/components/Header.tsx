import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, Phone, ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="container mx-auto px-4 py-2 flex flex-col items-center relative z-50 pointer-events-auto">
          {/* Phone icon on left */}
          <div className="absolute top-8 left-6">
            <a
              href="https://wa.me/393457905205"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground sm:hidden"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* Other buttons on right */}
          <div className="absolute top-6 right-4 flex items-center space-x-4">
            <LanguageToggle />
            
            {/* Auth buttons for desktop */}
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="luxury" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {user.email?.split('@')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === 'it' ? 'Esci' : 'Sign Out'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="luxury" size="sm">
                    {language === 'it' ? 'Accedi' : 'Sign In'}
                  </Button>
                </Link>
              )}
            </div>
            
            <Button
              variant="luxury"
              size="sm"
              className="hidden sm:flex"
              onClick={() =>
                window.open("https://wa.me/393457905205", "_blank")
              }
            >
              <MessageCircle className="w-4 h-4" />
              {t("btn.whatsapp")}
            </Button>

            {/* Burger menu button – blanc transparent, burger noir */}
            <Button
              size="sm"
              className="bg-white/20 text-black border border-white/30 hover:bg-white/30 transition"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Logo centré */}
          <a href="/" className="z-10 pt-2">
            <img
              src="/newlogo.png"
              alt="DR7 Exotic Cars & Luxury"
              className="h-16 w-auto"
            />
          </a>

        </div>
      </header>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 text-foreground flex flex-col justify-center items-center space-y-4">
          <button
            className="absolute top-4 right-4 text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <LanguageToggle />

          <div className="text-center">
            <button
              className="text-xl font-semibold flex items-center space-x-1"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              <span>{t("nav.services")}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {isServicesOpen && (
              <div className="mt-2 space-y-2">
                <a
                  href="/rentals"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("nav.rentcar")}
                </a>
                <a
                  href="/villa-listings"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("nav.villas")}
                </a>
                <a
                  href="/yacht-listings"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("nav.yacht")}
                </a>
                <a
                  href="/private-jet-listings"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("services.jets")}
                </a>
                <a
                  href="/helicopter-listings"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("services.helicopters")}
                </a>
                <a
                  href="/premium-car-detailing"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("nav.detailing")}
                </a>
                <a
                  href="/services"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("nav.rapidservices")}
                </a>
                <a
                  href="/membership"
                  className="block text-sm text-foreground hover:text-muted-foreground"
                >
                  {t("services.membership")}
                </a>
               </div>
             )}
           </div>

           {/* Auth section for mobile */}
           <div className="flex flex-col items-center space-y-2">
             {user ? (
               <>
                 <div className="text-sm text-foreground">
                   {user.email}
                 </div>
                 <Button 
                   variant="luxury" 
                   size="sm" 
                   onClick={handleSignOut}
                 >
                   <LogOut className="h-4 w-4 mr-2" />
                   {language === 'it' ? 'Esci' : 'Sign Out'}
                 </Button>
               </>
             ) : (
               <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                 <Button variant="luxury" size="sm">
                   {language === 'it' ? 'Accedi' : 'Sign In'}
                 </Button>
               </Link>
             )}
           </div>

           <a
             href="https://wa.me/393457905205?text=Hello%20DR7%20Exotic,%20I%20would%20like%20more%20information%20about%20your%20luxury%20services."
             target="_blank"
             rel="noopener noreferrer"
             onClick={() => setIsMenuOpen(false)}
             className="text-xl font-semibold"
           >
             {t("nav.contact")}
           </a>
        </div>
      )}
    </>
  );
}
