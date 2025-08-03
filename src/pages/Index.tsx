import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import { Footer } from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServiceCategories />

        {/* SECTION CONTACT STYLE JETCAR */}
        <section
          id="contact"
          className="relative bg-black text-white py-24 px-6 md:px-12 overflow-hidden"
          style={{
            backgroundImage: "url('/backgrounds/dr7-contact-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
            {/* Infos à gauche */}
            <div className="md:w-1/2 text-left">
              <h2 className="text-4xl font-bold uppercase mb-6 text-white">Contacts</h2>
              <p className="text-gold text-sm uppercase mb-2">WhatsApp</p>
              <p className="text-2xl font-semibold mb-6 text-white">+39 345 790 5205</p>

              <p className="mb-1 text-white">Cagliari, Via Marconi</p>
              <p className="text-gray-400 mb-6">Office hours: 9am to 7pm</p>

              <div className="flex space-x-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-luxury-gold"
                  onClick={() => window.open('https://www.instagram.com/dr7_exotic_cars', '_blank')}
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-luxury-gold"
                  onClick={() => window.open('https://tiktok.com/@dr7_exotic_cars', '_blank')}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </Button>
              </div>

              <p className="text-sm text-gray-300">
                Current and new models in our{" "}
                <a
                  href="https://t.me/dr7exotic"
                  className="underline text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  telegram channel
                </a>
              </p>
            </div>

            {/* Voiture à droite */}
            <div className="md:w-1/2 mt-12 md:mt-0 flex justify-end">
              <img
                src="/cars/dr7-luxury-car.png"
                alt="Luxury Car"
                className="max-w-full w-[500px] object-contain"
              />
            </div>
          </div>

          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
