import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  
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

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
        }}>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {t('hero.title')}
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#services">
            <Button variant="luxury" size="lg" className="px-8 py-6 text-lg">
              {t('hero.cta')}
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
