import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, MessageCircle, MapPin, Users, Bed, Bath, ChevronLeft, ChevronRight, Star, Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
  description: "Incantevole Villa overlooking the sea with a unique architectural style, with a wonderful sea view that can be observed from any corner of the house, thanks to its outdoor spaces you can spend exclusive moments of relaxation and privacy admiring the colorful sunsets.",
  amenities: [
    "Piscina a strapiombo sul mare",
    "Accesso privato al mare",
    "Vista mare da ogni angolo",
    "Spazi esterni esclusivi",
    "Smart TV in tutte le stanze",
    "Aria condizionata",
    "Ventilatori",
    "Ferro da stiro",
    "Wi-Fi ad alta velocità",
    "Parcheggio privato"
  ],
  features: [
    "4 camere matrimoniali di lusso",
    "2 letti a castello aggiuntivi",
    "5 bagni completi",
    "Soggiorno panoramico vista mare",
    "Cucina professionale attrezzata",
    "Terrazze panoramiche multiple",
    "Area relax all'aperto",
    "Zona pranzo esterna",
    "Architettura unica moderna"
  ],
  extraServices: [
    "Chef privato su richiesta",
    "Servizio pulizie giornaliero",
    "Concierge dedicato 24/7",
    "Transfer privato aeroporto",
    "Servizio baby sitting",
    "Massaggi e trattamenti SPA",
    "Escursioni private in barca",
    "Servizio fotografo"
  ],
  nearby: [
    "Porto Cervo (15 min)",
    "Spiaggia del Principe (10 min)", 
    "Costa Smeralda Golf Club (20 min)",
    "Aeroporto Olbia (45 min)"
  ],
  rating: 4.9,
  reviewCount: 35
};

export default function VillaAmbraDetails() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  const handleWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/393457905205?text=${encodedMessage}`, "_blank");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % villa.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + villa.images.length) % villa.images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const threshold = 40;

    if (distance > threshold) nextImage();
    if (distance < -threshold) prevImage();
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

      {/* WhatsApp FAB */}
      <Button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 border-0 shadow-lg lg:hidden"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Gallery */}
          <div className="mb-8">
            <div className="relative">
              <div 
                className="aspect-[4/3] rounded-lg overflow-hidden relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={villa.images[currentImageIndex]}
                  alt={villa.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Distance Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white text-black font-medium">
                    {villa.distanceToBeach}
                  </Badge>
                </div>

                {/* Navigation Buttons */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-4 gap-2">
                {villa.images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      index === currentImageIndex ? "bg-white" : "bg-white/30"
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {villa.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                      index === currentImageIndex ? "border-white" : "border-white/20"
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${villa.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title Block */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{villa.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-current text-white" />
                <span className="font-medium">{villa.rating}</span>
                <span className="text-white/70">· {villa.reviewCount} {t('language') === 'it' ? 'recensioni' : 'reviews'}</span>
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <MapPin className="w-4 h-4" />
                <span>{villa.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{villa.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{villa.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{villa.bathrooms} bathrooms</span>
              </div>
              <div className="text-sm font-medium">
                {villa.size}
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">The Villa</h2>
            <p className="text-white/80 leading-relaxed text-lg">
              {villa.description}
            </p>
          </section>

          {/* Comfort e Servizi */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Comfort & Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villa.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-white/90">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Spazi Interni */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Interior Spaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villa.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Posizione */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Location</h2>
            <p className="text-white/80 mb-6">
              Situata in una posizione privilegiata sulla Costa Smeralda, Villa Ambra offre un accesso esclusivo al mare e viste panoramiche mozzafiato. 
              La villa si trova in una zona tranquilla e riservata, perfetta per chi cerca privacy e lusso.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {villa.nearby.map((location, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                  <span className="text-white/90 text-sm">{location}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Servizi Extra */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Extra Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {villa.extraServices.map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                  <span className="text-white/90">{service}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <div className="mt-16">
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Have Questions About This Villa?
                </h2>
                <p className="text-white/80 mb-6">
                  Our concierge team is available 24/7 for personalized assistance and exclusive services
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
                          {checkIn ? checkIn.toLocaleDateString() : "Select date"}
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
                          {checkOut ? checkOut.toLocaleDateString() : "Select date"}
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

                <Button
                  onClick={handleWhatsApp}
                  variant="luxury"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}