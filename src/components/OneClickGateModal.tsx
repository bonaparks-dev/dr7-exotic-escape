import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Crown } from "lucide-react";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const OneClickGateModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    analytics: true,
    marketing: true,
  });
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if user has already completed the gate
    const ageConfirmed = localStorage.getItem('dr7_age_confirmed_v1');
    const cookieConsent = localStorage.getItem('dr7_cookie_consent_v1');
    
    if (!ageConfirmed || !cookieConsent) {
      // Small delay to ensure proper rendering
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Initialize tracking if consent already given
      initializeTracking();
    }
  }, []);

  const initializeTracking = () => {
    const consent = JSON.parse(localStorage.getItem('dr7_cookie_consent_v1') || '{}');
    
    // Initialize Google Consent Mode v2
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        functionality_storage: 'granted',
        personalization_storage: consent.marketing ? 'granted' : 'denied',
        security_storage: 'granted',
      });
    }
  };

  const handleEnter = () => {
    // Store age confirmation
    localStorage.setItem('dr7_age_confirmed_v1', 'true');
    
    // Store cookie consent with preferences
    localStorage.setItem('dr7_cookie_consent_v1', JSON.stringify({
      analytics: cookiePreferences.analytics,
      marketing: cookiePreferences.marketing,
      timestamp: new Date().toISOString()
    }));

    // Initialize tracking
    initializeTracking();
    
    // Close modal
    setIsVisible(false);
  };

  const handleDenyAge = () => {
    window.location.href = 'https://google.com';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full animate-in fade-in-0 zoom-in-95 duration-300 border border-primary/20">
        
        {/* Header */}
        <div className="p-8 pb-6 text-center border-b border-primary/10">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DR7 EXOTIC
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {language === 'it' ? 'Benvenuto' : 'Welcome'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === 'it' 
              ? 'Per accedere al nostro servizio esclusivo, conferma quanto segue:'
              : 'To access our exclusive service, please confirm the following:'
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-8 pt-6 space-y-6">
          
          {/* Age Verification */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center mr-3 font-bold">1</span>
              {language === 'it' ? 'Verifica dell\'età' : 'Age Verification'}
            </h3>
            <p className="text-sm text-muted-foreground ml-9">
              {language === 'it' 
                ? 'Confermo di avere almeno 18 anni di età.'
                : 'I confirm that I am at least 18 years old.'
              }
            </p>
          </div>

          {/* Cookie Consent */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center mr-3 font-bold">2</span>
              {language === 'it' ? 'Consenso Cookie' : 'Cookie Consent'}
            </h3>
            <p className="text-sm text-muted-foreground ml-9">
              {language === 'it' 
                ? 'Utilizziamo cookie per migliorare la tua esperienza e analizzare il traffico del sito.'
                : 'We use cookies to enhance your experience and analyze site traffic.'
              }
            </p>
            {!showCookieSettings && (
              <button 
                onClick={() => setShowCookieSettings(true)}
                className="ml-9 text-xs text-primary hover:underline"
              >
                {language === 'it' ? 'Gestisci impostazioni cookie' : 'Manage cookie settings'}
              </button>
            )}
            
            {showCookieSettings && (
              <div className="ml-9 space-y-2 bg-muted/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'it' ? 'Cookie analitici' : 'Analytics cookies'}</span>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={(e) => setCookiePreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{language === 'it' ? 'Cookie marketing' : 'Marketing cookies'}</span>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={(e) => setCookiePreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lottery Banner */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center mr-3 font-bold">3</span>
              {language === 'it' ? 'Promozione Esclusiva' : 'Exclusive Promotion'}
            </h3>
            <div className="ml-9 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-foreground">DR7 MILLION LOTTERY</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'it' 
                      ? 'Partecipa alla nostra lotteria esclusiva - Prossimamente!'
                      : 'Join our exclusive lottery - Coming Soon!'
                    }
                  </p>
                </div>
                <Crown className="h-6 w-6 text-primary/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 pt-4 border-t border-primary/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleEnter}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium py-3"
            >
              {language === 'it' ? 'Entra' : 'Enter'}
            </Button>
            
            <Button
              onClick={handleDenyAge}
              variant="outline"
              className="flex-1 border-border hover:bg-muted/20 transition-colors duration-200 font-medium py-3"
            >
              {language === 'it' ? 'Non ho 18 anni' : 'Under 18'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            {language === 'it' 
              ? 'Cliccando "Entra" accetti tutti i termini sopra indicati.'
              : 'By clicking "Enter" you accept all terms stated above.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneClickGateModal;