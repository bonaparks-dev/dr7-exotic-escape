import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  it: {
    // Navigation
    'nav.services': 'Servizi',
    'nav.rentcar': 'Noleggia Auto',
    'nav.detailing': 'Premium Car Detailing',
    'nav.rapidservices': 'Servizi Rapidi Auto',
    'nav.contact': 'Contatti',
    
    // Hero
    'hero.title': 'Esperienza di Lusso Esclusiva',
    'hero.subtitle': 'Scopri il mondo dei supercars, yacht di lusso, jet privati e ville esclusive',
    'hero.cta': 'Esplora Ora',
    
    // Services
    'services.title': 'I Nostri Servizi Premium',
    'services.supercars': 'Supercars',
    'services.supercars.desc': 'Flotta esclusiva di supercars per esperienze indimenticabili',
    'services.yachts': 'Yacht di Lusso',
    'services.yachts.desc': 'Yacht esclusivi per navigare in stile',
    'services.jets': 'Jet Privati',
    'services.jets.desc': 'Viaggi privati con il massimo comfort',
    'services.villas': 'Ville Esclusive',
    'services.villas.desc': 'Le migliori proprietà di lusso per i tuoi soggiorni',
    'services.detailing': 'Car Detailing Premium',
    'services.detailing.desc': 'Servizi professionali di detailing per la tua auto',
    'services.mechanical': 'Servizi Meccanici',
    'services.mechanical.desc': 'Manutenzione e riparazioni specializzate',
    
    // Contact
    'contact.title': 'Contatti',
    'contact.whatsapp': 'WhatsApp',
    'contact.office': 'Orari ufficio: 9:00 - 20:00',
    'contact.cta': 'Lascia che curiamo il tuo prossimo viaggio indimenticabile.',
    
    // Buttons
    'btn.booknow': 'Prenota Ora',
    'btn.learnmore': 'Scopri di più',
    'btn.contact': 'Contattaci',
    'btn.whatsapp': 'WhatsApp',
    'btn.back': 'Torna alla Home',
    
    // Footer
    'footer.services': 'Servizi',
    'footer.company': 'Azienda',
    'footer.support': 'Supporto',
    'footer.about': 'Chi Siamo',
    'footer.howitworks': 'Come Funziona',
    'footer.terms': 'Termini di Servizio',
    'footer.whatsappsupport': 'Supporto WhatsApp',
    'footer.rights': '© 2024 Dubai Rent 7.0 S.p.A. Tutti i diritti riservati.',
    
    // Car Rental
    'rentals.title': 'Collezione Auto Esclusive',
    'rentals.subtitle': 'Una flotta esclusiva. Un\'isola leggendaria. Un viaggio indimenticabile.',
    'rentals.needhelp': 'Hai Bisogno di Aiuto?',
    'rentals.helpdesc': 'Il nostro team concierge di lusso è disponibile 24/7 per aiutarti a scegliere il veicolo perfetto.',
    'rentals.contactconcierge': 'Contatta il Nostro Concierge',
    
    // Car descriptions
    'car.bmwm3': 'Un\'icona che domina la strada.',
    'car.audirs3': 'Impossibile passare inosservati.',
    'car.porsche911': 'La firma eterna di Porsche.',
    'car.hummer': 'Presenza leggendaria su strada.',
    'car.mercedesgle': 'Nato per distinguersi.',
    'car.mercedesa45': 'Compatta ma selvaggia.',
    'car.bmwm4': 'Performance iconiche con stile.',
    'car.urus': 'Intrepida su ogni strada.',
    'car.ferrari': 'Sogno italiano a cielo aperto.',
    'car.bmwm2': 'Performance pura e drammatica.',
    'car.audirs3red': 'Il lusso incontra la potenza grezza.',
    'car.macan': 'Eleganza da corsa.',
    'car.c63': 'Il re dei SUV di lusso urbani.',
    'car.alfa': 'M Power incontra l\'utilità.',
    'car.ducato': 'Pronto a trasportare tutto.',
    
    // Services Page
    'services.page.title': 'Servizi Premium',
    'services.page.subtitle': 'Esperienza di lusso e qualità senza compromessi',
    'services.exteriorwash': 'Lavaggio Esterno',
    'services.interiordetail': 'Detailing Interni',
    'services.fulldetail': 'Detailing Completo',
    'services.carcare': 'Cura Auto Premium',
    'services.maintenance': 'Manutenzione',
    'services.diagnostics': 'Diagnostica',
    
    // Cookie Consent
    'cookie.title': 'Impostazioni Privacy',
    'cookie.description': 'Utilizziamo i cookie per migliorare la tua esperienza. Puoi scegliere quali categorie accettare.',
    'cookie.essential': 'Cookie Essenziali',
    'cookie.essential.desc': 'Necessari per il funzionamento del sito',
    'cookie.analytics': 'Cookie Analitici',
    'cookie.analytics.desc': 'Ci aiutano a migliorare il nostro sito',
    'cookie.marketing': 'Cookie di Marketing',
    'cookie.marketing.desc': 'Utilizzati per mostrare annunci pertinenti',
    'cookie.acceptall': 'Accetta Tutto',
    'cookie.decline': 'Rifiuta',
    'cookie.customize': 'Personalizza',
    'cookie.save': 'Salva Preferenze',
  },
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.rentcar': 'Rent a Car',
    'nav.detailing': 'Premium Car Detailing',
    'nav.rapidservices': 'Rapid Car Services',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Exclusive Luxury Experience',
    'hero.subtitle': 'Discover the world of supercars, luxury yachts, private jets and exclusive villas',
    'hero.cta': 'Explore Now',
    
    // Services
    'services.title': 'Our Premium Services',
    'services.supercars': 'Supercars',
    'services.supercars.desc': 'Exclusive fleet of supercars for unforgettable experiences',
    'services.yachts': 'Luxury Yachts',
    'services.yachts.desc': 'Exclusive yachts to sail in style',
    'services.jets': 'Private Jets',
    'services.jets.desc': 'Private travel with maximum comfort',
    'services.villas': 'Exclusive Villas',
    'services.villas.desc': 'The finest luxury properties for your stays',
    'services.detailing': 'Premium Car Detailing',
    'services.detailing.desc': 'Professional detailing services for your car',
    'services.mechanical': 'Mechanical Services',
    'services.mechanical.desc': 'Specialized maintenance and repairs',
    
    // Contact
    'contact.title': 'Contact',
    'contact.whatsapp': 'WhatsApp',
    'contact.office': 'Office hours: 9am to 8pm',
    'contact.cta': 'Let us curate your next unforgettable journey.',
    
    // Buttons
    'btn.booknow': 'Book Now',
    'btn.learnmore': 'Learn More',
    'btn.contact': 'Contact Us',
    'btn.whatsapp': 'WhatsApp',
    'btn.back': 'Back to Home',
    
    // Footer
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.about': 'About Us',
    'footer.howitworks': 'How It Works',
    'footer.terms': 'Terms of Service',
    'footer.whatsappsupport': 'WhatsApp Support',
    'footer.rights': '© 2024 Dubai Rent 7.0 S.p.A. All rights reserved.',
    
    // Car Rental
    'rentals.title': 'Exotic Car Collection',
    'rentals.subtitle': 'An exclusive fleet. A legendary island. One unforgettable drive.',
    'rentals.needhelp': 'Need Help Choosing?',
    'rentals.helpdesc': 'Our luxury concierge team is available 24/7 to help you select the perfect vehicle for your needs.',
    'rentals.contactconcierge': 'Contact Our Concierge',
    
    // Car descriptions
    'car.bmwm3': 'An icon that dominates the road.',
    'car.audirs3': 'Impossible to go unnoticed.',
    'car.porsche911': 'The eternal signature of Porsche.',
    'car.hummer': 'Legendary road presence.',
    'car.mercedesgle': 'Born to stand out.',
    'car.mercedesa45': 'Compact but wild.',
    'car.bmwm4': 'Iconic performance in style.',
    'car.urus': 'Fearless on any road.',
    'car.ferrari': 'Open-top Italian dream.',
    'car.bmwm2': 'Pure performance and drama.',
    'car.audirs3red': 'Luxury meets raw power.',
    'car.macan': 'Race-bred elegance.',
    'car.c63': 'The king of urban luxury SUVs.',
    'car.alfa': 'M Power meets utility.',
    'car.ducato': 'Ready to carry it all.',
    
    // Services Page
    'services.page.title': 'Premium Services',
    'services.page.subtitle': 'Luxury experience and uncompromising quality',
    'services.exteriorwash': 'Exterior Wash',
    'services.interiordetail': 'Interior Detailing',
    'services.fulldetail': 'Full Detailing',
    'services.carcare': 'Premium Car Care',
    'services.maintenance': 'Maintenance',
    'services.diagnostics': 'Diagnostics',
    
    // Cookie Consent
    'cookie.title': 'Privacy Settings',
    'cookie.description': 'We use cookies to improve your experience. You can choose which categories to accept.',
    'cookie.essential': 'Essential Cookies',
    'cookie.essential.desc': 'Required for the site to function',
    'cookie.analytics': 'Analytics Cookies',
    'cookie.analytics.desc': 'Help us improve our website',
    'cookie.marketing': 'Marketing Cookies',
    'cookie.marketing.desc': 'Used to show relevant advertisements',
    'cookie.acceptall': 'Accept All',
    'cookie.decline': 'Decline',
    'cookie.customize': 'Customize',
    'cookie.save': 'Save Preferences',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('it'); // Default to Italian

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
