import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, MapPin, Users, Bed, Bath, Car, Wifi, Waves, UtensilsCrossed, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Villa {
  id: number;
  title: string;
  location: string;
  distanceToBeach: string;
  price: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  amenities: string[];
  features: string[];
  extraServices: string[];
  nearby: string[];
}

const villas: Villa[] = [
  {
    id: 1,
    title: "Villa Elicriso Luxury",
    location: "Geremeas (CA), Sardegna",
    distanceToBeach: "50m dalla Spiaggia",
    price: "€2,500",
    maxGuests: 9,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/lovable-uploads/762fc2b2-9d97-4d9c-8fdc-0c8874f25643.png",
      "/lovable-uploads/4b224ab5-3163-4cb1-b641-d98203333d38.png",
      "/lovable-uploads/18f8724c-e423-4c66-a32d-807b53d368f5.png",
      "/lovable-uploads/1630985d-a23b-4344-a01f-886c5fa2be7b.png"
    ],
    description: "Benvenuti a Villa Elicriso, una residenza esclusiva situata a Geremeas, a soli 50 metri da una spiaggia incontaminata tra le più belle della Sardegna. Un rifugio privato dove lusso, comfort e natura si fondono in un'esperienza unica.",
    amenities: [
      "Piscina privata riscaldata (fino a 38°C)",
      "Jacuzzi 5 posti",
      "Ampio giardino mediterraneo con prato curato",
      "Terrazza esterna con tavolo da pranzo",
      "Bar nella zona piscina",
      "Barbecue di design",
      "Wi-Fi ultra veloce (229 Mbps)",
      "Smart TV in soggiorno e camere",
      "Aria condizionata e riscaldamento",
      "Parcheggio privato fino a 4 auto"
    ],
    features: [
      "Soggiorno luminoso con Smart TV e divano",
      "Cucina attrezzata completa",
      "4 camere (2 matrimoniali, 2 doppie)",
      "3 bagni interni con docce emozionali SPA",
      "1 bagno esterno zona piscina",
      "Lavatrice e asciugatrice",
      "Cassaforte e kit cortesia inclusi",
      "Servizi baby-friendly"
    ],
    extraServices: [
      "Chef privato",
      "Baby sitter",
      "Massaggi e osteopata",
      "Personal trainer",
      "Exotic car & transfer di lusso",
      "Jet privati & elicottero",
      "Autista e cameriere personale",
      "Concierge personale 24/7"
    ],
    nearby: [
      "Cagliari (30 min)",
      "Villasimius (30 min)",
      "Mari Pintau e Cann'e Sisa",
      "Cascata di Meriagu Mannu"
    ]
  }
];

export default function VillaRental() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);

  const generateWhatsAppMessage = (villa: Villa) => {
    let message = `Hello DR7 Exotic, I would like to book ${villa.title}:\n\n`;
    message += `📍 Location: ${villa.location}\n`;
    message += `🏖️ Distance to beach: ${villa.distanceToBeach}\n`;
    message += `💶 Price: ${villa.price} per day\n`;
    message += `👥 Max guests: ${villa.maxGuests}\n`;
    message += `🛏️ Bedrooms: ${villa.bedrooms}\n`;
    message += `🛁 Bathrooms: ${villa.bathrooms}\n\n`;
    message += `Please let me know the availability and booking details. Thank you!`;
    return encodeURIComponent(message);
  };

  const villa = villas[0]; // For now, display the first villa

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
        {/* Hero Section with Images */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Main Image */}
            <div className="relative">
              <img
                src={villa.images[selectedImageIndex]}
                alt={villa.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white text-black font-medium">
                  {villa.distanceToBeach}
                </Badge>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 h-96 lg:h-[500px]">
              {villa.images.slice(1, 5).map((image, index) => (
                <img
                  key={index + 1}
                  src={image}
                  alt={`${villa.title} ${index + 2}`}
                  className="w-full h-full object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedImageIndex(index + 1)}
                />
              ))}
            </div>
          </div>

          {/* Villa Info Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{villa.title}</h1>
              <div className="flex items-center gap-2 text-white/70 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{villa.location}</span>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/70" />
                  <span>{villa.maxGuests} ospiti</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-white/70" />
                  <span>{villa.bedrooms} camere</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-white/70" />
                  <span>{villa.bathrooms} bagni</span>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <Card className="bg-white/5 border-white/20 w-full lg:w-96 sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-2">{villa.price}</div>
                  <div className="text-white/70">per notte</div>
                </div>
                
                <Button
                  onClick={() => {
                    const message = generateWhatsAppMessage(villa);
                    window.open(`https://wa.me/393457905205?text=${message}`, '_blank');
                  }}
                  variant="luxury"
                  className="w-full mb-4"
                  size="lg"
                >
                  Prenota Ora
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-white/70">
                    Concierge disponibile 24/7
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">🌿 La Villa</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              {villa.description}
            </p>
          </div>
        </div>

        {/* Amenities */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-8">✨ Comfort e Servizi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {villa.amenities.map((amenity, index) => (
              <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4">
                <p className="text-sm text-white/90">{amenity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-8">🏡 Spazi Interni</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {villa.features.map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4">
                <p className="text-sm text-white/90">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-8">🌊 Posizione Unica</h2>
          <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-6">
            <p className="text-white/80 mb-4">
              A due passi dalla spiaggia privata di Geremeas, in un contesto tranquillo e riservato, ma vicino a:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {villa.nearby.map((location, index) => (
                <div key={index} className="text-center">
                  <div className="text-white font-medium">{location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extra Services */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-8">🌟 Servizi Extra (su richiesta)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {villa.extraServices.map((service, index) => (
              <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4">
                <p className="text-sm text-white/90">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ideal For */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-8">Ideale per</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="font-bold mb-2">Famiglie numerose</h3>
              <p className="text-sm text-white/70">Vacanze in totale relax</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🥂</div>
              <h3 className="font-bold mb-2">Gruppi di amici</h3>
              <p className="text-sm text-white/70">Eventi speciali e compleanni esclusivi</p>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold mb-2">Viaggiatori luxury</h3>
              <p className="text-sm text-white/70">Un'oasi di privacy e comfort</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="container mx-auto px-4">
          <div className="bg-white/5 border border-white/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Un luogo dove ogni dettaglio è pensato per rendere la tua vacanza indimenticabile
            </h2>
            <p className="text-white/80 mb-6">
              Il nostro team concierge è disponibile 24/7 per creare la tua esperienza villa perfetta
            </p>
            <Button
              onClick={() => {
                const message = generateWhatsAppMessage(villa);
                window.open(`https://wa.me/393457905205?text=${message}`, '_blank');
              }}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contatta il Nostro Concierge
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}