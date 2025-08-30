import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Helicopter {
  id: number;
  name: string;
  specs: {
    capacity: string;
    range: string;
    speed?: string;
    crew?: string;
    type: string;
  };
  description: string;
  image: string;
  available?: boolean;
}

const helicopters: Helicopter[] = [
  {
    id: 1,
    name: "Airbus H145",
    specs: {
      capacity: "Up to 8 passengers",
      range: "Flight range: 650km",
      speed: "Max speed: 268 km/h",
      crew: "2 professional pilots",
      type: "Twin-Engine Helicopter"
    },
    description: "Premium luxury helicopter for VIP transfers.",
    image: "/helicopter.MP4",
    available: true
  },
  {
    id: 2,
    name: "Bell 407",
    specs: {
      capacity: "Up to 6 passengers",
      range: "Flight range: 600km",
      speed: "Max speed: 246 km/h",
      crew: "1-2 professional pilots",
      type: "Single-Engine Helicopter"
    },
    description: "Versatile helicopter perfect for scenic flights.",
    image: "/elico1.jpg",
    available: true
  },
  {
    id: 3,
    name: "Leonardo AW139",
    specs: {
      capacity: "Up to 12 passengers",
      range: "Flight range: 900km",
      speed: "Max speed: 310 km/h",
      crew: "2 professional pilots",
      type: "Medium Twin-Engine"
    },
    description: "Spacious cabin with ultimate comfort.",
    image: "/elico2.jpg",
    available: true
  }
];

const HelicopterListings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleDiscoverMore = (helicopterId: number) => {
    // For now, just log the helicopter ID
    console.log(`Navigate to helicopter ${helicopterId} details`);
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
              Luxury Helicopter Fleet
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Experience breathtaking aerial tours and VIP transfers with our premium helicopter collection
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helicopters.map((helicopter) => (
              <Card key={helicopter.id} className={`bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 group ${helicopter.available === false ? 'opacity-60' : ''}`}>
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  {helicopter.image.endsWith('.MP4') || helicopter.image.endsWith('.mp4') ? (
                    <video
                      src={helicopter.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={helicopter.image}
                      alt={helicopter.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {helicopter.available === false && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Not Available</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-seasons text-white mb-1">
                      {helicopter.name}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">{helicopter.description}</p>
                  </div>

                  <div className="space-y-1 mb-6 text-sm">
                    <div className="flex items-center text-white/70">
                      {helicopter.specs.capacity} • {helicopter.specs.type}
                    </div>
                    <div className="flex items-center text-white/70">
                      {helicopter.specs.range}
                    </div>
                    {helicopter.specs.speed && (
                      <div className="flex items-center text-white/70">
                        {helicopter.specs.speed}
                      </div>
                    )}
                    {helicopter.specs.crew && (
                      <div className="flex items-center text-white/70">
                        {helicopter.specs.crew}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleDiscoverMore(helicopter.id)}
                    variant="luxury"
                    className="w-full"
                    disabled={helicopter.available === false}
                  >
                    {helicopter.available === false ? 'Not Available' : 'Discover More'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-white mb-4">
              Need Flight Planning?
            </h2>
            <p className="text-white/80 mb-6">
              Our aviation specialists are ready to arrange your perfect helicopter experience.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905202', '_blank')}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Aviation Team
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelicopterListings;
