import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
        <h1 className="text-4xl font-bold font-seasons mb-4 text-luxury-gold">{t('notfound.title')}</h1>
        <p className="text-xl text-muted-foreground mb-4">{t('notfound.subtitle')}</p>
        <Button 
          onClick={() => navigate("/")} 
          variant="outline"
          className="text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-black"
        >
          {t('notfound.returnhome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
