import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Wrench, Settings, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: any;
  items: { name: string; price: string }[];
}

const useServices = (t: any): Service[] => [
  {
    id: 1,
    title: t('services.brakepad'),
    description: t('services.brakepadDesc'),
    icon: Settings,
    items: [
      { name: t('services.front'), price: "€29" },
      { name: t('services.rear'), price: "€29" },
      { name: t('services.frontplusrear'), price: "€49" }
    ]
  },
  {
    id: 2,
    title: t('services.oilservice'),
    description: t('services.oilserviceDesc'),
    icon: Wrench,
    items: [
      { name: t('services.citycars'), price: "€39" },
      { name: t('services.sedansuvs'), price: "€49" },
      { name: t('services.luxurysports'), price: "€59" }
    ]
  },
  {
    id: 3,
    title: t('services.wiperblade'),
    description: t('services.wiperbladeDesc'),
    icon: Settings,
    items: [
      { name: t('services.frontpair'), price: "€5" },
      { name: t('services.rearif'), price: "€3" }
    ]
  },
  {
    id: 4,
    title: t('services.battery'),
    description: t('services.batteryDesc'),
    icon: Wrench,
    items: [
      { name: t('services.citycars'), price: "€15" },
      { name: t('services.sedansuvs'), price: "€19" }
    ]
  },
  {
    id: 5,
    title: t('services.bulb'),
    description: t('services.bulbDesc'),
    icon: Settings,
    items: [
      { name: t('services.standardbulb'), price: "€5 each" },
      { name: t('services.ledxenon'), price: "€10 each" }
    ]
  },
  {
    id: 6,
    title: t('services.quickmech'),
    description: t('services.quickmechDesc'),
    icon: Wrench,
    items: [
      { name: t('services.wiperarms'), price: "€10 each" },
      { name: t('services.suspensionarms'), price: "€29" },
      { name: t('services.aircabinfilter'), price: "€10 each" }
    ]
  }
];

export default function Services() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const services = useServices(t);

  const generateWhatsAppMessage = (service: Service) => {
    let message = `Hello DR7 Exotic, I would like to book the following service:\n\n`;
    message += `Service: ${service.title}\n`;
    message += `Options:\n`;
    
    service.items.forEach(item => {
      message += `- ${item.name}: ${item.price}\n`;
    });
    
    message += `\nPlease let me know the availability. Thank you!`;
    return encodeURIComponent(message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Button
        onClick={() => navigate('/')}
        className="fixed top-24 left-4 z-40 bg-luxury-charcoal/90 text-luxury-ivory border border-luxury-gold/20 hover:bg-luxury-charcoal backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('rentals.backto')}
      </Button>

      <Button
        onClick={() => window.open('https://wa.me/393457905205', '_blank')}
        className="fixed bottom-20 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg md:hidden"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>


      <main className="py-16">
        {/* Services Section */}
        <div className="container mx-auto px-4 mb-16">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <service.icon className="w-8 h-8 text-luxury-gold mb-3" />
                    <h3 className="text-xl font-seasons text-luxury-gold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {service.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-luxury-gold font-bold">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      const message = generateWhatsAppMessage(service);
                      window.open(`https://wa.me/393457905205?text=${message}`, '_blank');
                    }}
                    variant="luxury"
                    className="w-full"
                  >
                    {t('rentals.booknow')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-6">
            <p className="text-center text-sm text-muted-foreground leading-relaxed">
              ⚠️ <strong>{t('services.important')}</strong> {t('services.importantnote')}
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="container mx-auto px-4 text-center">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-luxury-gold mb-4">
              {t('services.needservice')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('services.needservicedesc')}
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('services.bookservicenow')}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
