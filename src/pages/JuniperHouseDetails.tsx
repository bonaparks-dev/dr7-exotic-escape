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
  id: 2,
  title: "Juniper House - Villa by the Sea",
  location: "Costa del Sud, Sardegna",
  distanceToBeach: "Accesso diretto al mare",
  maxGuests: 8,
  bedrooms: 3,
  bathrooms: 3,
  size: "400 m²",
  images: [
    "/ginepro1.png",
    "/ginepro2.png",
    "/ginepro3.png",
    "/ginepro4.png"
  ],
  description: "Relax with your family in this fantastic Villa overlooking the turquoise waters of South Sardinia. A Villa with a unique Design, with functional and comfortable spaces and areas. Direct access to the Beach...Heated Pool with sea view...a daydream.",
  amenities: [
    "Piscina riscaldata 6x4m vista mare",
    "Accesso diretto alla spiaggia",
    "Parco mediterraneo 4000 mq",
    "Pergola con angolo bar",
    "Doccia esterna",
    "Smart TV in tutte le stanze",
    "Aria condizionata",
    "Wi-Fi ad alta velocità",
    "Parcheggio privato per 4 auto",
    "Barbecue all'aperto"
  ],
  features: [
    "Unità principale: soggiorno open space con cucina moderna",
    "Zona pranzo con vista mare",
    "2 camere matrimoniali eleganti",
    "Bagno di design",
    "Unità indipendente: appartamento autonomo",
    "Soggiorno con cucina e divano letto",
    "Camera matrimoniale privata",
    "Bagno privato con doccia esterna",
    "Terzo bagno di servizio"
  ],
  extraServices: [
    "Chef privato su richiesta",
    "Servizio pulizie durante il soggiorno",
    "Concierge dedicato 24/7",
    "Transfer privato aeroporto",
    "Servizio baby sitting",
    "Massaggi e trattamenti SPA",
    "Escursioni private in barca",
    "Servizio fotografo",
    "Noleggio biciclette",
    "Servizio lavanderia"
  ],
  nearby: [
    "Spiaggia di Geremeas (accesso diretto)",
    "Villasimius (15 min)",
    "Cagliari centro (30 min)", 
    "Aeroporto Cagliari (45 min)"
  ],
  rating: 4.8,
  reviewCount: 22
};

export default function JuniperHouseDetails() {
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

  const formatWhatsAppMessage = () => {
    const nights = calculateNights();
    if (nights <= 0) return "";
    
    return `Ciao! Sono interessato a prenotare ${villa.title} per ${guests} ${t('villa.details.guests')} dal ${checkIn?.toLocaleDateString('it-IT')} al ${checkOut?.toLocaleDateString('it-IT')} (${nights} ${t('villa.details.nights')}). Potreste inviarmi maggiori informazioni e la disponibilità?`;
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

  const nights = calculateNights();
  const canBook = checkIn && checkOut && nights > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Back Button */}
      <Button
        onClick={() => navigate("/")}
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
                <div className="mt-6 p-6 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold mb-4">La Proprietà</h3>
                  <p className="text-white/80 mb-4">
                    La villa è composta da due unità indipendenti, per un totale di 8 ospiti, garantendo ampi spazi e privacy.
                  </p>
                  <div className="space-y-3 text-white/80">
                    <p><strong>Unità principale:</strong> luminoso open space con cucina moderna, tavolo da pranzo, area salotto e vista mare; 2 eleganti camere matrimoniali e un bagno di design.</p>
                    <p><strong>Seconda unità - Appartamento indipendente:</strong> soggiorno con cucina e divano letto, camera matrimoniale e bagno privato, con doccia esterna per rinfrescarsi dopo la spiaggia.</p>
                  </div>
                </div>
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

              {/* Pool Area */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Area Piscina e Esterni</h2>
                <div className="bg-white/5 rounded-lg border border-white/10 p-6">
                  <p className="text-white/80 mb-4">
                    La piscina riscaldata (6x4 metri) con vista mare è il vero gioiello della proprietà. L'area prendisole include:
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li>• Pergola con angolo bar per aperitivi</li>
                    <li>• Doccia esterna</li>
                    <li>• Terzo bagno di servizio</li>
                    <li>• Parco mediterraneo di 4.000 metri quadrati</li>
                  </ul>
                  <p className="text-white/80 mt-4">
                    Circondata da un parco di 4.000 metri quadrati immerso nella macchia mediterranea, la villa offre un'esperienza rigenerante, 
                    con accesso diretto alla spiaggia di Geremeas, che dispone di servizi esclusivi come bar e noleggio lettini e ombrelloni.
                  </p>
                </div>
              </section>

              {/* Posizione */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{t('villa.details.position')}</h2>
                <p className="text-white/80 mb-6">
                  Situata in una posizione privilegiata sulla Costa del Sud della Sardegna, Juniper House offre un accesso esclusivo al mare 
                  e viste panoramiche mozzafiato. La villa si trova in una zona tranquilla e riservata, perfetta per chi cerca privacy e lusso.
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
                                disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Guests */}
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
                          <span className="font-medium">{guests} {t('villa.details.guests')}</span>
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

                    {/* Book Button */}
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full bg-white text-black hover:bg-white/90 font-semibold"
                      size="lg"
                    >
                      {canBook ? t('villa.details.bookNow') : t('villa.details.selectDatesFirst')}
                    </Button>

                    {nights > 0 && (
                      <div className="mt-4 text-center text-sm text-white/70">
                        {nights} {t('villa.details.nights')} selezionate
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact Section */}
                <Card className="bg-white/5 border-white/20 mt-6">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">{t('villa.details.contactUs')}</h3>
                    <p className="text-white/70 text-sm mb-4">
                      {t('villa.details.contactMessage')}
                    </p>
                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}