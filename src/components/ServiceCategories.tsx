import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Ship, Plane, Home, ChefHat } from "lucide-react";

const categories = [
  {
    id: 'supercars',
    title: 'Cars',
    description: 'Ferrari, Lamborghini, Mercedes & more',
    icon: Car,
    image: '/cars.jpg',
    itemCount: '15 Available',
    buttonLabel: 'Rent a car',
    link: '/rentals'
  },
  {
    id: 'yachts',
    title: 'Luxury Yachts',
    description: 'Private charters & exclusive access',
    icon: Ship,
    image: '/yacht.jpg',
    buttonLabel: 'Get info'
  },
  {
    id: 'jets',
    title: 'Private Jets',
    description: 'Global destinations, ultimate comfort',
    icon: Plane,
    image: '/privatejet.jpg',
    buttonLabel: 'Get info'
  },
  {
    id: 'villas',
    title: 'Luxury Villas',
    description: 'Exclusive properties worldwide',
    icon: Home,
    image: '/exclusivevilla.jpg',
    buttonLabel: 'Get info'
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
          <p className="text-xl text-luxury-gold max-w-2xl mx-auto">
            Luxury without limits. Experiences without compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 bg-card/50 backdrop-blur-sm"
            >
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
                <p className="text-luxury-gold mb-4">{category.description}</p>
                {category.link ? (
                  <a href={category.link}>
                    <Button variant="luxury" className="w-full">
                      {category.buttonLabel}
                    </Button>
                  </a>
                ) : (
                  <Button variant="luxury" className="w-full">
                    {category.buttonLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
