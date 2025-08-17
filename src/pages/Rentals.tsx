import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ReservationForm } from "@/components/ReservationForm";
import { useLanguage } from "@/contexts/LanguageContext";

interface Car {
  id: number;
  name: string;
  dailyPrice: number;
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
  available?: boolean;
}

const cars: Car[] = [
  {
    id: 1,
    name: "Alfa Romeo Stelvio Quadrifoglio",
    dailyPrice: 40,
    specs: {
      acceleration: "0–100 in 3.8s",
      power: "510Cv",
      torque: "600Nm",
      engine: "2.9L V6 BiTurbo"
    },
    description: "Italian excellence meets SUV practicality.",
    image: "/alpha.png",
    available: false
  },
  {
    id: 2,
    name: "Hummer H2",
    dailyPrice: 40,
    specs: {
      acceleration: "0–100 in 7.8s",
      maxSpeed: "Max speed: 160km/h",
      power: "398Cv",
      torque: "574Nm",
      engine: "6.2L V8"
    },
    description: "Legendary road presence.",
    image: "/hummer.png"
  },
  {
    id: 3,
    name: "Audi RS3",
    dailyPrice: 60,
    specs: {
      acceleration: "0–100 in 3.8s",
      maxSpeed: "Max speed: 250km/h",
      power: "400Cv",
      torque: "500Nm",
      engine: "2.5L inline 5-cylinder"
    },
    description: "Green fury on four wheels.",
    image: "/audi-rs3.png",
    color: "Verde"
  },
  {
    id: 4,
    name: "Audi RS3",
    dailyPrice: 60,
    specs: {
      acceleration: "0–100 in 3.8s",
      power: "400Cv",
      torque: "500Nm",
      engine: "2.5L inline 5-cylinder"
    },
    description: "Red racing legend.",
    image: "/Rs3-red.png",
    color: "Rossa"
  },
  {
    id: 5,
    name: "Mercedes A45 S AMG",
    dailyPrice: 60,
    specs: {
      acceleration: "0–100 in 3.9s",
      power: "421Cv",
      torque: "500Nm",
      engine: "2.0L 4-cylinder Turbo"
    },
    description: "Compact powerhouse.",
    image: "/mercedes-amg45.png"
  },
  {
    id: 6,
    name: "BMW M2",
    dailyPrice: 60,
    specs: {
      acceleration: "0–100 in 4.1s",
      power: "460Cv",  
      torque: "550Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "Pure driving essence.",
    image: "/bmw-m2.png"
  },
  {
    id: 7,
    name: "BMW M3 Competition",
    dailyPrice: 80,
    specs: {
      acceleration: "0–100 in 3.9s",
      maxSpeed: "Max speed: 250km/h",
      power: "510Cv",
      torque: "650Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "The ultimate driving machine.",
    image: "/bmw-m3.png"
  },
  {
    id: 8,
    name: "Mercedes GLE 53 AMG",
    dailyPrice: 80,
    specs: {
      acceleration: "0–100 in 4.7s",
      maxSpeed: "Max speed: 250km/h",
      power: "435Cv",
      torque: "520Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "Luxury meets performance.",
    image: "/mercedesGLE.png"
  },
  {
    id: 9,
    name: "BMW M4 Competition",
    dailyPrice: 90,
    specs: {
      acceleration: "0–100 in 3.8s",
      power: "510Cv",
      torque: "650Nm",
      engine: "3.0L inline 6-cylinder"
    },
    description: "Track-bred coupe excellence.",
    image: "/bmw-m4.png"
  },
  {
    id: 10,
    name: "Porsche 992 Carrera 4S",
    dailyPrice: 90,
    specs: {
      acceleration: "0–100 in 3.6s",
      maxSpeed: "Max speed: 306km/h",
      power: "450Cv",
      torque: "530Nm",
      engine: "3.0L Twin-Turbo Flat-6"
    },
    description: "Timeless sports car perfection.",
    image: "/porsche-911.png"
  },
  {
    id: 11,
    name: "Mercedes C63 S AMG",
    dailyPrice: 90,
    specs: {
      acceleration: "0–100 in 3.9s",
      power: "510Cv",
      torque: "700Nm",
      engine: "4.0L V8 BiTurbo"
    },
    description: "Four-door rocket ship.",
    image: "/c63.png"
  },
  {
    id: 12,
    name: "Porsche Macan GTS",
    dailyPrice: 90,
    specs: {
      acceleration: "0–100 in 4.5s",
      power: "440Cv",
      torque: "550Nm",
      engine: "2.9L Twin-Turbo V6"
    },
    description: "Sports car in SUV clothing.",
    image: "/macan.png"
  },
  {
    id: 13,
    name: "Mercedes GLE 63 AMG",
    dailyPrice: 90,
    specs: {
      acceleration: "0–100 in 3.8s",
      power: "612Cv",
      torque: "850Nm",
      engine: "4.0L V8 BiTurbo"
    },
    description: "Luxury SUV with supercar soul.",
    image: "/mercedes-gle.png"
  },
  {
    id: 14,
    name: "Ferrari Portofino M",
    dailyPrice: 500,
    specs: {
      acceleration: "0–100 in 3.45s",
      maxSpeed: "Max speed: 320km/h",
      power: "620Cv",
      torque: "760Nm",
      engine: "3.9L Twin-Turbo V8"
    },
    description: "Italian masterpiece, open-top glory.",
    image: "/ferrari-portofino.png"
  },
  {
    id: 15,
    name: "Lamborghini Urus Performante",
    dailyPrice: 500,
    specs: {
      acceleration: "0–100 in 3.3s",
      maxSpeed: "Max speed: 306km/h",
      power: "666Cv",
      torque: "850Nm",
      engine: "4.0L Twin-Turbo V8"
    },
    description: "Super SUV without compromise.",
    image: "/urus.png"
  },
  {
    id: 16,
    name: "Fiat Ducato",
    dailyPrice: 25,
    specs: {
      engine: "2.3L MultiJet Turbo Diesel",
      power: "140Cv",
      special: "Large cargo space"
    },
    description: "Perfect for transporting everything you need.",
    image: "/Ducato.png",
    available: false
  }
];

const Rentals = () => {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const { t } = useLanguage();

  const openReservationForm = (carName: string) => {
    setSelectedCar(carName);
    setIsReservationFormOpen(true);
  };

  const closeReservationForm = () => {
    setIsReservationFormOpen(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <Button
        onClick={() => navigate('/')}
        className="fixed top-24 left-4 z-40 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
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

      <main className="pt-32 pb-16">
        {/* Video Header Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop
              playsInline
            >
              <source src="/rental.MP4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <Card key={car.id} className={`bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 group ${car.available === false ? 'opacity-60' : ''}`}>
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {car.available === false && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{t('rentals.notavailable')}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-seasons text-white mb-1">
                      {car.name}
                      {car.color && <span className="text-sm text-white/60 ml-2">({car.color})</span>}
                    </h3>
                    <p className="text-sm text-white/70 mb-2">{car.description}</p>
                    <div className="text-2xl font-bold text-white mb-2">
                      €{car.dailyPrice}<span className="text-sm font-normal text-white/60">/day</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-6 text-sm">
                    {car.specs.acceleration && (
                      <div className="flex items-center text-white/70">
                        {car.specs.acceleration}
                        {car.specs.maxSpeed && ` – ${car.specs.maxSpeed}`}
                      </div>
                    )}
                    {car.specs.power && (
                      <div className="flex items-center text-white/70">
                        {car.specs.power}
                        {car.specs.torque && ` – ${car.specs.torque}`}
                      </div>
                    )}
                    <div className="flex items-center text-white/70">
                      {car.specs.engine}
                    </div>
                    {car.specs.special && (
                      <div className="flex items-center text-white/70">
                        {car.specs.special}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => openReservationForm(car.name)}
                    variant="luxury"
                    className="w-full"
                    disabled={car.available === false}
                  >
                    {car.available === false ? t('rentals.notavailable') : t('rentals.booknow')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-white mb-4">
              {t('rentals.needhelp')}
            </h2>
            <p className="text-white/80 mb-6">
              {t('rentals.helpdesc')}
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905202', '_blank')}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('rentals.contactconcierge')}
            </Button>
          </div>
        </div>
      </main>

      {selectedCar && (
        <ReservationForm
          isOpen={isReservationFormOpen}
          onClose={closeReservationForm}
          carName={selectedCar}
          dailyPrice={cars.find(car => car.name === selectedCar)?.dailyPrice || 0}
        />
      )}

      <Footer />
    </div>
  );
};

export default Rentals;
