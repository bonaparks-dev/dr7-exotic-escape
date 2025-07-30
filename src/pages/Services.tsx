import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  Wrench, 
  Zap, 
  Eye, 
  Battery,
  Lightbulb,
  Settings
} from "lucide-react";

export default function Services() {
  const [language, setLanguage] = useState<'it' | 'en'>('en');

  const content = {
    it: {
      title: "DR7 RAPID SERVICE – LISTINO MANODOPERA",
      subtitle: "Prezzi competitivi per servizi rapidi e professionali",
      languageToggle: "🇬🇧 English",
      services: {
        brakes: {
          title: "🛑 Cambio pastiglie freni",
          items: [
            { name: "Anteriori", price: "€29" },
            { name: "Posteriori", price: "€29" },
            { name: "Anteriori + Posteriori", price: "€49" }
          ]
        },
        oil: {
          title: "🛢️ Tagliando rapido (olio + filtri)",
          subtitle: "Controllo livelli incluso",
          items: [
            { name: "Auto cittadine", price: "€39" },
            { name: "Berline/SUV", price: "€49" },
            { name: "Auto di lusso/sportive", price: "€59" }
          ]
        },
        wipers: {
          title: "🌧️ Cambio spazzole tergicristalli",
          items: [
            { name: "Coppia anteriore", price: "€5" },
            { name: "Posteriore (se presente)", price: "€3" }
          ]
        },
        battery: {
          title: "🔋 Sostituzione batteria",
          items: [
            { name: "Auto cittadine", price: "€15" },
            { name: "Berline/SUV", price: "€19" }
          ]
        },
        bulbs: {
          title: "💡 Cambio lampadine",
          items: [
            { name: "Lampadina standard", price: "€5 cad." },
            { name: "LED/Xenon", price: "€10 cad." }
          ]
        },
        mechanics: {
          title: "🔧 Piccola meccanica rapida",
          items: [
            { name: "Bracci tergicristalli", price: "€10 cad." },
            { name: "Bracci sospensioni (accesso facile)", price: "€29" },
            { name: "Sostituzione filtro aria/abitacolo", price: "€10 cad." }
          ]
        }
      },
      footer: "⚠️ Questi prezzi sono solo manodopera: i pezzi verranno forniti dal cliente o acquistati da noi separatamente."
    },
    en: {
      title: "DR7 RAPID SERVICE – LABOR PRICE LIST",
      subtitle: "Competitive pricing for fast and professional services",
      languageToggle: "🇮🇹 Italiano",
      services: {
        brakes: {
          title: "🛑 Brake Pad Replacement",
          items: [
            { name: "Front", price: "€29" },
            { name: "Rear", price: "€29" },
            { name: "Front + Rear", price: "€49" }
          ]
        },
        oil: {
          title: "🛢️ Express Oil Service (oil + filters)",
          subtitle: "Includes fluid level check",
          items: [
            { name: "City cars", price: "€39" },
            { name: "Sedans/SUVs", price: "€49" },
            { name: "Luxury/Sports cars", price: "€59" }
          ]
        },
        wipers: {
          title: "🌧️ Wiper Blade Replacement",
          items: [
            { name: "Front pair", price: "€5" },
            { name: "Rear (if present)", price: "€3" }
          ]
        },
        battery: {
          title: "🔋 Battery Replacement",
          items: [
            { name: "City cars", price: "€15" },
            { name: "Sedans/SUVs", price: "€19" }
          ]
        },
        bulbs: {
          title: "💡 Bulb Replacement",
          items: [
            { name: "Standard bulb", price: "€5 each" },
            { name: "LED/Xenon", price: "€10 each" }
          ]
        },
        mechanics: {
          title: "🔧 Quick Mechanical Fixes",
          items: [
            { name: "Wiper arms", price: "€10 each" },
            { name: "Suspension arms (easy access)", price: "€29" },
            { name: "Air/Cabin filter replacement", price: "€10 each" }
          ]
        }
      },
      footer: "⚠️ These prices refer to labor only: parts will either be supplied by the customer or purchased separately."
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {currentContent.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {currentContent.subtitle}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
                className="ml-4"
              >
                {currentContent.languageToggle}
              </Button>
            </div>
            <Separator className="mb-8" />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.values(currentContent.services).map((service, index) => (
              <Card key={index} className="border-luxury-gold/20 hover:border-luxury-gold/40 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                  {'subtitle' in service && (
                    <p className="text-sm text-luxury-gold italic">
                      {service.subtitle}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">
                        {item.name}
                      </span>
                      <span className="font-semibold text-luxury-gold">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Notice */}
          <Card className="bg-muted/30 border-amber-200/30">
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground leading-relaxed">
                {currentContent.footer}
              </p>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <Button
              variant="gold"
              size="lg"
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
              className="px-8"
            >
              <Car className="w-5 h-5 mr-2" />
              {language === 'en' ? 'Book Service Now' : 'Prenota Servizio'}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}