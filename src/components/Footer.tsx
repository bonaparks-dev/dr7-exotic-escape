import { MessageCircle, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-luxury-charcoal text-luxury-ivory">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              DR7 EXOTIC
            </div>
            <p className="text-luxury-ivory/70 leading-relaxed">
              Curating the world's most exclusive luxury experiences for the discerning few.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-luxury-ivory hover:text-luxury-gold">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-luxury-ivory hover:text-luxury-gold">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-luxury-ivory hover:text-luxury-gold">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-luxury-gold">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Supercars</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Luxury Yachts</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Private Jets</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Exclusive Villas</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Private Chefs</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-luxury-gold">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">About Us</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">How It Works</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Careers</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Press</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Partners</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-luxury-gold">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Help Center</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors">Terms of Service</a></li>
            </ul>
            
            <div className="pt-4">
              <Button
                variant="gold"
                className="w-full"
                onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Support
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-luxury-ivory/10 mt-12 pt-8 text-center">
          <p className="text-luxury-ivory/50">
            © 2024 DR7 Exotic. All rights reserved. Luxury redefined.
          </p>
        </div>
      </div>
    </footer>
  );
}