import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ReservationForm } from "@/components/ReservationForm";

interface Car {
  id: number;
  name: string;
  specs: {
    acceleration?: string;
    maxSpeed?: string;
    power?: string;
    torque?: string;
    engine: string;
    special?: string;
    extras?: string;
  };
  description: string;
  image: string;
  color?: string;
}

const cars: Car[] = [
  {
    id: 1,
    name: "BMW M3 Competition",
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
  // ... (les autres voitures, comme tu les as déjà)
];

const Rentals = () => {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);

  const openReservationForm = (carName: string) => {
    setSelectedCar(carName);
    setIsReservationFormOpen(true);
  };

  const closeReservationForm = () => {
    setIsReservationFormOpen(false);
    setSelectedCar(null);
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
            An exclusive fleet. A legendary island. One unforgettable drive.
          </p>
        </div>

        {/* Cars Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <Card
                key={car.id}
                className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group"
              >
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-seasons text-luxury-gold mb-1">
                      {car.name}
                      {car.color && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({car.color})
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{car.description}</p>
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
                    onClick={() => openReservationForm(car.name)}
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

      {/* Reservation Form Modal */}
      {selectedCar && (
        <ReservationForm
          isOpen={isReservationFormOpen}
          onClose={closeReservationForm}
          carName={selectedCar}
        />
      )}

      <Footer />
    </div>
  );
};

export default Rentals;
