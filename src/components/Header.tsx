import { Button } from "@/components/ui/button";
import { MessageCircle, User, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/5e56409c-5698-4e7a-bf07-4cceb7a09004.png" 
            alt="DR7 Exotic Cars & Luxury" 
            className="h-10 w-auto"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#services" className="text-foreground hover:text-accent transition-colors">
            Services
          </a>
          <a href="#about" className="text-foreground hover:text-accent transition-colors">
            About
          </a>
          <a href="#contact" className="text-foreground hover:text-accent transition-colors">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
            onClick={() => window.open('https://wa.me/393457905205', '_blank')}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
          
          <Button variant="outline" size="sm">
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