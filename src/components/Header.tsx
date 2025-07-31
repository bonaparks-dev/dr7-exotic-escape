import { Button } from "@/components/ui/button";
import { MessageCircle, User, Menu, X, Phone, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false); // pour le menu déroulant mobile

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/0 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 flex flex-col items-center relative">

          {/* Icône WhatsApp mobile */}
          <div className="absolute top-6 left-4 sm:hidden">
            <a href="https://wa.me/393457905205" target="_blank" rel="noopener noreferrer" className="text-white">
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* Boutons à droite */}
          <div className="absolute top-6 right-4 flex items-center space-x-4">
            <Button
              variant="gold"
              size="sm"
              className="hidden sm:flex"
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            <Button 
              size="sm"
              className="bg-black text-white border-none shadow-none outline-none hover:bg-black/90 active:bg-black focus:ring-0 focus:outline-none"
              onClick={() => navigate("/auth")}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>

            <Button 
              size="sm"
              className="bg-black text-white border-none shadow-none outline-none hover:bg-black active:bg-black focus:ring-0 focus:outline-none md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Logo centré */}
          <a href="/" className="z-10 pt-2">
            <img 
              src="/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png" 
              alt="DR7 Exotic Cars & Luxury" 
              className="h-16 w-auto"
            />
          </a>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-10 mt-2 font-seasons relative z-50">
            {/* SERVICES dropdown */}
            <div className="relative group">
              <a
                href="#"
                className="text-luxury-gold hover:text-luxury-gold/80 transition-colors text-sm uppercase"
              >
                Services
              </a>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-52 bg-black/95 border border-luxury-gold/20 backdrop-blur-lg rounded-xl shadow-xl hidden group-hover:block">
                <ul className="flex flex-col py-2">
                  <li><a href="/services/supercars" className="block px-4 py-2 text-sm text-white hover:text-luxury-gold">Supercars</a></li>
                  <li><a href="/services/yachts" className="block px-4 py-2 text-sm text-white hover:text-luxury-gold">Luxury Yachts</a></li>
                  <li><a href="/services/jets" className="block px-4 py-2 text-sm text-white hover:text-luxury-gold">Private Jets</a></li>
                  <li><a href="/services/villas" className="block px-4 py-2 text-sm text-white hover:text-luxury-gold">Exclusive Villas</a></li>
                  <li><a href="/services" className="block px-4 py-2 text-sm text-white hover:text-luxury-gold">Rapid Services</a></li>
                </ul>
              </div>
            </div>

            <a href="#about" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors text-sm uppercase">
              About
            </a>

            <a href="#contact" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors text-sm uppercase">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 text-white flex flex-col justify-center items-center space-y-4">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* SERVICES mobile dropdown */}
          <div className="text-center">
            <button
              className="text-xl font-semibold flex items-center space-x-1"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              <span>Services</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {isServicesOpen && (
              <div className="mt-2 space-y-2">
                <a href="/services/supercars" className="block text-sm text-white hover:text-luxury-gold">Supercars</a>
                <a href="/services/yachts" className="block text-sm text-white hover:text-luxury-gold">Luxury Yachts</a>
                <a href="/services/jets" className="block text-sm text-white hover:text-luxury-gold">Private Jets</a>
                <a href="/services/villas" className="block text-sm text-white hover:text-luxury-gold">Exclusive Villas</a>
                <a href="/services" className="block text-sm text-white hover:text-luxury-gold">Rapid Services</a>
              </div>
            )}
          </div>

          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">About</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">Contact</a>
          <a href="/auth" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">Login</a>
        </div>
      )}
    </>
  );
}
