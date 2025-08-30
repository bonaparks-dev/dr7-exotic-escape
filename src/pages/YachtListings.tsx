import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Yacht {
  id: number;
  name: string;
  dailyPrice: number;
  specs: {
    length: string;
    guests: string;
    speed?: string;
    crew?: string;
    cabins?: string;
    type: string;
  };
  description: string;
  image: string;
  available?: boolean;
}

const yachts: Yacht[] = [
  {
    id: 1,
    name: "Ocean Pearl",
    dailyPrice: 2500,
    specs: {
      length: "30m",
      guests: "Up to 12 guests",
      speed: "Max speed: 25 knots",
      crew: "Professional crew of 4",
      cabins: "5 luxury cabins",
      type: "Motor Yacht"
    },
    description: "Elegant luxury yacht with panoramic views.",
    image: "/yacht.jpg",
    available: true
  },
  {
    id: 2,
    name: "Azure Dream",
    dailyPrice: 3200,
    specs: {
      length: "35m",
      guests: "Up to 16 guests",
      speed: "Max speed: 28 knots",
      crew: "Professional crew of 6",
      cabins: "6 luxury suites",
      type: "Super Yacht"
    },
    description: "Ultimate luxury with modern amenities.",
    image: "/yacht.jpg",
    available: true
  },
  {
    id: 3,
    name: "Mediterranean Star",
    dailyPrice: 1800,
    specs: {
      length: "25m",
      guests: "Up to 10 guests",
      speed: "Max speed: 22 knots",
      crew: "Professional crew of 3",
      cabins: "4 comfortable cabins",
      type: "Motor Yacht"
    },
    description: "Perfect for intimate gatherings.",
    image: "/yacht.jpg",
    available: false
  },
  {
    id: 4,
    name: "Golden Horizon",
    dailyPrice: 4500,
    specs: {
      length: "45m",
      guests: "Up to 20 guests",
      speed: "Max speed: 30 knots",
      crew: "Professional crew of 8",
      cabins: "8 luxury suites",
      type: "Mega Yacht"
    },
    description: "The pinnacle of luxury yachting.",
    image: "/yacht.jpg",
    available: true
  },
  {
    id: 5,
    name: "Sunset Explorer",
    dailyPrice: 2100,
    specs: {
      length: "28m",
      guests: "Up to 10 guests",
      speed: "Max speed: 24 knots",
      crew: "Professional crew of 4",
      cabins: "4 deluxe cabins",
      type: "Explorer Yacht"
    },
    description: "Adventure meets luxury on the seas.",
    image: "/yacht.jpg",
    available: true
  }
];

const YachtListings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleDiscoverMore = (yachtId: number) => {
    if (yachtId === 1) {
      navigate('/yacht-rental');
    } else {
      // For other yachts, could navigate to their specific detail pages
      console.log(`Navigate to yacht ${yachtId} details`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <Button
        onClick={() => navigate('/')}
        className="fixed top-24 left-4 z-40 bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Button
        onClick={() => window.open('https://wa.me/393457905205', '_blank')}
        className="fixed bottom-20 right-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg md:hidden"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-seasons text-white mb-4">
              Luxury Yacht Collection
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover our premium fleet of luxury yachts for unforgettable experiences on the Mediterranean
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yachts.map((yacht) => (
              <Card key={yacht.id} className={`bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 group ${yacht.available === false ? 'opacity-60' : ''}`}>
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <img
                    src={yacht.image}
                    alt={yacht.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {yacht.available === false && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Not Available</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-seasons text-white mb-1">
                      {yacht.name}
                    </h3>
                    <p className="text-sm text-white/70 mb-2">{yacht.description}</p>
                    <div className="text-2xl font-bold text-white mb-2">
                      €{yacht.dailyPrice.toLocaleString()}<span className="text-sm font-normal text-white/60">/day</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-6 text-sm">
                    <div className="flex items-center text-white/70">
                      {yacht.specs.length} • {yacht.specs.type}
                    </div>
                    <div className="flex items-center text-white/70">
                      {yacht.specs.guests}
                    </div>
                    {yacht.specs.speed && (
                      <div className="flex items-center text-white/70">
                        {yacht.specs.speed}
                      </div>
                    )}
                    {yacht.specs.crew && (
                      <div className="flex items-center text-white/70">
                        {yacht.specs.crew}
                      </div>
                    )}
                    {yacht.specs.cabins && (
                      <div className="flex items-center text-white/70">
                        {yacht.specs.cabins}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleDiscoverMore(yacht.id)}
                    variant="luxury"
                    className="w-full"
                    disabled={yacht.available === false}
                  >
                    {yacht.available === false ? 'Not Available' : 'Discover More'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-white mb-4">
              Need Assistance?
            </h2>
            <p className="text-white/80 mb-6">
              Our yacht concierge is available 24/7 to help you find the perfect vessel for your needs.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905202', '_blank')}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Yacht Concierge
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default YachtListings;