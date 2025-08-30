import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, Phone, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { t } = useLanguage();

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
              src="/logo4.png"
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
            className="absolute top-4 right-4 text-black"
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
               </div>
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
