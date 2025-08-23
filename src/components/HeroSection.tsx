import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video failed to load:", e);
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  const handleAudioLoad = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = true; // ← pour que le navigateur accepte l'autoplay
      audio.volume = 0.05;
      audio.play().then(() => {
        audio.muted = false; // ← remet le son après autoplay
        setIsMuted(false);
      }).catch((error) => {
        console.log("Audio autoplay blocked by browser:", error);
      });
    }
  };

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
        muted // ← indispensable pour contourner le blocage initial
        className="hidden"
        onLoadedData={handleAudioLoad}
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
