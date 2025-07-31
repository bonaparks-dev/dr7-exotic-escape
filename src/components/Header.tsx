import { Button } from "@/components/ui/button";
import { MessageCircle, User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png" 
              alt="DR7 Exotic Cars & Luxury" 
              className="h-16 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/services" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors">
              Services
            </a>
            <a href="#about" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors">
              About
            </a>
            <a href="#contact" className="text-luxury-gold hover:text-luxury-gold/80 transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 text-white flex flex-col justify-center items-center space-y-6">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <a href="/services" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">Services</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">About</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">Contact</a>
          <a href="/auth" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold">Login</a>
        </div>
      )}
    </>
  );
}
