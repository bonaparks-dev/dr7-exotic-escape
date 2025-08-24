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
      "/lovable-uploads/1630985d-a23b-4344-a01f-886c5fa2be7b.png"
    ],
    description: "Benvenuti a Villa Elicriso, una residenza esclusiva situata a Geremeas, a soli 50 metri da una spiaggia incontaminata tra le più belle della Sardegna.",
    rating: 4.9,
    reviewCount: 28
  },
  {
    id: 2,
    title: "Villa Azzurra Mare",
    location: "Costa Smeralda, Sardegna",
    distanceToBeach: "30m dalla Spiaggia",
    price: "€3,200",
    nightly: 3200,
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 5,
    images: [
      "/lovable-uploads/5e5637a8-a5f2-4706-82f7-04258ae88ed9.png",
      "/lovable-uploads/35baebd1-ed65-4b10-9e99-85238b1a1e94.png",
      "/lovable-uploads/1a77a331-00a9-4d17-966c-3e101a9fa94b.png",
      "/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png"
    ],
    description: "Una villa esclusiva sulla Costa Smeralda con vista mozzafiato sul mare cristallino e accesso diretto alla spiaggia privata.",
    rating: 4.8,
    reviewCount: 42
  },
  {
    id: 3,
    title: "Villa Bellavista",
    location: "Portofino, Liguria",
    distanceToBeach: "100m dalla Spiaggia",
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
    description: "Villa elegante nel cuore di Portofino con terrazza panoramica e giardino mediterraneo, perfetta per una vacanza di lusso.",
    rating: 4.7,
    reviewCount: 31
  },
  {
    id: 4,
    title: "Villa Sole & Mare",
    location: "Amalfi, Campania",
    distanceToBeach: "80m dalla Spiaggia",
    price: "€2,200",
    nightly: 2200,
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4,
    images: [
      "/lovable-uploads/1630985d-a23b-4344-a01f-886c5fa2be7b.png",
      "/lovable-uploads/5e5637a8-a5f2-4706-82f7-04258ae88ed9.png",
      "/lovable-uploads/35baebd1-ed65-4b10-9e99-85238b1a1e94.png",
      "/lovable-uploads/1a77a331-00a9-4d17-966c-3e101a9fa94b.png"
    ],
    description: "Villa tradizionale con vista sulla costiera amalfitana, piscina infinity e terrazze panoramiche su uno dei litorali più belli d'Italia.",
    rating: 4.9,
    reviewCount: 56
  },
  {
    id: 5,
    title: "Villa Tramonto",
    location: "Taormina, Sicilia",
    distanceToBeach: "200m dalla Spiaggia",
    price: "€1,800",
    nightly: 1800,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png",
      "/lovable-uploads/5e56409c-5698-4e7a-bf07-4cceb7a09004.png",
      "/lovable-uploads/762fc2b2-9d97-4d9c-8fdc-0c8874f25643.png",
      "/lovable-uploads/4b224ab5-3163-4cb1-b641-d98203333d38.png"
    ],
    description: "Villa con vista sull'Etna e sul mare, immersa nel verde di Taormina con piscina privata e giardino curato.",
    rating: 4.6,
    reviewCount: 23
  }
];

export default function VillaListings() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleVillaClick = (villaId: number) => {
    if (villaId === 1) {
      navigate("/villa-rental");
    } else {
      // For now, all other villas go to the same detail page
      // In the future, you can create individual pages for each villa
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Ville di Lusso</h1>
            <p className="text-xl text-white/80">
              Scopri le nostre ville esclusive con servizi concierge 24/7
            </p>
          </div>

          {/* Villa Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{villa.price}</div>
                      <div className="text-white/70 text-sm">per notte</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVillaClick(villa.id);
                      }}
                    >
                      Dettagli
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
                Non trovi la villa perfetta?
              </h2>
              <p className="text-white/80 mb-6">
                Il nostro team concierge può aiutarti a trovare l'alloggio ideale per le tue esigenze
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
    </div>
  );
}