import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Rentals from "./pages/Rentals";
import YachtRental from "./pages/YachtRental";
import YachtListings from "./pages/YachtListings";
import VillaRental from "./pages/VillaRental";
import VillaListings from "./pages/VillaListings";
import PremiumCarDetailing from "./pages/PremiumCarDetailing";
import CookiePolicy from "./pages/CookiePolicy";
import Lottery from "./pages/Lottery";
import VillaAmbraDetails from "./pages/VillaAmbraDetails";
import JuniperHouseDetails from "./pages/JuniperHouseDetails";
import VillaLollyDetails from "./pages/VillaLollyDetails";
import VillaGlicineDetails from "./pages/VillaGlicineDetails";
import VillaWhiteDetails from "./pages/VillaWhiteDetails";
import VillaLAJDetails from "./pages/VillaLAJDetails";
import VillaCrystalDetails from "./pages/VillaCrystalDetails";
import HelicopterListings from "./pages/HelicopterListings";
import PrivateJetListings from "./pages/PrivateJetListings";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentFailure } from "./pages/PaymentFailure";
import NotFound from "./pages/NotFound";
import DR7Concierge from "./components/DR7Concierge";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/yacht-rental" element={<YachtRental />} />
            <Route path="/yacht-listings" element={<YachtListings />} />
            <Route path="/villa-rental" element={<VillaRental />} />
            <Route path="/villa-listings" element={<VillaListings />} />
           <Route path="/villa-ambra-details" element={<VillaAmbraDetails />} />
           <Route path="/juniper-house-details" element={<JuniperHouseDetails />} />
           <Route path="/villa-lolly-details" element={<VillaLollyDetails />} />
           <Route path="/villa-glicine-details" element={<VillaGlicineDetails />} />
           <Route path="/villa-white-details" element={<VillaWhiteDetails />} />
           <Route path="/villa-laj-details" element={<VillaLAJDetails />} />
            <Route path="/villa-crystal-details" element={<VillaCrystalDetails />} />
            <Route path="/helicopter-listings" element={<HelicopterListings />} />
            <Route path="/private-jet-listings" element={<PrivateJetListings />} />
            <Route path="/premium-car-detailing" element={<PremiumCarDetailing />} />
            <Route path="/dr7-concierge" element={<DR7Concierge />} />
            <Route path="/lottery" element={<Lottery />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/payment-result" element={<PaymentSuccess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
