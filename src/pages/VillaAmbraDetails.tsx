import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, MapPin, Users, Bed, Bath, Wifi, Car, Waves, Home, TreePine, Shield, Calendar as CalendarIcon, MessageCircle, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function VillaAmbraDetails() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const villa = {
    id: 3,
    title: "Villa Ambra - with cliffside pool and private access to the sea",
    location: "Costa Smeralda, Sardegna",
    distanceToBeach: "Accesso privato al mare",
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 5,
    size: "400 m²",
    images: [
      "/ambra1.png",
      "/ambra2.png", 
      "/ambra3.png",
      "/ambra4.png"
    ],
    description: {
      en: "Enchanting Villa overlooking the sea with a unique architectural style, with a wonderful sea view that can be observed from any corner of the house. Thanks to its outdoor spaces you can spend exclusive moments of relaxation and privacy admiring the colorful sunsets.",
      it: "Incantevole Villa con vista sul mare dallo stile architettonico unico, con una meravigliosa vista mare che può essere osservata da ogni angolo della casa. Grazie ai suoi spazi esterni potrete trascorrere momenti esclusivi di relax e privacy ammirando i tramonti colorati."
    },
    amenities: [
      { icon: Waves, title: { en: "Cliffside Pool", it: "Piscina a Strapiombo" }, description: { en: "Infinity pool overlooking the sea", it: "Piscina a sfioro vista mare" } },
      { icon: Home, title: { en: "Private Sea Access", it: "Accesso Privato al Mare" }, description: { en: "Direct access to crystal waters", it: "Accesso diretto alle acque cristalline" } },
      { icon: TreePine, title: { en: "Panoramic Views", it: "Vista Panoramica" }, description: { en: "Sea view from every corner", it: "Vista mare da ogni angolo" } },
      { icon: Wifi, title: { en: "Free WiFi", it: "WiFi Gratuito" }, description: { en: "High-speed internet", it: "Connessione internet veloce" } },
      { icon: Car, title: { en: "Private Parking", it: "Parcheggio Privato" }, description: { en: "Reserved parking space", it: "Posto auto riservato" } },
      { icon: Shield, title: { en: "24/7 Security", it: "Sicurezza 24/7" }, description: { en: "Security service", it: "Servizio di sorveglianza" } }
    ],
    features: {
      en: [
        "4 luxury double bedrooms",
        "2 additional bunk beds",
        "5 complete bathrooms",
        "Panoramic living room with sea view",
        "Professional equipped kitchen",
        "Multiple panoramic terraces",
        "Outdoor relaxation area",
        "External dining area",
        "Unique modern architecture",
        "Smart TV in all rooms",
        "Air conditioning",
        "High-speed Wi-Fi"
      ],
      it: [
        "4 camere matrimoniali di lusso",
        "2 letti a castello aggiuntivi",
        "5 bagni completi",
        "Soggiorno panoramico vista mare",
        "Cucina professionale attrezzata",
        "Terrazze panoramiche multiple",
        "Area relax all'aperto",
        "Zona pranzo esterna",
        "Architettura unica moderna",
        "Smart TV in tutte le stanze",
        "Aria condizionata",
        "Wi-Fi ad alta velocità"
      ]
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % villa.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + villa.images.length) % villa.images.length);
  };

  const generateWhatsAppMessage = () => {
    const checkInDate = checkIn ? checkIn.toLocaleDateString('en-GB') : 'TBD';
    const checkOutDate = checkOut ? checkOut.toLocaleDateString('en-GB') : 'TBD';
    
    return `Hello, I want to book ${villa.title}. May I have more information?

Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Guests: ${guests}
Location: ${villa.location}

Thank you!`;
  };

  const handleWhatsAppContact = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/393457905205?text=${encodedMessage}`, "_blank");
  };

  const currentLanguage = t('language') === 'it' ? 'it' : 'en';

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
        Back
      </Button>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={villa.images[currentImageIndex]}
                  alt={villa.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {villa.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                →
              </button>

              {/* Distance Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-white text-black font-medium">
                  {villa.distanceToBeach}
                </Badge>
              </div>
            </div>

            {/* Villa Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-white/70" />
                <span className="text-white/70">{villa.location}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">{villa.title}</h1>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{villa.maxGuests} {currentLanguage === 'it' ? 'ospiti' : 'guests'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{villa.bedrooms} {currentLanguage === 'it' ? 'camere' : 'bedrooms'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{villa.bathrooms} {currentLanguage === 'it' ? 'bagni' : 'bathrooms'}</span>
                </div>
                <div className="text-sm font-medium">
                  {villa.size}
                </div>
              </div>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {villa.description[currentLanguage]}
              </p>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {currentLanguage === 'it' ? 'Servizi e Comfort' : 'Amenities & Comfort'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villa.amenities.map((amenity, index) => (
                <Card key={index} className="bg-white/5 border-white/20">
                  <CardContent className="p-6">
                    <amenity.icon className="w-8 h-8 mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">{amenity.title[currentLanguage]}</h3>
                    <p className="text-white/70">{amenity.description[currentLanguage]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {currentLanguage === 'it' ? 'Caratteristiche' : 'Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villa.features[currentLanguage].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/20">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">
              {currentLanguage === 'it' ? 'Galleria' : 'Gallery'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {villa.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${villa.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white/5 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                {currentLanguage === 'it' ? 'Pronto per la tua vacanza da sogno?' : 'Ready for your dream vacation?'}
              </h2>
              <p className="text-white/80 mb-6">
                {currentLanguage === 'it' 
                  ? 'Contattaci per maggiori informazioni e disponibilità'
                  : 'Contact us for more information and availability'
                }
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Check-in</label>
                  <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10",
                          !checkIn && "text-white/50"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? checkIn.toLocaleDateString() : (currentLanguage === 'it' ? 'Seleziona data' : 'Select date')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(date) => {
                          setCheckIn(date);
                          setIsCheckInOpen(false);
                          if (date) {
                            setTimeout(() => setIsCheckOutOpen(true), 200);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Check-out</label>
                  <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10",
                          !checkOut && "text-white/50"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? checkOut.toLocaleDateString() : (currentLanguage === 'it' ? 'Seleziona data' : 'Select date')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={(date) => {
                          setCheckOut(date);
                          setIsCheckOutOpen(false);
                        }}
                        disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-white/70 mb-2 block">Guests</label>
                <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-medium px-4">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={() => setGuests(Math.min(villa.maxGuests, guests + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleWhatsAppContact}
                  variant="luxury"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}