import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Ship, Plane, Home, ChefHat } from "lucide-react";

const categories = [
  {
    id: 'supercars',
    title: 'Supercars',
    description: 'Ferrari, Lamborghini, McLaren & more',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800&h=600',
    itemCount: '12 Available'
  },
  {
    id: 'yachts',
    title: 'Luxury Yachts',
    description: 'Private charters & exclusive access',
    icon: Ship,
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800&h=600',
    itemCount: '8 Available'
  },
  {
    id: 'jets',
    title: 'Private Jets',
    description: 'Global destinations, ultimate comfort',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800&h=600',
    itemCount: '15 Available'
  },
  {
    id: 'villas',
    title: 'Luxury Villas',
    description: 'Exclusive properties worldwide',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800&h=600',
    itemCount: '25 Available'
  },
  {
    id: 'chefs',
    title: 'Private Chefs',
    description: 'Michelin-starred culinary experiences',
    icon: ChefHat,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800&h=600',
    itemCount: '18 Available'
  }
];

export function ServiceCategories() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Exclusive
            <span className="bg-gradient-gold bg-clip-text text-transparent"> Collections</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated luxury experiences designed for the discerning few
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 bg-card/50 backdrop-blur-sm">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/80 to-transparent" />
                <div className="absolute top-4 right-4">
                  <category.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <div className="absolute bottom-4 left-4 text-luxury-ivory">
                  <span className="text-sm font-medium bg-luxury-gold/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {category.itemCount}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button variant="luxury" className="w-full">
                  Explore Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}