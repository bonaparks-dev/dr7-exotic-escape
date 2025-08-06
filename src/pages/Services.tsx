import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Wrench, Settings, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: any;
  items: { name: string; price: string }[];
}

const services: Service[] = [
  {
    id: 1,
    title: "Brake Pad Replacement",
    description: "Professional brake maintenance for your safety",
    icon: Settings,
    items: [
      { name: "Front", price: "€29" },
      { name: "Rear", price: "€29" },
      { name: "Front + Rear", price: "€49" }
    ]
  },
  {
    id: 2,
    title: "Express Oil Service",
    description: "Oil + filters with fluid level check",
    icon: Wrench,
    items: [
      { name: "City cars", price: "€39" },
      { name: "Sedans/SUVs", price: "€49" },
      { name: "Luxury/Sports cars", price: "€59" }
    ]
  },
  {
    id: 3,
    title: "Wiper Blade Replacement",
    description: "Clear vision in all weather conditions",
    icon: Settings,
    items: [
      { name: "Front pair", price: "€5" },
      { name: "Rear (if present)", price: "€3" }
    ]
  },
  {
    id: 4,
    title: "Battery Replacement",
    description: "Reliable power for your vehicle",
    icon: Wrench,
    items: [
      { name: "City cars", price: "€15" },
      { name: "Sedans/SUVs", price: "€19" }
    ]
  },
  {
    id: 5,
    title: "Bulb Replacement",
    description: "Professional lighting solutions",
    icon: Settings,
    items: [
      { name: "Standard bulb", price: "€5 each" },
      { name: "LED/Xenon", price: "€10 each" }
    ]
  },
  {
    id: 6,
    title: "Quick Mechanical Fixes",
    description: "Fast and reliable mechanical services",
    icon: Wrench,
    items: [
      { name: "Wiper arms", price: "€10 each" },
      { name: "Suspension arms (easy access)", price: "€29" },
      { name: "Air/Cabin filter replacement", price: "€10 each" }
    ]
  }
];

export default function Services() {
  const navigate = useNavigate();

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
        Back to Home
      </Button>

      <Button
        onClick={() => window.open('https://wa.me/393457905205', '_blank')}
        className="fixed bottom-20 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg md:hidden"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="/cars.jpg"
            alt="DR7 Rapid Services"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-seasons text-luxury-gold mb-6">
            Rapid Services
          </h1>
          <p className="text-xl md:text-2xl text-luxury-gold/80 mb-8 max-w-3xl mx-auto font-light">
            Competitive pricing for fast and professional services
          </p>
          <p className="text-lg text-luxury-ivory/90 max-w-4xl mx-auto leading-relaxed">
            Quick, reliable, and professional automotive services you can trust.
          </p>
        </div>
      </div>

      <main className="py-16">
        {/* Services Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-seasons text-luxury-gold mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional automotive services with transparent pricing
            </p>
          </div>

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
                    Book Now
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
              ⚠️ <strong>Important:</strong> These prices refer to labor only. Parts will either be supplied by the customer or purchased separately.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="container mx-auto px-4 text-center">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-luxury-gold mb-4">
              Need a Service?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact us to schedule your automotive service today.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
              variant="gold"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Book Service Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
