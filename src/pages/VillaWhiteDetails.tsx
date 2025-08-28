import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, MapPin, Users, Bed, Bath, Wifi, Car, Waves, Home, Sparkles, Shield, Calendar as CalendarIcon, MessageCircle, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function VillaWhiteDetails() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const villa = {
    id: 8,
    title: "White Villa",
    location: "Costa Smeralda, Sardegna",
    distanceToBeach: "Vista mare",
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "/white1.png",
      "/white2.png", 
      "/white3.png",
      "/white4.png"
    ],
    description: "Villa moderna di 200m² con design minimalista, vista panoramica sul mare e spazi esterni raffinati.",
    fullDescription: "White Villa è una straordinaria villa moderna di 200m² situata nella prestigiosa Costa Smeralda. Caratterizzata da un design minimalista contemporaneo e linee pulite, questa villa offre un'esperienza di lusso unica con vista panoramica mozzafiato sul mare cristallino della Sardegna.",
    amenities: [
      { icon: Home, title: "Design Minimalista", description: "Architettura moderna contemporanea" },
      { icon: Waves, title: "Vista Mare Panoramica", description: "Panorama mozzafiato sul mare" },
      { icon: Sparkles, title: "Spazi Raffinati", description: "Ambienti eleganti e curati" },
      { icon: Wifi, title: "WiFi Gratuito", description: "Connessione internet veloce" },
      { icon: Car, title: "Parcheggio Privato", description: "Posto auto riservato" },
      { icon: Shield, title: "Sicurezza 24/7", description: "Servizio di sorveglianza" }
    ],
    features: [
      "4 camere da letto eleganti",
      "3 bagni moderni con finiture di lusso", 
      "Ampio soggiorno con vista mare",
      "Cucina moderna completamente attrezzata",
      "Terrazza panoramica con area relax",
      "Spazi esterni raffinati e curati",
      "Aria condizionata in tutte le stanze",
      "Smart TV in ogni camera",
      "Sistema audio Bluetooth",
      "Cassaforte digitale",
      "Asciugacapelli professionali",
      "Set di cortesia di lusso"
    ]
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
                  <span>{villa.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{villa.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{villa.bathrooms} bathrooms</span>
                </div>
              </div>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {villa.fullDescription}
              </p>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villa.amenities.map((amenity, index) => (
                <Card key={index} className="bg-white/5 border-white/20">
                  <CardContent className="p-6">
                    <amenity.icon className="w-8 h-8 mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2">{amenity.title}</h3>
                    <p className="text-white/70">{amenity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villa.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/20">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Gallery</h2>
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
                  Ready for Your Dream Vacation?
                </h2>
                <p className="text-white/80 mb-6">
                  Contact us for more information and availability
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
                        {checkIn ? checkIn.toLocaleDateString() : "Seleziona data"}
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
                        {checkOut ? checkOut.toLocaleDateString() : "Seleziona data"}
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