import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Star, Sparkles, Shield, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  id: number;
  title: string;
  price: string;
  description: string;
  icon: any;
  features?: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: "Manual Premium Wash",
    price: "€25",
    description: "Exterior + full interior + seats, windows, dashboard, vacuuming & microfiber cloth drying.",
    icon: Sparkles,
    features: ["Complete exterior wash", "Full interior cleaning", "Microfiber cloth drying", "Dashboard detailing"]
  },
  {
    id: 2,
    title: "Premium Wash with Ozone",
    price: "€30",
    description: "Same as above + antibacterial ozone treatment inside the climate system (removes mold, odors, and pathogens).",
    icon: Shield,
    features: ["All Premium Wash benefits", "Antibacterial ozone treatment", "Mold & odor elimination", "Pathogen removal"]
  },
  {
    id: 3,
    title: "Auto Scent Diffuser",
    price: "€15",
    description: "Exclusive long-lasting fragrance available in selected scents.",
    icon: Star,
    features: ["Exclusive Dubai Rent fragrance", "Long-lasting scent", "Selected premium fragrances", "Professional application"]
  },
  {
    id: 4,
    title: "Seat Stain Removal",
    price: "€10 per seat",
    description: "Professional stain removal treatment for individual seats.",
    icon: Droplets,
    features: ["Professional grade products", "Per seat treatment", "Safe for all materials", "Guaranteed results"]
  },
  {
    id: 5,
    title: "Steering Wheel Treatment",
    price: "€15",
    description: "Specialized care for steering wheel restoration and protection.",
    icon: Shield,
    features: ["Restoration treatment", "Protection coating", "Premium conditioning", "Enhanced grip comfort"]
  },
  {
    id: 6,
    title: "Alcantara Interior Treatment",
    price: "€100",
    description: "Complete interior treatment with nourishing creams and specific products.",
    icon: Star,
    features: ["Professional nourishing creams", "Alcantara-specific products", "Complete interior care", "Premium conditioning"]
  }
];

const additionalServices = [
  { name: "Front Headlight Polishing", price: "€10 per session" },
  { name: "Rear Headlight Polishing", price: "€10 per session" },
  { name: "Water-repellent Glass Treatment", price: "€10 per session" },
  { name: "Wheel and Body Decontamination", price: "€10 per session" }
];

const PremiumCarDetailing = () => {
  const navigate = useNavigate();

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
            alt="Luxury Car Detailing"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-seasons text-luxury-gold mb-6">
            Luxury Car Detailing
          </h1>
          <p className="text-xl md:text-2xl text-luxury-gold/80 mb-8 max-w-3xl mx-auto font-light">
            Tailored care for prestige vehicles
          </p>
          <p className="text-lg text-luxury-ivory/90 max-w-4xl mx-auto leading-relaxed">
            Every vehicle treated by DR7 Exotic receives the same attention reserved for our official supercar fleet.
          </p>
        </div>
      </div>

      <main className="py-16">
        {/* Premium Services Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-seasons text-luxury-gold mb-6">
              Premium Services
            </h2>
            <p className="text-xl text-luxury-gold/80 max-w-2xl mx-auto">
              Professional detailing with luxury-grade products and techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <service.icon className="w-12 h-12 text-luxury-gold mb-4" />
                    <h3 className="text-xl font-seasons text-luxury-gold mb-2">
                      {service.title}
                    </h3>
                    <div className="text-2xl font-bold text-luxury-gold mb-4">
                      {service.price}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {service.features && (
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <span className="w-2 h-2 bg-luxury-gold rounded-full mr-3"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => window.open('https://wa.me/393457905205', '_blank')}
                    variant="luxury"
                    className="w-full mt-6"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Promotions Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-luxury rounded-lg p-8 text-center border border-luxury-gold/20">
            <h3 className="text-3xl font-seasons text-luxury-gold mb-6">
              Exclusive Fragrances Promos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-luxury-charcoal/20 rounded-lg p-6 border border-luxury-gold/10">
                <h4 className="text-xl font-bold text-luxury-gold mb-2">Buy 3 Fragrances</h4>
                <p className="text-luxury-ivory">Ozone Wash for only <span className="text-luxury-gold font-bold">€10</span></p>
              </div>
              <div className="bg-luxury-charcoal/20 rounded-lg p-6 border border-luxury-gold/10">
                <h4 className="text-xl font-bold text-luxury-gold mb-2">Buy 4 Fragrances</h4>
                <p className="text-luxury-ivory">Ozone Wash <span className="text-luxury-gold font-bold">FREE</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-seasons text-luxury-gold mb-6">
              Exterior Aesthetic Treatments
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-6 hover:shadow-luxury transition-all duration-300">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-luxury-charcoal">{service.name}</h4>
                  <span className="text-xl font-bold text-luxury-gold">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Sanitization */}
        <div className="container mx-auto px-4 mb-16">
          <Card className="bg-luxury-charcoal/5 border-luxury-gold/20 max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-luxury-gold mx-auto mb-6" />
              <h3 className="text-3xl font-seasons text-luxury-gold mb-4">
                Full Sanitization Treatment
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Deep Interior Hygiene Treatment - Custom treatment: carpets, air vents, ceiling, seats, plastics, antibacterial vapor.
              </p>
              <div className="text-2xl font-bold text-luxury-gold mb-6">
                From €120 to €200
              </div>
              <Button
                onClick={() => window.open('https://wa.me/393457905205', '_blank')}
                variant="luxury"
                size="lg"
              >
                Request Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Final Message */}
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-luxury-gold/90 mb-6 font-light italic">
              "We don't call it washing like the others do. We call it: respect for every detail."
            </p>
            <h3 className="text-3xl md:text-4xl font-seasons text-luxury-gold font-bold">
              PRESTIGE, PERFORMANCE, PERSONALITY
            </h3>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-seasons text-luxury-gold mb-4">
              Ready to Experience Premium Detailing?
            </h3>
            <p className="text-muted-foreground mb-6">
              Contact us to book your luxury car detailing service.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
              variant="gold"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Book Now via WhatsApp
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PremiumCarDetailing;
