import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Users, Bed, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Villa {
  id: number;
  title: string;
  location: string;
  distanceToBeach: string;
  price: string;
  nightly: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  description: string;
  rating?: number;
  reviewCount?: number;
}

const villas: Villa[] = [
  {
    id: 1,
    title: "Villa Elicriso - Luxury 50m from the Beach",
    location: "Geremeas, Sardegna",
    distanceToBeach: "50m dalla Spiaggia",
    price: "€2,500",
    nightly: 2500,
    maxGuests: 9,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      "/elicriso1.png",
      "/elicriso2.png",
      "/elicriso3.png",
      "/elicriso4.png"
    ],
    description: "Villa di lusso con piscina riscaldata e vista mare a soli 50 metri dalla spiaggia incontaminata di Geremeas.",
    rating: 4.9,
    reviewCount: 28
  },
  {
    id: 2,
    title: "Juniper House - Villa by the Sea",
    location: "Costa del Sud, Sardegna",
    distanceToBeach: "Accesso diretto al mare",
    price: "€1,800",
    nightly: 1800,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "/ginepro1.png",
      "/ginepro2.png",
      "/ginepro3.png",
      "/ginepro4.png"
    ],
    description: "Villa elegante con vista mare mozzafiato e accesso diretto alla spiaggia privata.",
    rating: 4.8,
    reviewCount: 22
  },
  {
    id: 3,
    title: "Villa Ambra - with cliffside pool and private access to the sea",
    location: "Costa Smeralda, Sardegna",
    distanceToBeach: "Accesso privato al mare",
    price: "€4,200",
    nightly: 4200,
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 5,
    images: [
      "/ambra1.png",
      "/ambra2.png",
      "/ambra3.png",
      "/lovable-uploads/18f8724c-e423-4c66-a32d-807b53d368f5.png"
    ],
    description: "Villa esclusiva di 400m² con piscina a strapiombo sul mare e accesso privato alla spiaggia.",
    rating: 4.9,
    reviewCount: 35
  },
  {
    id: 4,
    title: "Villa Lolly - Blue Bay",
    location: "Blue Bay, Sardegna",
    distanceToBeach: "Vista mare",
    price: "€1,600",
    nightly: 1600,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "/loly1.png",
      "/loly2.png",
      "/loly3.png",
      "/loly4.png"
    ],
    description: "Villa moderna con piscina privata e vista panoramica sulla splendida Blue Bay.",
    rating: 4.7,
    reviewCount: 18
  },
  {
    id: 5,
    title: "Villa Glicine - Villa 100 mt from the beach",
    location: "Costa del Sud, Sardegna",
    distanceToBeach: "100m dalla Spiaggia",
    price: "€2,200",
    nightly: 2200,
    maxGuests: 9,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png",
      "/lovable-uploads/5e56409c-5698-4e7a-bf07-4cceb7a09004.png",
      "/lovable-uploads/762fc2b2-9d97-4d9c-8fdc-0c8874f25643.png",
      "/lovable-uploads/4b224ab5-3163-4cb1-b641-d98203333d38.png"
    ],
    description: "Villa tradizionale sarda a soli 100 metri dalla spiaggia con giardino mediterraneo.",
    rating: 4.6,
    reviewCount: 25
  },
  {
    id: 6,
    title: "LAJ House, Cagliari center",
    location: "Cagliari Centro, Sardegna",
    distanceToBeach: "Centro città",
    price: "€1,200",
    nightly: 1200,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "/laj1.png",
      "/laj2.png",
      "/laj3.png",
      "/laj4.png"
    ],
    description: "Casa elegante di 250m² nel centro storico di Cagliari con vista sulla città e comfort moderni.",
    rating: 4.5,
    reviewCount: 15
  },
  {
    id: 7,
    title: "Villa Josy - Villa by the Sea with Heated Outdoor Jacuzzi",
    location: "Costa del Sud, Sardegna",
    distanceToBeach: "Accesso diretto al mare",
    price: "€1,900",
    nightly: 1900,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "/lovable-uploads/1630985d-a23b-4344-a01f-886c5fa2be7b.png",
      "/lovable-uploads/5e5637a8-a5f2-4706-82f7-04258ae88ed9.png",
      "/lovable-uploads/35baebd1-ed65-4b10-9e99-85238b1a1e94.png",
      "/lovable-uploads/1a77a331-00a9-4d17-966c-3e101a9fa94b.png"
    ],
    description: "Villa esclusiva sul mare con jacuzzi riscaldata all'aperto e accesso privato alla spiaggia.",
    rating: 4.8,
    reviewCount: 29
  },
  {
    id: 8,
    title: "White Villa",
    location: "Costa Smeralda, Sardegna",
    distanceToBeach: "Vista mare",
    price: "€2,800",
    nightly: 2800,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "/lovable-uploads/5e56409c-5698-4e7a-bf07-4cceb7a09004.png",
      "/lovable-uploads/762fc2b2-9d97-4d9c-8fdc-0c8874f25643.png",
      "/lovable-uploads/4b224ab5-3163-4cb1-b641-d98203333d38.png",
      "/lovable-uploads/18f8724c-e423-4c66-a32d-807b53d368f5.png"
    ],
    description: "Villa moderna di 200m² con design minimalista, vista panoramica sul mare e spazi esterni raffinati.",
    rating: 4.7,
    reviewCount: 33
  },
  {
    id: 9,
    title: "Villa Crystal Rock privacy on the sea, heated pool",
    location: "Costa Smeralda, Sardegna",
    distanceToBeach: "Accesso privato al mare",
    price: "€3,500",
    nightly: 3500,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png",
      "/lovable-uploads/5e5637a8-a5f2-4706-82f7-04258ae88ed9.png",
      "/lovable-uploads/35baebd1-ed65-4b10-9e99-85238b1a1e94.png",
      "/lovable-uploads/1a77a331-00a9-4d17-966c-3e101a9fa94b.png"
    ],
    description: "Villa esclusiva di 150m² con piscina riscaldata, privacy totale sul mare e design di lusso contemporaneo.",
    rating: 4.9,
    reviewCount: 18
  }
];

export default function VillaListings() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleVillaClick = (villaId: number) => {
    if (villaId === 1) {
      navigate("/villa-rental");
    } else if (villaId === 2) {
      navigate("/juniper-house-details");
    } else if (villaId === 3) {
      navigate("/villa-ambra-details");
    } else {
      // For other villas, go to the general detail page
      navigate("/villa-rental");
    }
  };

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
        {t("rentals.backto")}
      </Button>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('villa.listings.title')}</h1>
            <p className="text-xl text-white/80">
              {t('villa.listings.subtitle')}
            </p>
          </div>

          {/* Villa Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {villas.map((villa) => (
              <Card
                key={villa.id}
                className="bg-white/5 border-white/20 overflow-hidden cursor-pointer group hover:bg-white/10 transition-all duration-300"
                onClick={() => handleVillaClick(villa.id)}
              >
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={villa.images[0]}
                      alt={villa.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Distance Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white text-black font-medium">
                      {villa.distanceToBeach}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Rating & Location */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-current text-white" />
                      <span className="font-medium">{villa.rating?.toFixed(1)}</span>
                      <span className="text-white/70">({villa.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{villa.location.split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-white/90 transition-colors">
                    {villa.title}
                  </h3>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{villa.maxGuests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{villa.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{villa.bathrooms}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {villa.description}
                  </p>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVillaClick(villa.id);
                      }}
                    >
                      {t('villa.listings.discoverMore')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-white/5 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                {t('villa.listings.notFoundTitle')}
              </h2>
              <p className="text-white/80 mb-6">
                {t('villa.listings.notFoundDesc')}
              </p>
              <Button
                onClick={() => window.open("https://wa.me/393457905205", "_blank")}
                variant="luxury"
                size="lg"
              >
                {t('villa.listings.contactConcierge')}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
