import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video failed to load:", e);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        onCanPlay={() => console.log("Video can play")}
        onLoadStart={() => console.log("Video load started")}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Fallback for browsers that don't support video */}
      <div className="absolute inset-0 bg-luxury-charcoal -z-10" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-luxury-gold mr-3" />
          <span className="text-luxury-gold text-lg font-medium tracking-wide">
            EXCLUSIVE LUXURY EXPERIENCES
          </span>
        </div>
        
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
          <Button variant="gold" size="lg" className="px-8 py-6 text-lg">
            Explore Collection
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button variant="hero" size="lg" className="px-8 py-6 text-lg">
            Watch Experience
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-luxury-ivory/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-luxury-ivory/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
