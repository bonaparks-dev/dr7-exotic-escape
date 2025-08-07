import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsentModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allPreferences));
    setIsVisible(false);
  };

  const handleDecline = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(minimalPreferences));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-primary text-primary-foreground border-border shadow-luxury">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-seasons">
              {t('cookie.title')}
            </CardTitle>
            {showCustomize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomize(false)}
                className="text-primary-foreground hover:text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            {t('cookie.description')}
          </p>

          {showCustomize && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{t('cookie.essential')}</h3>
                  <p className="text-sm text-muted-foreground">{t('cookie.essential.desc')}</p>
                </div>
                <Switch
                  checked={preferences.essential}
                  disabled
                  className="ml-4"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{t('cookie.analytics')}</h3>
                  <p className="text-sm text-muted-foreground">{t('cookie.analytics.desc')}</p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                  className="ml-4"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{t('cookie.marketing')}</h3>
                  <p className="text-sm text-muted-foreground">{t('cookie.marketing.desc')}</p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                  className="ml-4"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {showCustomize ? (
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-foreground text-background hover:bg-muted-foreground"
              >
                {t('cookie.save')}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-foreground text-background hover:bg-muted-foreground"
                >
                  {t('cookie.acceptall')}
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  {t('cookie.decline')}
                </Button>
                <Button
                  onClick={handleCustomize}
                  variant="ghost"
                  className="flex-1 hover:bg-muted"
                >
                  {t('cookie.customize')}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsentModal;