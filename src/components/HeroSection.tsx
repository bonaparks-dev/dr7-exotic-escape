import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video failed to load:", e);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      if (hasInteracted) return;
      setHasInteracted(true);

      const audio = audioRef.current;
      if (audio) {
        audio.muted = false;
        audio.volume = 0.2;
        audio
          .play()
          .then(() => {
            setIsMuted(false);
          })
          .catch((error) => {
            console.log("Autoplay failed:", error);
          });
      }

      // Remove listeners after first interaction
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, [hasInteracted]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsMuted(false);
      } else {
        audio.pause();
        setIsMuted(true);
      }
    }
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
        ref={audioRef}
        autoPlay
        loop
        muted // required for initial autoplay
        className="hidden"
      >
        <source src="/cosmic.mp3" type="audio/mpeg" />
      </audio>

      {/* Mute / Unmute Button */}
      <div className="absolute top-20 right-6 z-50">
        <Button
          onClick={toggleAudio}
          className="bg-white/10 text-white text-sm px-3 py-1 border border-white/20 backdrop-blur-md hover:bg-white/20 transition rounded-md"
        >
          {isMuted ? "Unmute Music" : "Mute Music"}
        </Button>
      </div>
    </section>
  );
}
