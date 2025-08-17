import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const AgeVerificationModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if user has already verified age
    const hasVerified = localStorage.getItem('ageVerified');
    if (!hasVerified) {
      // Show modal after a short delay to ensure it appears after cookie banner
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('ageVerified', 'true');
    setIsVisible(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://google.com';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6 text-black">
            {t('ageVerification.title')}
          </h2>
          
          <div className="text-base text-gray-600 leading-relaxed">
            <p>
              {language === 'it' ? t('ageVerification.messageIt') : t('ageVerification.messageEn')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            {t('ageVerification.yes')}
          </Button>
          
          <Button
            onClick={handleDeny}
            variant="outline"
            className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-200 font-medium"
          >
            {t('ageVerification.no')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;