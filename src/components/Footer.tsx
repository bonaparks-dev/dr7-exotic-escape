import { MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-background text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src="/logo2.png" 
              alt="DR7 Exotic Cars & Luxury" 
              className="h-12 w-auto"
            />
            
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-luxury-ivory hover:text-luxury-gold"
                onClick={() => window.open('https://www.instagram.com/dr7_exotic_cars', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-luxury-ivory hover:text-luxury-gold"
                onClick={() => window.open('https://tiktok.com/@dr7_exotic_cars', '_blank')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('services.supercars')}</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('services.yachts')}</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('services.jets')}</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('services.helicopters')}</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('services.villas')}</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('footer.company')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('footer.howitworks')}</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><a href="#contact" className="text-white/70 hover:text-white transition-colors">{t('btn.contact')}</a></li>
              <li><a href="/cookie-policy" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">{t('footer.terms')}</a></li>
            </ul>
            
            <div className="pt-4">
              <Button
                variant="luxury"
                className="w-full"
                onClick={() => window.open('https://wa.me/393457905205', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('footer.whatsappsupport')}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/70 text-sm">
            <span 
              className="inline-block tracking-wider font-medium whitespace-nowrap"
              style={{ letterSpacing: '0.1em' }}
            >
              {t('footer.rights').replace('S.p.A', 'S·p·A')}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
