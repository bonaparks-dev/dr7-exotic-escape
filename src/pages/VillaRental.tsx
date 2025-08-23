import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Users,
  Bed,
  Bath,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";

interface Villa {
  id: number;
  title: string;
  location: string;
  distanceToBeach: string;
  price: string;   // affichage
  nightly: number; // prix numérique / nuit
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  amenities: string[];
  features: string[];
  extraServices: string[];
  nearby: string[];
  rating?: number;
  reviewCount?: number;
}

const villas: Villa[] = [
  {
    id: 1,
    title: "Villa Elicriso Luxury",
    location: "Geremeas (CA), Sardegna",
    distanceToBeach: "50m dalla Spiaggia",
    price: "€2,500",
    nightly: 2500,
    maxGuests: 9,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/lovable-uploads/762fc2b2-9d97-4d9c-8fdc-0c8874f25643.png",
      "/lovable-uploads/4b224ab5-3163-4cb1-b641-d98203333d38.png",
      "/lovable-uploads/18f8724c-e423-4c66-a32d-807b53d368f5.png",
      "/lovable-uploads/1630985d-a23b-4344-a01f-886c5fa2be7b.png",
    ],
    description:
      "Benvenuti a Villa Elicriso, una residenza esclusiva situata a Geremeas, a soli 50 metri da una spiaggia incontaminata tra le più belle della Sardegna. Un rifugio privato dove lusso, comfort e natura si fondono in un'esperienza unica.",
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
      "Parcheggio privato fino a 4 auto",
    ],
    features: [
      "Soggiorno luminoso con Smart TV e divano",
      "Cucina attrezzata completa",
      "4 camere (2 matrimoniali, 2 doppie)",
      "3 bagni interni con docce emozionali SPA",
      "1 bagno esterno zona piscina",
      "Lavatrice e asciugatrice",
      "Cassaforte e kit cortesia inclusi",
      "Servizi baby-friendly",
    ],
    extraServices: [
      "Chef privato",
      "Baby sitter",
      "Massaggi e osteopata",
      "Personal trainer",
      "Exotic car & transfer di lusso",
      "Jet privati & elicottero",
      "Autista e cameriere personale",
      "Concierge personale 24/7",
    ],
    nearby: ["Cagliari (30 min)", "Villasimius (30 min)", "Mari Pintau e Cann'e Sisa", "Cascata di Meriagu Mannu"],
    rating: 4.9,
    reviewCount: 28,
  },
];

export default function VillaRental() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const villa = villas[0];

  // Galerie / slider
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setIndex((i) => (i - 1 + villa.images.length) % villa.images.length);
  const next = () => setIndex((i) => (i + 1) % villa.images.length);

  const onTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    touchStartX.current = null;
  };

  // Réservation
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);
  const [guests, setGuests] = useState(2);

  const today = startOfDay(new Date());
  const nights =
    checkIn && checkOut ? Math.max(0, differenceInCalendarDays(startOfDay(checkOut), startOfDay(checkIn))) : 0;

  // Pricing
  const cleaningFee = nights > 0 ? 150 : 0;
  const subtotal = nights * villa.nightly + cleaningFee;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + serviceFee;
  const canBook = checkIn && checkOut && nights > 0 && guests > 0;

  const setCheckInSafe = (date?: Date) => {
    if (!date) return;
    if (isBefore(date, today)) return;
    setCheckIn(date);
    setOpenCheckIn(false);
    if (!checkOut || !isBefore(date, checkOut) || isSameDay(date, checkOut)) {
      setCheckOut(addDays(date, 1));
      setOpenCheckOut(true);
    }
  };

  const setCheckOutSafe = (date?: Date) => {
    if (!date || !checkIn) return;
    if (!isBefore(checkIn, date)) return;
    setCheckOut(date);
    setOpenCheckOut(false);
  };

  const incGuests = () => setGuests((g) => Math.min(villa.maxGuests, g + 1));
  const decGuests = () => setGuests((g) => Math.max(1, g - 1));

  const generateWhatsAppMessage = (v: Villa) => {
    const ci = checkIn ? format(checkIn, "dd/MM/yyyy") : "—";
    const co = checkOut ? format(checkOut, "dd/MM/yyyy") : "—";
    const message =
      `Hello DR7 Exotic, I would like to book ${v.title}.\n\n` +
      `Location: ${v.location}\n` +
      `Dates: ${ci} → ${co} (${nights} night${nights !== 1 ? "s" : ""})\n` +
      `Guests: ${guests}\n` +
      `Price: €${v.nightly.toLocaleString()}/night\n` +
      `Cleaning fee: €${cleaningFee}\n` +
      `Service fee: €${serviceFee}\n` +
      `Total: €${total.toLocaleString()}\n\n` +
      `Please confirm availability and booking details. Thank you!`;
    return encodeURIComponent(message);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Back */}
      <Button
        onClick={() => navigate("/")}
        className="fixed top-24 left-4 z-40 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("rentals.backto")}
      </Button>

      {/* WhatsApp Floater (mobile) */}
      <Button
        onClick={() => {
          if (!canBook) {
            window.open("https://wa.me/393457905205", "_blank");
            return;
          }
          const msg = generateWhatsAppMessage(villa);
          window.open(`https://wa.me/393457905205?text=${msg}`, "_blank");
        }}
        className="fixed bottom-20 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg md:hidden"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 mb-12">
          {/* Slider */}
          <div
            className="relative w-full h-96 lg:h-[540px] rounded-2xl overflow-hidden mb-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={villa.images[index]}
              alt={`${villa.title} ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Distance badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white text-black font-medium">{villa.distanceToBeach}</Badge>
            </div>

            {/* Arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/20 hover:bg-black/60"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/20 hover:bg-black/60"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {villa.images.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 mb-10">
            {villa.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setIndex(i)}
                className={`rounded-xl overflow-hidden border transition ${
                  i === index ? "border-white" : "border-white/20 hover:border-white/40"
                }`}
              >
                <img src={src} alt={`thumb ${i + 1}`} className="w-full h-24 object-cover" />
              </button>
            ))}
          </div>

          {/* Header + Booking */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{villa.title}</h1>

              {/* Rating + location */}
              <div className="flex flex-wrap items-center gap-3 text-white/80 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-white" />
                  <span className="font-medium">{villa.rating?.toFixed(1) ?? "5.0"}</span>
                  <span>· {villa.reviewCount ?? 0} reviews</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {villa.location}
                </span>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mb-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{villa.maxGuests} ospiti</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{villa.bedrooms} camere</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{villa.bathrooms} bagni</span>
                </div>
              </div>
            </div>

            {/* Booking card */}
            <Card className="bg-white/5 border-white/20 w-full lg:w-[420px] lg:sticky lg:top-24">
              <CardContent className="p-6">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold">{villa.price}</div>
                    <div className="text-white/70 text-sm">per notte</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs uppercase mb-1 text-white/70">Check-in</div>
                    <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <span>{checkIn ? format(checkIn, "dd MMM yyyy") : "Select"}</span>
                          <CalendarIcon className="w-4 h-4 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 bg-black border-white/20" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={(d) => setCheckInSafe(d)}
                          disabled={(d) => isBefore(startOfDay(d), today)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <div className="text-xs uppercase mb-1 text-white/70">Check-out</div>
                    <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-transparent border-white/20 text-white hover:bg-white/10"
                          disabled={!checkIn}
                        >
                          <span>{checkOut ? format(checkOut, "dd MMM yyyy") : "Select"}</span>
                          <CalendarIcon className="w-4 h-4 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 bg-black border-white/20" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={(d) => setCheckOutSafe(d)}
                          disabled={(d) => !checkIn || !isBefore(startOfDay(checkIn), startOfDay(d))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Guests */}
                <div className="mt-4">
                  <div className="text-xs uppercase mb-1 text-white/70">Guests</div>
                  <div className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg px-3 py-2">
                    <div className="text-white/90">{guests} {guests === 1 ? "guest" : "guests"}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-white/20 text-white hover:bg-white/10"
                        onClick={decGuests}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-white/20 text-white hover:bg-white/10"
                        onClick={incGuests}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-white/50 mt-1">Max {villa.maxGuests} guests</div>
                </div>

                {/* Pricing */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {villa.price} × {nights || 0} night{nights !== 1 ? "s" : ""}
                    </span>
                    <span>€{(nights * villa.nightly).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Cleaning fee</span>
                    <span>€{cleaningFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Service fee</span>
                    <span>€{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>€{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => {
                    if (!canBook) {
                      window.open("https://wa.me/393457905205", "_blank");
                      return;
                    }
                    const message = generateWhatsAppMessage(villa);
                    window.open(`https://wa.me/393457905205?text=${message}`, "_blank");
                  }}
                  className="w-full mt-6"
                  size="lg"
                  variant="luxury"
                  disabled={!canBook}
                >
                  Prenota Ora
                </Button>

                <div className="text-center mt-3">
                  <p className="text-sm text-white/70">Concierge disponibile 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">La Villa</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">{villa.description}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold mb-8">Comfort e Servizi</h2>
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
          <h2 className="text-2xl font-bold mb-8">Spazi Interni</h2>
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
          <h2 className="text-2xl font-bold mb-8">Posizione</h2>
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
          <h2 className="text-2xl font-bold mb-8">Servizi Extra (su richiesta)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {villa.extraServices.map((service, index) => (
              <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4">
                <p className="text-sm text-white/90">{service}</p>
              </div>
            ))}
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
                if (!canBook) {
                  window.open("https://wa.me/393457905205", "_blank");
                  return;
                }
                const message = generateWhatsAppMessage(villa);
                window.open(`https://wa.me/393457905205?text=${message}`, "_blank");
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
