import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Ship, Clock, Users, Bed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface YachtPackage {
  id: number;
  title: string;
  timeSlot: string;
  price: string;
  baseGuests: number;
  description: string;
}

const yachtPackages: YachtPackage[] = [
  {
    id: 1,
    title: "Giornata Intera",
    timeSlot: "10:00 - 18:00",
    price: "€1.500",
    baseGuests: 2,
    description: "Full day yacht experience with all amenities"
  },
  {
    id: 2,
    title: "Serata in Mare",
    timeSlot: "20:00 - 00:00",
    price: "€1.000",
    baseGuests: 2,
    description: "Evening yacht experience under the stars"
  }
];

const includedServices = [
  "Utilizzo esclusivo dello yacht",
  "Benzina inclusa",
  "Skipper professionista",
  "Area prendisole attrezzata",
  "Impianto audio premium Bluetooth",
  "Frigorifero e ghiacciaia per bevande",
  "Doccia interna ed esterna",
  "Asciugamani e teli mare DR7",
  "Pulizia finale"
];

const extraServices = [
  "Hostess (€40/ora)",
  "Bagnino dedicato",
  "Ballerina o intrattenimento a bordo",
  "Babysitter per bambini a bordo",
  "Seabob (scooter acquatico subacqueo)",
  "Moto d'acqua",
  "Servizio fotografico professionale e drona",
  "Attrezzatura snorkeling e pesca sportiva",
  "Paddle board e gonfiabili",
  "Champagne e vini pregiati",
  "Catering di lusso o menu personalizzato",
  "Degustazione di prodotti tipici sardi"
];

export default function YachtRental() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const generateWhatsAppMessage = (yachtPackage: YachtPackage) => {
    let message = `Hello DR7 Exotic, I would like to book the DR7 Yacht:\n\n`;
    message += `Package: ${yachtPackage.title} (${yachtPackage.timeSlot})\n`;
    message += `Price: ${yachtPackage.price} for ${yachtPackage.baseGuests} guests\n`;
    message += `Additional guests: +€20 per person (max 14 guests)\n\n`;
    message += `Porto Base: Cagliari - Sardegna\n`;
    message += `Yacht: 15 metri, fino a 14 ospiti, 3 cabine\n\n`;
    message += `Please let me know the availability. Thank you!`;
    return encodeURIComponent(message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Button
        onClick={() => navigate('/')}
        className="fixed top-24 left-4 z-40 bg-luxury-charcoal/90 text-luxury-ivory border border-luxury-gold/20 hover:bg-luxury-charcoal backdrop-blur-sm"
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

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/35baebd1-ed65-4b10-9e99-85238b1a1e94.png"
            alt="DR7 Luxury Yacht"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center text-white px-4"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
          <h1 className="text-5xl md:text-7xl font-seasons text-luxury-gold mb-6">
            {t('yacht.title')}
          </h1>
          <p className="text-xl md:text-2xl text-luxury-gold/90 mb-8 max-w-3xl mx-auto font-light">
            {t('yacht.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg text-white/95">
            <div className="flex items-center gap-2">
              <Ship className="w-5 h-5" />
              <span>15 metri</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Fino a 14 ospiti</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5" />
              <span>3 cabine</span>
            </div>
          </div>
          <p className="text-lg text-white/90 mt-4">
            Porto Base: Cagliari - Sardegna
          </p>
        </div>
      </div>

      <main className="py-16">
        {/* Yacht Packages */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-seasons text-luxury-gold mb-4">
              {t('yacht.packages')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('yacht.packagesdesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {yachtPackages.map((pkg) => (
              <Card key={pkg.id} className="bg-luxury-charcoal/5 border-luxury-gold/20 hover:shadow-luxury transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl font-seasons text-luxury-gold mb-2">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.timeSlot}</span>
                    </div>
                    <div className="text-4xl font-bold text-luxury-gold mb-2">
                      {pkg.price}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {pkg.baseGuests} {t('yacht.persons')}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      {pkg.description}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      const message = generateWhatsAppMessage(pkg);
                      window.open(`https://wa.me/393457905205?text=${message}`, '_blank');
                    }}
                    variant="luxury"
                    className="w-full"
                  >
                    {t('rentals.booknow')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-luxury-gold font-bold text-lg">
              +€20 {t('yacht.additionalguest')} (max 14 {t('yacht.persons')})
            </p>
          </div>
        </div>

        {/* Included Services */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-seasons text-luxury-gold mb-4">
              {t('yacht.included')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {includedServices.map((service, index) => (
              <div key={index} className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-4">
                <p className="text-center text-sm">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Services */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-seasons text-luxury-gold mb-4">
              {t('yacht.extraservices')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('yacht.extraservicesdesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {extraServices.map((service, index) => (
              <div key={index} className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-4">
                <p className="text-center text-sm">{service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="container mx-auto px-4 text-center">
          <div className="bg-luxury-charcoal/5 border border-luxury-gold/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-luxury-gold mb-4">
              {t('yacht.needhelp')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('yacht.personalservice')}
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905205', '_blank')}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('yacht.contactus')}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}