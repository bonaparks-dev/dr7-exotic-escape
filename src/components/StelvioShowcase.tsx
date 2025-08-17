import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, Gauge, Cog } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function StelvioShowcase() {
  const { t } = useLanguage();

  const stelvio = {
    name: "Alfa Romeo Stelvio Quadrifoglio",
    dailyPrice: 40,
    specs: {
      acceleration: "0–100 in 3.8s",
      power: "510Cv",
      torque: "600Nm",
      engine: "2.9L V6 BiTurbo"
    },
    description: "Italian excellence meets SUV practicality.",
    image: "/alpha.png",
    rating: 4.8,
    reviews: 15
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-gold bg-clip-text text-transparent">Featured</span> Performance SUV
          </h2>
          <p className="text-xl text-luxury-gold max-w-2xl mx-auto">
            Experience Italian racing heritage in SUV form
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-luxury bg-card">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-80 md:h-full overflow-hidden">
                <img
                  src={stelvio.image}
                  alt={stelvio.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <Badge className="absolute top-4 left-4 bg-luxury-gold text-luxury-charcoal border-0">
                  Premium SUV
                </Badge>
                
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-luxury-gold fill-current" />
                  <span className="text-black text-sm font-medium">{stelvio.rating}</span>
                  <span className="text-black/70 text-sm">({stelvio.reviews})</span>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{stelvio.name}</h3>
                <p className="text-muted-foreground mb-6">{stelvio.description}</p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Acceleration</p>
                      <p className="font-semibold">{stelvio.specs.acceleration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Power</p>
                      <p className="font-semibold">{stelvio.specs.power}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cog className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="text-sm text-muted-foreground">Engine</p>
                      <p className="font-semibold">{stelvio.specs.engine}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-luxury-gold rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-luxury-charcoal">T</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Torque</p>
                      <p className="font-semibold">{stelvio.specs.torque}</p>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-luxury-charcoal">€{stelvio.dailyPrice}</span>
                    <span className="text-luxury-gold text-sm ml-1">per day</span>
                  </div>
                </div>

                <Button variant="luxury" size="lg" className="w-full">
                  Book Stelvio Experience
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}