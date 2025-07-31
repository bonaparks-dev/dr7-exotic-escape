import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import { FeaturedListings } from "@/components/FeaturedListings";
import { Footer } from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServiceCategories />
        <FeaturedListings />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
