import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Car } from "lucide-react";

export default function Services() {
  const [language, setLanguage] = useState<'it' | 'en'>('en');

  const content = {
    it: {
      title: "DR7 RAPID SERVICE – LISTINO MANODOPERA",
      subtitle: "Prezzi competitivi per servizi rapidi e professionali",
      languageToggle: "\ud83c\uddec\ud83c\udde7 English",
      services: {
        brakes: {
          title: "\ud83d\uded1 Cambio pastiglie freni",
          items: [
            { name: "Anteriori", price: "\u20ac29" },
            { name: "Posteriori", price: "\u20ac29" },
            { name: "Anteriori + Posteriori", price: "\u20ac49" }
          ]
        },
        oil: {
          title: "\ud83e\udebf Tagliando rapido (olio + filtri)",
          subtitle: "Controllo livelli incluso",
          items: [
            { name: "Auto cittadine", price: "\u20ac39" },
            { name: "Berline/SUV", price: "\u20ac49" },
            { name: "Auto di lusso/sportive", price: "\u20ac59" }
          ]
        },
        wipers: {
          title: "\ud83c\udf27\ufe0f Cambio spazzole tergicristalli",
          items: [
            { name: "Coppia anteriore", price: "\u20ac5" },
            { name: "Posteriore (se presente)", price: "\u20ac3" }
          ]
        },
        battery: {
          title: "\ud83d\udd0b Sostituzione batteria",
          items: [
            { name: "Auto cittadine", price: "\u20ac15" },
            { name: "Berline/SUV", price: "\u20ac19" }
          ]
        },
        bulbs: {
          title: "\ud83d\udca1 Cambio lampadine",
          items: [
            { name: "Lampadina standard", price: "\u20ac5 cad." },
            { name: "LED/Xenon", price: "\u20ac10 cad." }
          ]
        },
        mechanics: {
          title: "\ud83d\udd27 Piccola meccanica rapida",
          items: [
            { name: "Bracci tergicristalli", price: "\u20ac10 cad." },
            { name: "Bracci sospensioni (accesso facile)", price: "\u20ac29" },
            { name: "Sostituzione filtro aria/abitacolo", price: "\u20ac10 cad." }
          ]
        }
      },
      footer: "\u26a0\ufe0f Questi prezzi sono solo manodopera: i pezzi verranno forniti dal cliente o acquistati da noi separatamente."
    },
    en: {
    
      subtitle: "DR7 RAPID SERVICE – PRICE LIST",
      languageToggle: "\ud83c\uddee\ud83c\uddf9 Italiano",
      services: {
        brakes: {
          title: "\ud83d\uded1 Brake Pad Replacement",
          items: [
            { name: "Front", price: "\u20ac29" },
            { name: "Rear", price: "\u20ac29" },
            { name: "Front + Rear", price: "\u20ac49" }
          ]
        },
        oil: {
          title: "\ud83e\udebf Express Oil Service (oil + filters)",
          subtitle: "Includes fluid level check",
          items: [
            { name: "City cars", price: "\u20ac39" },
            { name: "Sedans/SUVs", price: "\u20ac49" },
            { name: "Luxury/Sports cars", price: "\u20ac59" }
          ]
        },
        wipers: {
          title: "\ud83c\udf27\ufe0f Wiper Blade Replacement",
          items: [
            { name: "Front pair", price: "\u20ac5" },
            { name: "Rear (if present)", price: "\u20ac3" }
          ]
        },
        battery: {
          title: "\ud83d\udd0b Battery Replacement",
          items: [
            { name: "City cars", price: "\u20ac15" },
            { name: "Sedans/SUVs", price: "\u20ac19" }
          ]
        },
        bulbs: {
          title: "\ud83d\udca1 Bulb Replacement",
          items: [
            { name: "Standard bulb", price: "\u20ac5 each" },
            { name: "LED/Xenon", price: "\u20ac10 each" }
          ]
        },
        mechanics: {
          title: "\ud83d\udd27 Quick Mechanical Fixes",
          items: [
            { name: "Wiper arms", price: "\u20ac10 each" },
            { name: "Suspension arms (easy access)", price: "\u20ac29" },
            { name: "Air/Cabin filter replacement", price: "\u20ac10 each" }
          ]
        }
      },
      footer: "\u26a0\ufe0f These prices refer to labor only: parts will either be supplied by the customer or purchased separately."
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-luxury-gold font-[The_Seasons] mb-4">
                  {currentContent.title}
                </h1>
                <p className="text-lg text-white/80 mb-6">
                  {currentContent.subtitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
                className="ml-4 bg-black text-white border-none hover:bg-neutral-900"
              >
                <img
                  src={language === 'en' ? "/icons/flag-it.svg" : "/icons/flag-us.svg"}
                  alt="Flag"
                  className="w-5 h-5 inline-block mr-2"
                />
                {currentContent.languageToggle}
              </Button>
            </div>
            <Separator className="mb-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.values(currentContent.services).map((service, index) => (
              <Card key={index} className="border border-luxury-gold/20 bg-white/5 backdrop-blur-md hover:border-luxury-gold transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-white">
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
                      <span className="text-sm text-white/70">
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

          <Card className="bg-muted/30 border-amber-200/30">
            <CardContent className="p-6">
              <p className="text-center text-sm text-white/60 leading-relaxed">
                {currentContent.footer}
              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <Button
              className="px-8 bg-luxury-gold text-black hover:bg-luxury-gold/90"
              size="lg"
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
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
