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
    'services.helicopters': 'Elicotteri',
    'services.helicopters.desc': 'Voli in elicottero di lusso per viste spettacolari',
    'services.detailing': 'Car Detailing Premium',
    'services.detailing.desc': 'Servizi professionali di detailing per la tua auto',
    'services.mechanical': 'Servizi Meccanici',
    'services.mechanical.desc': 'Manutenzione e riparazioni specializzate',
    
    // Contact
    'contact.title': 'Contatti',
    'contact.whatsapp': 'WhatsApp',
    'contact.office': 'Orari ufficio: 9:00 - 20:00',
    
    // Auth
    'auth.welcome': 'Benvenuti in DR7 Exotic',
    'auth.subtitle': 'Accedi al tuo account di noleggio di lusso',
    'auth.signin': 'Accedi',
    'auth.signup': 'Registrati', 
    'auth.signin.title': 'Accedi',
    'auth.signin.desc': 'Inserisci le tue credenziali per accedere al tuo account',
    'auth.signup.title': 'Crea Account',
    'auth.signup.desc': 'Unisciti a DR7 Exotic per noleggi di lusso esclusivi',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotpassword': 'Password dimenticata?',
    'auth.signingin': 'Accesso in corso...',
    'auth.creatingaccount': 'Creazione account in corso...',
    'auth.createaccount': 'Crea Account',
    'auth.continuewithgoogle': 'Continua con Google',
    'auth.continuewithfacebook': 'Continua con Facebook',
    'auth.acceptterms': 'Accetto i',
    'auth.termsofservice': 'Termini di Servizio',
    'auth.and': 'e la',
    'auth.privacypolicy': 'Privacy Policy',
    'auth.minchars': 'Minimo 6 caratteri',
    
    // Rentals
    'rentals.backto': 'Torna alla Home',
    'rentals.needhelp': 'Hai Bisogno di Aiuto?',
    'rentals.helpdesc': 'Il nostro team concierge di lusso è disponibile 24/7 per aiutarti a scegliere il veicolo perfetto.',
    'rentals.contactconcierge': 'Contatta il Nostro Concierge',
    'rentals.booknow': 'Prenota Ora',
    
    // Services
    'services.rapidservices': 'Servizi Rapidi',
    'services.rapiddesc': 'Prezzi competitivi per servizi rapidi e professionali',
    'services.rapidsubtitle': 'Servizi automobilistici rapidi, affidabili e professionali di cui ti puoi fidare.',
    'services.ourservices': 'I Nostri Servizi',
    'services.ourservicesdesc': 'Servizi automobilistici professionali con prezzi trasparenti',
    'services.brakepad': 'Sostituzione Pastiglie Freno',
    'services.brakepadDesc': 'Manutenzione freni professionale per la tua sicurezza',
    'services.oilservice': 'Servizio Olio Express',
    'services.oilserviceDesc': 'Olio + filtri con controllo livello fluidi',
    'services.wiperblade': 'Sostituzione Spazzole Tergicristallo',
    'services.wiperbladeDesc': 'Visione chiara in tutte le condizioni meteorologiche',
    'services.battery': 'Sostituzione Batteria',
    'services.batteryDesc': 'Alimentazione affidabile per il tuo veicolo',
    'services.bulb': 'Sostituzione Lampadine',
    'services.bulbDesc': 'Soluzioni di illuminazione professionali',
    'services.quickmech': 'Riparazioni Meccaniche Rapide',
    'services.quickmechDesc': 'Servizi meccanici rapidi e affidabili',
    'services.needservice': 'Hai Bisogno di un Servizio?',
    'services.needservicedesc': 'Contattaci per programmare il tuo servizio automobilistico oggi.',
    'services.bookservicenow': 'Prenota Servizio Ora',
    'services.important': 'Importante:',
    'services.importantnote': 'Questi prezzi si riferiscono solo alla manodopera. I pezzi verranno forniti dal cliente o acquistati separatamente.',
    'services.front': 'Anteriore',
    'services.rear': 'Posteriore',
    'services.frontplusrear': 'Anteriore + Posteriore',
    'services.citycars': 'Auto cittadine',
    'services.sedansuvs': 'Berline/SUV',
    'services.luxurysports': 'Auto lusso/sportive',
    'services.frontpair': 'Coppia anteriore',
    'services.rearif': 'Posteriore (se presente)',
    'services.standardbulb': 'Lampadina standard',
    'services.ledxenon': 'LED/Xenon',
    'services.wiperarms': 'Bracci tergicristallo',
    'services.suspensionarms': 'Bracci sospensioni (accesso facile)',
    'services.aircabinfilter': 'Sostituzione filtro aria/abitacolo',
    
    // Detailing
    'detailing.premiumdetailing': 'Car Detailing Premium',
    'detailing.subtitle': 'Servizi di Lavaggio Auto Veloci e Premium – Nessun Appuntamento Necessario',
    'detailing.tagline': 'Per un look pulito e dettagliato ogni giorno. Scegli eccellenza, velocità e lusso.',
    'detailing.washpackages': 'Pacchetti Lavaggio',
    'detailing.washpackagesdesc': 'Servizi di lavaggio auto premium con prodotti e tecniche di livello lusso',
    'detailing.fullclean': 'PULIZIA COMPLETA',
    'detailing.fullcleandesc': 'Pulizia essenziale per l\'eccellenza quotidiana.',
    'detailing.topshine': 'BRILLANTEZZA SUPERIORE',
    'detailing.topshinedesc': 'Protezione migliorata con finitura premium.',
    'detailing.vipexperience': 'ESPERIENZA VIP',
    'detailing.vipexperiencedesc': 'Cura completa con extra di lusso.',
    'detailing.dr7luxury': 'DR7 LUXURY',
    'detailing.dr7luxurydesc': 'L\'esperienza di detailing definitiva.',
    'detailing.courtesycar': 'Auto di Cortesia / Esperienza Supercar',
    'detailing.courtesycardesc': 'Scegli un veicolo da usare mentre puliamo il tuo',
    'detailing.standardcity': 'Auto Cittadina Standard',
    'detailing.standardcitysubtitle': 'Perfetta per commissioni o brevi attese',
    'detailing.standardcitydesc': 'Trasporto comodo e affidabile mentre dettagliamo il tuo veicolo.',
    'detailing.supercarexp': 'Esperienza Supercar',
    'detailing.supercarexpsubtitle': 'Senti il brivido delle prestazioni di lusso',
    'detailing.supercarexpdesc': 'Vivi la nostra collezione di supercar premium.',
    'detailing.ferrarilambo': 'Esperienza Ferrari / Lamborghini',
    'detailing.ferrarilambosub': 'Guida una delle nostre supercar top mentre riportiamo in vita la tua',
    'detailing.ferrarilambodesc': 'L\'esperienza di lusso definitiva con i nostri veicoli di punta.',
    'detailing.needhelpchoose': 'Hai Bisogno di Aiuto nella Scelta?',
    'detailing.needhelpchoosedesc': 'Il nostro team di lusso è disponibile 24/7 per aiutarti a selezionare il servizio perfetto per le tue esigenze.',
    'detailing.contactteam': 'Contatta il Nostro Team',
    
    // 404
    'notfound.title': '404',
    'notfound.subtitle': 'Ops! Pagina non trovata',
    'notfound.returnhome': 'Torna alla Home',
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
    'services.helicopters': 'Helicopters',
    'services.helicopters.desc': 'Luxury helicopter flights for spectacular views',
    'services.detailing': 'Premium Car Detailing',
    'services.detailing.desc': 'Professional detailing services for your car',
    'services.mechanical': 'Mechanical Services',
    'services.mechanical.desc': 'Specialized maintenance and repairs',
    
    // Contact
    'contact.title': 'Contact',
    'contact.whatsapp': 'WhatsApp',
    'contact.office': 'Office hours: 9am to 8pm',
    
    // Auth
    'auth.welcome': 'Welcome to DR7 Exotic',
    'auth.subtitle': 'Access your luxury rental account',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up', 
    'auth.signin.title': 'Sign In',
    'auth.signin.desc': 'Enter your credentials to access your account',
    'auth.signup.title': 'Create Account',
    'auth.signup.desc': 'Join DR7 Exotic for exclusive luxury rentals',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotpassword': 'Forgot password?',
    'auth.signingin': 'Signing in...',
    'auth.creatingaccount': 'Creating account...',
    'auth.createaccount': 'Create Account',
    'auth.continuewithgoogle': 'Continue with Google',
    'auth.continuewithfacebook': 'Continue with Facebook',
    'auth.acceptterms': 'I accept the',
    'auth.termsofservice': 'Terms of Service',
    'auth.and': 'and',
    'auth.privacypolicy': 'Privacy Policy',
    'auth.minchars': 'Minimum 6 characters',
    
    // Rentals
    'rentals.backto': 'Back to Home',
    'rentals.needhelp': 'Need Help Choosing?',
    'rentals.helpdesc': 'Our luxury concierge team is available 24/7 to help you select the perfect vehicle for your needs.',
    'rentals.contactconcierge': 'Contact Our Concierge',
    'rentals.booknow': 'Book Now',
    
    // Services
    'services.rapidservices': 'Rapid Services',
    'services.rapiddesc': 'Competitive pricing for fast and professional services',
    'services.rapidsubtitle': 'Quick, reliable, and professional automotive services you can trust.',
    'services.ourservices': 'Our Services',
    'services.ourservicesdesc': 'Professional automotive services with transparent pricing',
    'services.brakepad': 'Brake Pad Replacement',
    'services.brakepadDesc': 'Professional brake maintenance for your safety',
    'services.oilservice': 'Express Oil Service',
    'services.oilserviceDesc': 'Oil + filters with fluid level check',
    'services.wiperblade': 'Wiper Blade Replacement',
    'services.wiperbladeDesc': 'Clear vision in all weather conditions',
    'services.battery': 'Battery Replacement',
    'services.batteryDesc': 'Reliable power for your vehicle',
    'services.bulb': 'Bulb Replacement',
    'services.bulbDesc': 'Professional lighting solutions',
    'services.quickmech': 'Quick Mechanical Fixes',
    'services.quickmechDesc': 'Fast and reliable mechanical services',
    'services.needservice': 'Need a Service?',
    'services.needservicedesc': 'Contact us to schedule your automotive service today.',
    'services.bookservicenow': 'Book Service Now',
    'services.important': 'Important:',
    'services.importantnote': 'These prices refer to labor only. Parts will either be supplied by the customer or purchased separately.',
    'services.front': 'Front',
    'services.rear': 'Rear',
    'services.frontplusrear': 'Front + Rear',
    'services.citycars': 'City cars',
    'services.sedansuvs': 'Sedans/SUVs',
    'services.luxurysports': 'Luxury/Sports cars',
    'services.frontpair': 'Front pair',
    'services.rearif': 'Rear (if present)',
    'services.standardbulb': 'Standard bulb',
    'services.ledxenon': 'LED/Xenon',
    'services.wiperarms': 'Wiper arms',
    'services.suspensionarms': 'Suspension arms (easy access)',
    'services.aircabinfilter': 'Air/Cabin filter replacement',
    
    // Detailing
    'detailing.premiumdetailing': 'Premium Car Detailing',
    'detailing.subtitle': 'Fast & Premium Car Wash Services – No Appointment Needed',
    'detailing.tagline': 'For a clean, detailed look every day. Choose excellence, speed, and luxury.',
    'detailing.washpackages': 'Wash Packages',
    'detailing.washpackagesdesc': 'Premium car wash services with luxury-grade products and techniques',
    'detailing.fullclean': 'FULL CLEAN',
    'detailing.fullcleandesc': 'Essential cleaning for everyday excellence.',
    'detailing.topshine': 'TOP SHINE',
    'detailing.topshinedesc': 'Enhanced protection with premium finishing.',
    'detailing.vipexperience': 'VIP EXPERIENCE',
    'detailing.vipexperiencedesc': 'Comprehensive care with luxury extras.',
    'detailing.dr7luxury': 'DR7 LUXURY',
    'detailing.dr7luxurydesc': 'The ultimate detailing experience.',
    'detailing.courtesycar': 'Courtesy Car / Supercar Experience',
    'detailing.courtesycardesc': 'Choose a vehicle to use while we clean yours',
    'detailing.standardcity': 'Standard City Car',
    'detailing.standardcitysubtitle': 'Perfect for errands or short waits',
    'detailing.standardcitydesc': 'Comfortable and reliable transportation while we detail your vehicle.',
    'detailing.supercarexp': 'Supercar Experience',
    'detailing.supercarexpsubtitle': 'Feel the thrill of luxury performance',
    'detailing.supercarexpdesc': 'Experience our premium supercar collection.',
    'detailing.ferrarilambo': 'Ferrari / Lamborghini Experience',
    'detailing.ferrarilambosub': 'Drive one of our top supercars while we bring yours back to life',
    'detailing.ferrarilambodesc': 'The ultimate luxury experience with our flagship vehicles.',
    'detailing.needhelpchoose': 'Need Help Choosing?',
    'detailing.needhelpchoosedesc': 'Our luxury team is available 24/7 to help you select the perfect service for your needs.',
    'detailing.contactteam': 'Contact Our Team',
    
    // 404
    'notfound.title': '404',
    'notfound.subtitle': 'Oops! Page not found',
    'notfound.returnhome': 'Return to Home',
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
