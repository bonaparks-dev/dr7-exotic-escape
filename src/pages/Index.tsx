import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import { Footer } from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

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

              <div className="flex items-center gap-4 mb-6">
                <a href="https://www.instagram.com/dr7exotic" target="_blank" rel="noopener noreferrer">
                  <img src="/instagram.svg" alt="Instagram" className="w-6 h-6 hover:opacity-70" />
                </a>
                <a href="https://www.tiktok.com/@dr7exotic" target="_blank" rel="noopener noreferrer">
                  <img src="/tiktok.svg" alt="TikTok" className="w-6 h-6 hover:opacity-70" />
                </a>
                <a href="https://wa.me/393457905205" target="_blank" rel="noopener noreferrer">
                  <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-6 h-6 hover:opacity-70" />
                </a>
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
