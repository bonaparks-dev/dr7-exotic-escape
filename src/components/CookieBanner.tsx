import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm sm:text-base text-center sm:text-left">
          By using our site, you agree to our use of cookies 🍪
        </div>
        <button
          onClick={handleAccept}
          className="bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white px-6 py-2 rounded transition-colors duration-200 text-sm font-medium min-w-[60px]"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;