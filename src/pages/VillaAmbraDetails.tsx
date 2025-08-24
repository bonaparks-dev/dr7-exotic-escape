import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, MessageCircle, MapPin, Users, Bed, Bath, ChevronLeft, ChevronRight, Star, Minus, Plus, Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const villa = {
  id: 3,
  title: "Villa Ambra - with cliffside pool and private access to the sea",
  location: "Costa Smeralda, Sardegna",
  distanceToBeach: "Accesso privato al mare",
  price: "€4,200",
  nightly: 4200,
  maxGuests: 12,
  bedrooms: 6,
  bathrooms: 5,
  size: "400 m²",
  images: [
    "/lovable-uploads/5e56409c-5698-4e7a-bf07-4cceb7a09004.png",
    "/lovable-uploads/762fc2b2-9d97-4d9c-8fdc-0c8874f25643.png",
    "/lovable-uploads/4b224ab5-3163-4cb1-b641-d98203333d38.png",
    "/lovable-uploads/18f8724c-e423-4c66-a32d-807b53d368f5.png"
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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    if (nights <= 0) return { nights: 0, subtotal: 0, cleaning: 0, service: 0, total: 0 };
    
    const subtotal = villa.nightly * nights;
    const cleaning = 200; // Higher cleaning fee for luxury villa
    const service = Math.round((subtotal + cleaning) * 0.12); // 12% service fee
    const total = subtotal + cleaning + service;
    
    return { nights, subtotal, cleaning, service, total };
  };

  const formatWhatsAppMessage = () => {
    const { nights, total } = calculateTotal();
    if (nights <= 0) return "";
    
    return `Ciao! Sono interessato a prenotare ${villa.title} per ${guests} ${t('villa.details.guests')} dal ${checkIn?.toLocaleDateString('it-IT')} al ${checkOut?.toLocaleDateString('it-IT')} (${nights} ${t('villa.details.nights')}). Prezzo totale: €${total.toLocaleString()}`;
  };

  const handleWhatsApp = () => {
    const message = formatWhatsAppMessage();
    const url = message 
      ? `https://wa.me/393457905205?text=${encodeURIComponent(message)}`
      : "https://wa.me/393457905205";
    window.open(url, "_blank");
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

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date);
    if (date && !checkOut) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay);
    }
  };

  const pricing = calculateTotal();
  const canBook = checkIn && checkOut && pricing.nights > 0;

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
        {t('rentals.backto')}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2">
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
                    <span>{villa.maxGuests} {t('villa.details.guests')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{villa.bedrooms} {t('villa.details.rooms')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{villa.bathrooms} {t('villa.details.bathrooms')}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {villa.size}
                  </div>
                </div>
              </div>

              {/* Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">{t('villa.details.theVilla')}</h2>
                <p className="text-white/80 leading-relaxed text-lg">
                  {villa.description}
                </p>
              </section>

              {/* Comfort e Servizi */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{t('villa.details.comfortServices')}</h2>
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
                <h2 className="text-2xl font-bold mb-6">{t('villa.details.interiorSpaces')}</h2>
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
                <h2 className="text-2xl font-bold mb-6">{t('villa.details.position')}</h2>
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
                <h2 className="text-2xl font-bold mb-6">{t('villa.details.extraServices')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {villa.extraServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                      <span className="text-white/90">{service}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-white/5 border-white/20">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="text-2xl font-bold">{t('villa.details.bookingTitle')}</div>
                      <div className="text-white/70">{t('villa.details.selectDates')}</div>
                    </div>

                    {/* Date Pickers */}
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-white/70 mb-1 block">{t('villa.details.checkIn')}</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10 pointer-events-auto",
                                  !checkIn && "text-white/50"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkIn ? checkIn.toLocaleDateString('it-IT') : t('villa.details.select')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                              <Calendar
                                mode="single"
                                selected={checkIn}
                                onSelect={handleCheckInSelect}
                                disabled={(date) => date < new Date() || (checkOut && date >= checkOut)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <label className="text-sm text-white/70 mb-1 block">{t('villa.details.checkOut')}</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10 pointer-events-auto",
                                  !checkOut && "text-white/50"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkOut ? checkOut.toLocaleDateString('it-IT') : t('villa.details.select')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                              <Calendar
                                mode="single"
                                selected={checkOut}
                                onSelect={setCheckOut}
                                disabled={(date) => date <= new Date() || (checkIn && date <= checkIn)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Guests Selector */}
                      <div>
                        <label className="text-sm text-white/70 mb-1 block">{t('villa.details.guests')}</label>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/20 rounded-md">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent border-white/20 text-white hover:bg-white/10"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            disabled={guests <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-white font-medium">{guests} {t('villa.details.guests')}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent border-white/20 text-white hover:bg-white/10"
                            onClick={() => setGuests(Math.min(villa.maxGuests, guests + 1))}
                            disabled={guests >= villa.maxGuests}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    {pricing.nights > 0 && (
                      <div className="space-y-2 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{villa.price} × {pricing.nights} {t('villa.details.nights')}</span>
                          <span className="text-white">€{pricing.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{t('villa.details.cleaning')}</span>
                          <span className="text-white">€{pricing.cleaning}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{t('villa.details.serviceFee')}</span>
                          <span className="text-white">€{pricing.service}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                          <div className="flex justify-between font-bold">
                            <span>{t('villa.details.total')}</span>
                            <span>€{pricing.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      onClick={handleWhatsApp}
                      disabled={!canBook}
                      className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3"
                    >
                      {t('villa.details.bookNow')}
                    </Button>

                    <p className="text-xs text-white/60 text-center mt-3">
                      {t('villa.details.instantConfirm')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16">
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {t('villa.details.questionsTitle')}
                </h2>
                <p className="text-white/80 mb-6">
                  {t('villa.details.questionsDesc')}
                </p>
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {t('villa.details.contactTeam')}
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