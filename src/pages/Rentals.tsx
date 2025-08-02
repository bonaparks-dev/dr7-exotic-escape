import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Car {
  id: number;
  name: string;
  price: string;
  specs: {
    acceleration?: string;
    maxSpeed?: string;
    power?: string;
    torque?: string;
    engine: string;
    special?: string;
  };
  description: string;
  image: string;
  color?: string;
}

const cars: Car[] = [
  {
    id: 1,
    name: "BMW M3 Competition",
    price: "239€/day",
    specs: {
      acceleration: "0–100 in 3.9s",
      maxSpeed: "Max speed: 250km/h",
      power: "510Cv",
      torque: "650Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "Un'icona che domina la strada.",
    image: "/bmw-m3.png"
  },
  {
    id: 2,
    name: "Audi RS3",
    price: "229€/day",
    specs: {
      acceleration: "0–100 in 3.8s",
      maxSpeed: "Max speed: 250km/h",
      power: "400Cv",
      torque: "500Nm",
      engine: "2.4L inline 5-cylinder"
    },
    description: "Impossibile passare senza voltarsi.",
    image: "/rs3.png",
    color: "Green"
  },
  {
    id: 3,
    name: "Porsche 911 Carrera 4S",
    price: "269€/day",
    specs: {
      acceleration: "0–100 in 3.6s",
      maxSpeed: "Max speed: 306km/h",
      power: "450Cv",
      torque: "530Nm",
      engine: "3.0L V6"
    },
    description: "La firma eterna di Porsche.",
    image: "/porsche911.png"
  },
  {
    id: 4,
    name: "Hummer H2",
    price: "149€/day",
    specs: {
      acceleration: "0–100 in 7.8s",
      maxSpeed: "Max speed: 160km/h",
      power: "398Cv",
      torque: "574Nm",
      engine: "6.2L V8"
    },
    description: "Presenza da leggenda.",
    image: "/hummer.png"
  },
  {
    id: 5,
    name: "Mercedes GLE 53 AMG",
    price: "239€/day",
    specs: {
      acceleration: "0–100 in 4.7s",
      maxSpeed: "Max speed: 250km/h",
      power: "544Cv",
      torque: "750Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "Nato per distinguersi.",
    image: "/mercedes-gle.png"
  },
  {
    id: 6,
    name: "Mercedes A45 AMG",
    price: "219€/day",
    specs: {
      acceleration: "0–100 in 3.9s",
      power: "421Cv",
      torque: "500Nm",
      engine: "2.0L 4-cylinder Turbo"
    },
    description: "Compact but wild.",
    image: "/mercedes-a45",
    color: "Yellow"
  },
  {
    id: 7,
    name: "BMW M4 Competition",
    price: "249€/day",
    specs: {
      acceleration: "0–100 in 3.8s",
      power: "510Cv",
      torque: "650Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "Iconic performance in style.",
    image: "/bmw-m4",
    color: "Black"
  },
  {
    id: 8,
    name: "Lamborghini URUS",
    price: "589€/day",
    specs: {
      special: "Perfect for off-road adventures",
      engine: "2.0L Turbo – 4x4"
    },
    description: "Ready for any terrain.",
    image: "/urus.png",
    color: "Black"
  },
  {
    id: 9,
    name: "Ferrari Portofino M",
    price: "589€/day",
    specs: {
      acceleration: "0–100 in 3.6s",
      power: "620Cv",
      engine: "3.9L V8"
    },
    description: "Open-top Italian dream.",
    image: "/ferrari-portofino.png"
  },
  {
    id: 10,
    name: "Lamborghini Huracán Evo",
    price: "499€/day",
    specs: {
      acceleration: "0–100 in 2.9s",
      power: "640Cv",
      engine: "5.2L V10"
    },
    description: "Pure performance and drama.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    color: "White"
  },
  {
    id: 11,
    name: "Range Rover Sport SVR",
    price: "229€/day",
    specs: {
      power: "575Cv",
      engine: "5.0L V8 Supercharged"
    },
    description: "Luxury meets raw power.",
    image: "https://images.unsplash.com/photo-1606016159991-4dd4266c6db7?w=800&h=600&fit=crop",
    color: "Black"
  },
  {
    id: 12,
    name: "McLaren 570S",
    price: "479€/day",
    specs: {
      acceleration: "0–100 in 3.2s",
      power: "570Cv",
      engine: "3.8L V8 Twin Turbo"
    },
    description: "Race-bred elegance.",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
    color: "Orange"
  },
  {
    id: 13,
    name: "Mercedes G63 AMG",
    price: "399€/day",
    specs: {
      power: "585Cv",
      engine: "4.0L V8 BiTurbo"
    },
    description: "The king of urban luxury SUVs.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    color: "Black"
  },
  {
    id: 14,
    name: "BMW X6M Competition",
    price: "269€/day",
    specs: {
      power: "625Cv",
      engine: "4.4L V8"
    },
    description: "M Power meets utility.",
    image: "https://images.unsplash.com/photo-1606016159991-4dd4266c6db7?w=800&h=600&fit=crop",
    color: "Gray"
  },
  {
    id: 15,
    name: "Lamborghini Urus",
    price: "459€/day",
    specs: {
      acceleration: "0–100 in 3.6s",
      power: "650Cv",
      engine: "4.0L V8"
    },
    description: "Super SUV. No compromise.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
    color: "Green"
  }
];

const Rentals = () => {
  const navigate = useNavigate();

  const openWhatsApp = (carName: string) => {
    const message = `I'm interested in renting the ${carName} from DR7 Exotic.`;
    const whatsappUrl = `https://wa.me/393457905205?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Fixed Back Button */}
      <Button
        onClick={() => navigate('/')}
        className="fixed top-24 left-4 z-40 bg-luxury-charcoal/90 text-luxury-ivory border border-luxury-gold/20 hover:bg-luxury-charcoal backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      {/* Floating WhatsApp Button */}
      <Button
        onClick={() => window.open('https://wa.me/393457905205', '_blank')}
        className="fixed bottom-20 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg md:hidden"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-seasons text-luxury-gold mb-4">
            Exotic Car Collection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the ultimate luxury with our premium collection of exotic supercars. 
            Every vehicle includes 200km per day and comprehensive insurance.
          </p>
        </div>

        {/* Cars Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <Card key={car.id} className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-seasons text-luxury-gold mb-1">
                        {car.name}
                        {car.color && <span className="text-sm text-muted-foreground ml-2">({car.color})</span>}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{car.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-luxury-gold">{car.price}</div>
                      <div className="text-xs text-muted-foreground">200km included</div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="space-y-1 mb-6 text-sm">
                    {car.specs.acceleration && (
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">🚀</span>
                        {car.specs.acceleration}
                        {car.specs.maxSpeed && ` – ${car.specs.maxSpeed}`}
                      </div>
                    )}
                    {car.specs.power && (
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">🐎</span>
                        {car.specs.power}
                        {car.specs.torque && ` – ${car.specs.torque}`}
                      </div>
                    )}
                    <div className="flex items-center text-muted-foreground">
                      <span className="mr-2">⚙️</span>
                      {car.specs.engine}
                    </div>
                    {car.specs.special && (
                      <div className="flex items-center text-muted-foreground">
                        <span className="mr-2">🏕️</span>
                        {car.specs.special}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => openWhatsApp(car.name)}
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

        {/* Contact Section */}
        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-luxury-gold mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our luxury concierge team is available 24/7 to help you select the perfect vehicle for your needs.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905202', '_blank')}
              variant="gold"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Our Concierge
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rentals;
