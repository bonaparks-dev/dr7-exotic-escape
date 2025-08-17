import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-luxury-gold">{t('notfound.title')}</h1>
        <p className="text-xl text-muted-foreground mb-4">{t('notfound.subtitle')}</p>
        <a href="/" className="text-luxury-gold hover:text-luxury-gold/80 underline">
          {t('notfound.returnhome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
