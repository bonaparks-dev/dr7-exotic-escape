import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video failed to load:", e);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero-video.MP4"
        autoPlay
        muted
        loop
        playsInline
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
      />

      {/* Optional Overlay */}
      <div className="absolute inset-0 bg-gradient-hero z-0" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-luxury-ivory mb-6 leading-tight">
          Redefine
          <span className="block bg-gradient-gold bg-clip-text text-transparent">
            Luxury
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-luxury-ivory/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Access the world's most exclusive supercars, villas, yachts, private jets, and personal chefs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#services">
            <Button variant="gold" size="lg" className="px-8 py-6 text-lg">
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>   
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-luxury-ivory/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-luxury-ivory/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
} 
