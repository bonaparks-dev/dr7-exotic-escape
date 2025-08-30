import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface PrivateJet {
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

const privateJets: PrivateJet[] = [
  {
    id: 1,
    name: "Cessna Citation X+",
    specs: {
      capacity: "Up to 12 passengers",
      range: "Flight range: 6,408km",
      speed: "Max speed: 972 km/h",
      crew: "2 professional pilots + cabin crew",
      type: "Super Mid-Size Jet"
    },
    description: "Fastest civilian aircraft with luxurious interiors.",
    image: "/jetprivate.MP4",
    available: true
  },
  {
    id: 2,
    name: "Gulfstream G650",
    specs: {
      capacity: "Up to 18 passengers",
      range: "Flight range: 13,890km",
      speed: "Max speed: 956 km/h",
      crew: "2-3 professional pilots + cabin crew",
      type: "Ultra Long Range Jet"
    },
    description: "Ultimate luxury with global reach capabilities.",
    image: "/jetprivate.MP4",
    available: true
  },
  {
    id: 3,
    name: "Bombardier Global 7500",
    specs: {
      capacity: "Up to 19 passengers",
      range: "Flight range: 14,260km",
      speed: "Max speed: 925 km/h",
      crew: "2-3 professional pilots + cabin crew",
      type: "Ultra Long Range Jet"
    },
    description: "Spacious cabin with four living spaces.",
    image: "/jetprivate.MP4",
    available: false
  }
];

const PrivateJetListings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleDiscoverMore = (jetId: number) => {
    // For now, just log the jet ID
    console.log(`Navigate to private jet ${jetId} details`);
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
              Private Jet Collection
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Experience the pinnacle of luxury aviation with our exclusive fleet of private jets
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privateJets.map((jet) => (
              <Card key={jet.id} className={`bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 group ${jet.available === false ? 'opacity-60' : ''}`}>
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <video
                    src={jet.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  {jet.available === false && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Not Available</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-seasons text-white mb-1">
                      {jet.name}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">{jet.description}</p>
                  </div>

                  <div className="space-y-1 mb-6 text-sm">
                    <div className="flex items-center text-white/70">
                      {jet.specs.capacity} • {jet.specs.type}
                    </div>
                    <div className="flex items-center text-white/70">
                      {jet.specs.range}
                    </div>
                    {jet.specs.speed && (
                      <div className="flex items-center text-white/70">
                        {jet.specs.speed}
                      </div>
                    )}
                    {jet.specs.crew && (
                      <div className="flex items-center text-white/70">
                        {jet.specs.crew}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleDiscoverMore(jet.id)}
                    variant="luxury"
                    className="w-full"
                    disabled={jet.available === false}
                  >
                    {jet.available === false ? 'Not Available' : 'Discover More'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <h2 className="text-2xl font-seasons text-white mb-4">
              Ready for Takeoff?
            </h2>
            <p className="text-white/80 mb-6">
              Our aviation concierge team is available 24/7 to arrange your luxury flight experience.
            </p>
            <Button
              onClick={() => window.open('https://wa.me/393457905202', '_blank')}
              variant="luxury"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Aviation Concierge
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivateJetListings;