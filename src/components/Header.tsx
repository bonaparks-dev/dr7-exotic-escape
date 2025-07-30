import { Button } from "@/components/ui/button";
import { MessageCircle, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  
  return (
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
            variant="outline" 
            size="sm"
            onClick={() => navigate("/auth")}
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}