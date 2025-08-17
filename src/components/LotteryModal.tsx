import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LotteryModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if user has verified age and hasn't seen lottery popup
    const hasVerified = localStorage.getItem('ageVerified');
    const hasSeenLottery = localStorage.getItem('lotteryPopupSeen');
    
    if (hasVerified && !hasSeenLottery) {
      // Show lottery modal after age verification with a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('lotteryPopupSeen', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header with close button */}
        <div className="relative p-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-6 w-6 text-black" />
          </button>
          
          <h2 className="text-3xl font-bold text-center text-black mb-4">
            DR7 MILION LOTTERY
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Promotional text */}
          <div className="text-center mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              {language === 'it' ? t('lottery.messageIt') : t('lottery.messageEn')}
            </p>
          </div>

          {/* Lottery image */}
          <div className="mb-6 flex justify-center">
            <img 
              src="/lovable-uploads/5e5637a8-a5f2-4706-82f7-04258ae88ed9.png" 
              alt="DR7 Million Lottery Ticket"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Join lottery button */}
          <div className="text-center">
          <Button
            onClick={() => {
              handleClose();
              window.location.href = '/';
            }}
            className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 font-medium px-8 py-3 text-lg"
          >
            {t('lottery.comingSoon')}
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryModal;