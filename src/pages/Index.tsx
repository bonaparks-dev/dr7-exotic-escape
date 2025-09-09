import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import GoogleReviewsCarousel from "@/components/GoogleReviewsCarousel";
import { Footer } from "@/components/Footer";
import OneClickGateModal from "@/components/OneClickGateModal";
import { Instagram, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ServiceCategories />

        {/* DR7 Concierge AI Feature */}
        <section className="bg-black text-white py-16 px-4 sm:py-20 sm:px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: 'The Seasons, serif' }}>
              DR7 Concierge AI
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your elite AI assistant for ultra-luxury experiences. Exotic Cars, Yachts, Villas & more – powered by artificial intelligence.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-xs sm:text-sm">Instant Recommendations</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-xs sm:text-sm">Luxury Lifestyle Planning</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Crown className="w-4 h-4 text-white" />
                <span className="text-xs sm:text-sm">24/7 Elite Service</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/dr7-concierge')}
              className="bg-white text-black hover:bg-gray-200 font-semibold text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Experience DR7 Concierge AI
            </Button>

            <p className="text-white/60 text-xs sm:text-sm mt-4">
              Every interaction feels like a $10,000 experience
            </p>
          </div>
        </section>

        <ServiceCategories />

        {/* Google Reviews Section */}
        <section className="py-16 px-4 sm:py-20 sm:px-6 md:px-12 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: 'The Seasons, serif' }}>
                What Our Clients Say
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Real reviews from our customers who experienced the luxury of DR7 Exotic Cars
              </p>
            </div>
            <GoogleReviewsCarousel />
          </div>
        </section>


        {/* SECTION CONTACT – clean minimalist design */}
        <section
          id="contact"
          className="bg-background text-foreground py-24 px-6 md:px-12"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
            {/* Infos à gauche */}
            <div className="md:w-1/2 text-left">
              <h2
                className="text-3xl sm:text-4xl font-bold uppercase mb-6 text-foreground"
                style={{ fontFamily: 'The Seasons, serif' }}
              >
                {t('contact.title')}
              </h2>

              <p className="text-foreground text-sm uppercase mb-2">{t('contact.whatsapp')}</p>
              <p className="text-xl font-semibold mb-6">+39 345 790 5205</p>

              <p className="mb-1">Viale Marconi, 229, 09131 Cagliari</p>
              <p className="text-muted-foreground mb-6">{t('contact.office')}</p>

              <div className="flex space-x-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-muted-foreground"
                  onClick={() =>
                    window.open("https://www.instagram.com/dr7_exotic_cars", "_blank")
                  }
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-muted-foreground"
                  onClick={() =>
                    window.open("https://tiktok.com/@dr7_exotic_cars", "_blank")
                  }
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Bloc droit teaser */}
            <div className="md:w-1/2 text-muted-foreground italic text-sm pt-4">
              {t('contact.cta')}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <OneClickGateModal />
    </div>
  );
};

export default Index;
