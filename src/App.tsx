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
import VillaRental from "./pages/VillaRental";
import VillaListings from "./pages/VillaListings";
import PremiumCarDetailing from "./pages/PremiumCarDetailing";
import CookiePolicy from "./pages/CookiePolicy";
import Lottery from "./pages/Lottery";
import VillaAmbraDetails from "./pages/VillaAmbraDetails";
import JuniperHouseDetails from "./pages/JuniperHouseDetails";
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
            <Route path="/villa-rental" element={<VillaRental />} />
            <Route path="/villa-listings" element={<VillaListings />} />
          <Route path="/villa-ambra-details" element={<VillaAmbraDetails />} />
          <Route path="/juniper-house-details" element={<JuniperHouseDetails />} />
            <Route path="/premium-car-detailing" element={<PremiumCarDetailing />} />
            <Route path="/dr7-concierge" element={<DR7Concierge />} />
            <Route path="/lottery" element={<Lottery />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
