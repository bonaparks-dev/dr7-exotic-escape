import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
      className="text-foreground hover:text-muted-foreground transition-colors"
    >
      <Globe className="w-4 h-4 mr-1" />
      {language === 'it' ? 'EN' : 'IT'}
    </Button>
  );
}