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

  const handleAudioLoad = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.currentTarget;
    audio.play().catch(error => {
      console.log("Audio autoplay blocked by browser:", error);
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/main.MP4"
        autoPlay
        muted
        loop
        playsInline
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
      />

      {/* Background Music */}
      <audio
        autoPlay
        loop
        className="hidden"
        onLoadedData={handleAudioLoad}
      >
        <source src="/cosmic.mp3" type="audio/mpeg" />
      </audio>

    </section>
  );
} 
