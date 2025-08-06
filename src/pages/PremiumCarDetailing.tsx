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

const washPackages: Service[] = [
  {
    id: 1,
    title: "FULL CLEAN",
    price: "€25",
    description: "Essential cleaning for everyday excellence.",
    icon: Sparkles,
    features: ["Exterior + full interior cleaning", "Scented color foam", "Wheel, underbody & glass cleaning", "Interior vacuuming"]
  },
  {
    id: 2,
    title: "TOP SHINE",
    price: "€49",
    description: "Enhanced protection with premium finishing.",
    icon: Shield,
    features: ["Includes all of Full Clean", "Quick body polish (protective cream)", "Interior plastic & vent detailing", "Includes DR7 luxury water"]
  },
  {
    id: 3,
    title: "VIP EXPERIENCE",
    price: "€75",
    description: "Comprehensive care with luxury extras.",
    icon: Star,
    features: ["Includes all of Top Shine", "Decontamination (tar, iron, etc.)", "Leather seat cleaning & sanitizing", "Full cabin ozone sanitation", "Premium body sealant", "Free DR7 fragrance + accessory"]
  },
  {
    id: 4,
    title: "DR7 LUXURY",
    price: "€99",
    description: "The ultimate detailing experience.",
    icon: Star,
    features: ["Includes all of VIP", "Deep full-detail sanitization", "Seat cleaning (cloth or leather)", "Full roof treatment (internal)", "Premium engine bay cleaning", "Premium DR7 fragrance + accessory"]
  }
];

interface CourtesyService {
  id: number;
  title: string;
  subtitle: string;
  pricing: { duration: string; price: string }[];
  description: string;
}

const courtesyServices: CourtesyService[] = [
  {
    id: 1,
    title: "Standard City Car",
    subtitle: "Perfect for errands or short waits",
    pricing: [
      { duration: "1 hr", price: "€15" },
      { duration: "2 hrs", price: "€25" },
      { duration: "3 hrs", price: "€35" }
    ],
    description: "Comfortable and reliable transportation while we detail your vehicle."
  },
  {
    id: 2,
    title: "Supercar Experience",
    subtitle: "Feel the thrill of luxury performance",
    pricing: [
      { duration: "1 hr", price: "€59" },
      { duration: "2 hrs", price: "€99" },
      { duration: "3 hrs", price: "€139" }
    ],
    description: "Experience our premium supercar collection."
  },
  {
    id: 3,
    title: "Ferrari / Lamborghini Experience",
    subtitle: "Drive one of our top supercars while we bring yours back to life",
    pricing: [
      { duration: "1 hr", price: "€149" },
      { duration: "2 hrs", price: "€249" },
      { duration: "3 hrs", price: "€299" }
    ],
    description: "The ultimate luxury experience with our flagship vehicles."
  }
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
            alt="DR7 Rapid Service"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-seasons text-luxury-gold mb-6">
            DR7 RAPID SERVICE
          </h1>
          <p className="text-xl md:text-2xl text-luxury-gold/80 mb-8 max-w-3xl mx-auto font-light">
            Fast & Premium Car Wash Services – No Appointment Needed
          </p>
          <p className="text-lg text-luxury-ivory/90 max-w-4xl mx-auto leading-relaxed">
            For a clean, detailed look every day. Choose excellence, speed, and luxury.
          </p>
        </div>
      </div>

      <main className="py-16">
        {/* Wash Packages Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-seasons text-luxury-gold mb-6">
              Wash Packages
            </h2>
            <p className="text-xl text-luxury-gold/80 max-w-2xl mx-auto">
              Premium car wash services with luxury-grade products and techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {washPackages.map((package_) => (
              <Card key={package_.id} className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <package_.icon className="w-12 h-12 text-luxury-gold mb-4" />
                    <h3 className="text-2xl font-seasons text-luxury-gold mb-2">
                      {package_.title}
                    </h3>
                    <div className="text-3xl font-bold text-luxury-gold mb-4">
                      {package_.price}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {package_.description}
                  </p>

                  {package_.features && (
                    <div className="space-y-2 mb-6">
                      {package_.features.map((feature, index) => (
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
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Courtesy Car Services */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-seasons text-luxury-gold mb-6">
              Courtesy Car / Supercar Experience
            </h2>
            <p className="text-xl text-luxury-gold/80 max-w-3xl mx-auto">
              Choose a vehicle to use while we clean yours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courtesyServices.map((service) => (
              <Card key={service.id} className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-seasons text-luxury-gold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-luxury-gold/80 mb-4 italic">
                      {service.subtitle}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {service.pricing.map((price, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-luxury-charcoal/10 rounded">
                        <span className="text-muted-foreground">{price.duration}</span>
                        <span className="text-luxury-gold font-bold">{price.price}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <Button
                    onClick={() => window.open('https://wa.me/393457905205', '_blank')}
                    variant="luxury"
                    className="w-full"
                  >
                    Book Experience
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <div className="container mx-auto px-4 text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-luxury-gold/90 mb-6 font-light italic">
              "Let your client feel it's more than a car"
            </p>
            <h3 className="text-3xl md:text-4xl font-seasons text-luxury-gold font-bold">
              PRESTIGE, PERFORMANCE, PERSONALITY
            </h3>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="container mx-auto px-4 text-center">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-seasons text-luxury-gold mb-4">
              Ready to Experience DR7 Rapid Service?
            </h3>
            <p className="text-muted-foreground mb-6">
              Contact us to book your luxury car wash service.
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
