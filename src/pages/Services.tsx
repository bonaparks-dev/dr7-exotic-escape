import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Car } from "lucide-react";

export default function Services() {
  const content = {
    title: "DR7 RAPID SERVICE – PRICE LIST",
    subtitle: "Competitive pricing for fast and professional services",
    services: {
      brakes: {
        title: "🚑 Brake Pad Replacement",
        items: [
          { name: "Front", price: "€29" },
          { name: "Rear", price: "€29" },
          { name: "Front + Rear", price: "€49" }
        ]
      },
      oil: {
        title: "🛢️ Express Oil Service (oil + filters)",
        subtitle: "Includes fluid level check",
        items: [
          { name: "City cars", price: "€39" },
          { name: "Sedans/SUVs", price: "€49" },
          { name: "Luxury/Sports cars", price: "€59" }
        ]
      },
      wipers: {
        title: "🌧️ Wiper Blade Replacement",
        items: [
          { name: "Front pair", price: "€5" },
          { name: "Rear (if present)", price: "€3" }
        ]
      },
      battery: {
        title: "🔋 Battery Replacement",
        items: [
          { name: "City cars", price: "€15" },
          { name: "Sedans/SUVs", price: "€19" }
        ]
      },
      bulbs: {
        title: "💡 Bulb Replacement",
        items: [
          { name: "Standard bulb", price: "€5 each" },
          { name: "LED/Xenon", price: "€10 each" }
        ]
      },
      mechanics: {
        title: "🔧 Quick Mechanical Fixes",
        items: [
          { name: "Wiper arms", price: "€10 each" },
          { name: "Suspension arms (easy access)", price: "€29" },
          { name: "Air/Cabin filter replacement", price: "€10 each" }
        ]
      }
    },
    footer: "⚠️ These prices refer to labor only: parts will either be supplied by the customer or purchased separately."
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-seasons text-luxury-gold mb-4">
            Rapid Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Object.values(content.services).map((service, index) => (
              <Card key={index} className="border border-luxury-gold/20 bg-white/5 backdrop-blur-md hover:border-luxury-gold transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-white">
                    {service.title}
                  </CardTitle>
                  {"subtitle" in service && (
                    <p className="text-sm text-luxury-gold italic">{service.subtitle}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2">
                      <span className="text-sm text-black/70">{item.name}</span>
                      <span className="font-semibold text-luxury-gold">{item.price}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <Card className="bg-muted/30 border-amber-200/30">
            <CardContent className="p-6">
              <p className="text-center text-sm text-white/60 leading-relaxed">
                {content.footer}
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              className="px-8 bg-luxury-gold text-black hover:bg-luxury-gold/90"
              size="lg"
              onClick={() => window.open("https://wa.me/393457905205", "_blank")}
            >
              <Car className="w-5 h-5 mr-2" />
              Book Service Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
