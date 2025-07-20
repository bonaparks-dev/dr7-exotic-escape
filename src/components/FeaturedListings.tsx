import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar } from "lucide-react";

const featuredListings = [
  {
    id: 1,
    title: "Ferrari F8 Tributo",
    category: "Supercar",
    location: "Miami, FL",
    price: "$2,500",
    period: "per day",
    rating: 4.9,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=600&h=400",
    featured: true,
    availability: "Available Now"
  },
  {
    id: 2,
    title: "Luxury Yacht - Azimut 78",
    category: "Yacht",
    location: "Monaco",
    price: "$15,000",
    period: "per day",
    rating: 5.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600&h=400",
    featured: true,
    availability: "2 Available"
  },
  {
    id: 3,
    title: "Gulfstream G650 Private Jet",
    category: "Private Jet",
    location: "Global",
    price: "$25,000",
    period: "per flight",
    rating: 4.8,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600&h=400",
    featured: false,
    availability: "Book 24h Ahead"
  }
];

export function FeaturedListings() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-gold bg-clip-text text-transparent">Featured</span> Experiences
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-picked premium selections available for immediate booking
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((listing) => (
            <Card key={listing.id} className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 bg-card">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {listing.featured && (
                  <Badge className="absolute top-4 left-4 bg-luxury-gold text-luxury-charcoal border-0">
                    Featured
                  </Badge>
                )}
                
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="w-4 h-4 text-luxury-gold fill-current" />
                  <span className="text-white text-sm font-medium">{listing.rating}</span>
                  <span className="text-white/70 text-sm">({listing.reviews})</span>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{listing.availability}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {listing.category}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-luxury-charcoal">{listing.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{listing.period}</span>
                  </div>
                </div>
                
                <Button variant="luxury" className="w-full">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Listings
          </Button>
        </div>
      </div>
    </section>
  );
}