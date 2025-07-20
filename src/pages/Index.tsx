import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import { FeaturedListings } from "@/components/FeaturedListings";
import { Footer } from "@/components/Footer";

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
    </div>
  );
};

export default Index;
