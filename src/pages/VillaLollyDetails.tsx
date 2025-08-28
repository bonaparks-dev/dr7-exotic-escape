import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Users, Bed, Bath, Wifi, Car, Waves, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingModal } from "@/components/BookingModal";

export default function VillaLollyDetails() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const villaImages = [
    "/loly1.png",
    "/loly2.png", 
    "/loly3.png",
    "/loly4.png"
  ];

  const amenities = [
    { icon: Wifi, label: "WiFi Gratuito" },
    { icon: Car, label: "Parcheggio Privato" },
    { icon: Waves, label: "Piscina Privata" },
    { icon: Home, label: "Terrazza Vista Mare" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Back Button */}
      <Button
        onClick={() => navigate("/villa-listings")}
        className="fixed top-24 left-4 z-40 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Torna alla Home
      </Button>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={villaImages[selectedImageIndex]}
                  alt="Villa Lolly - Blue Bay"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {villaImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-all ${
                      selectedImageIndex === index ? "border-white" : "border-white/20"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Villa Lolly ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Villa Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white text-black font-medium">
                    Vista mare
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-current text-white" />
                    <span className="font-medium">4.7</span>
                    <span className="text-white/70">(18 recensioni)</span>
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-2">Villa Lolly - Blue Bay</h1>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-5 h-5" />
                  <span>Blue Bay, Sardegna</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/20">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-white/70">Ospiti</div>
                  <div className="font-bold">6</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/20">
                  <Bed className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-white/70">Camere</div>
                  <div className="font-bold">3</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/20">
                  <Bath className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm text-white/70">Bagni</div>
                  <div className="font-bold">2</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Descrizione</h2>
                <p className="text-white/80 leading-relaxed">
                  Villa Lolly è una moderna villa con piscina privata e vista panoramica sulla splendida Blue Bay. 
                  Situata in una posizione privilegiata, offre tutti i comfort per una vacanza indimenticabile in Sardegna.
                  La villa dispone di ampi spazi esterni, terrazze panoramiche e una piscina privata dove rilassarsi 
                  ammirando il paesaggio mozzafiato della costa sarda.
                </p>
              </div>

              {/* Booking Button */}
              <Button
                onClick={() => setIsBookingModalOpen(true)}
                size="lg"
                variant="luxury"
                className="w-full"
              >
                {t('villa.bookNow')}
              </Button>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Servizi e Comfort</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {amenities.map((amenity, index) => (
                <Card key={index} className="bg-white/5 border-white/20">
                  <CardContent className="p-6 text-center">
                    <amenity.icon className="w-8 h-8 mx-auto mb-3" />
                    <p className="text-sm font-medium">{amenity.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Caratteristiche Principali</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Spazi Interni</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>• Soggiorno con vista panoramica</li>
                    <li>• Cucina completamente attrezzata</li>
                    <li>• 3 camere da letto confortevoli</li>
                    <li>• 2 bagni moderni</li>
                    <li>• Aria condizionata in tutte le stanze</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Spazi Esterni</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>• Piscina privata con vista mare</li>
                    <li>• Terrazza panoramica</li>
                    <li>• Giardino mediterraneo</li>
                    <li>• Area pranzo all'aperto</li>
                    <li>• Parcheggio privato</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Posizione</h2>
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <p className="text-white/80 mb-4">
                  Villa Lolly si trova nella pittoresca Blue Bay, una delle zone più esclusive della Sardegna meridionale. 
                  La posizione offre viste mozzafiato sul mare cristallino e facile accesso alle spiagge più belle della zona.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-bold mb-2">Distanze:</h4>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li>• Spiaggia: Vista diretta</li>
                      <li>• Centro: 15 min</li>
                      <li>• Aeroporto: 45 min</li>
                      <li>• Ristoranti: 5 min</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Nelle vicinanze:</h4>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li>• Spiagge cristalline</li>
                      <li>• Ristoranti di pesce</li>
                      <li>• Centro benessere</li>
                      <li>• Porto turistico</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-white/5 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Vuoi maggiori informazioni?
              </h2>
              <p className="text-white/80 mb-6">
                Il nostro team è a disposizione per aiutarti a pianificare la tua vacanza perfetta.
              </p>
              <Button
                onClick={() => window.open("https://wa.me/393457905205", "_blank")}
                variant="luxury"
                size="lg"
              >
                Contatta il Concierge
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <BookingModal 
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
      />
    </div>
  );
}