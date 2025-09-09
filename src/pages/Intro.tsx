import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Intro() {
  const navigate = useNavigate();

  // Remove the redirect logic - always show intro page

  const handleButtonClick = (action: string) => {
    console.log(`Button clicked: ${action}`);
    
    switch (action) {
      case 'signup':
      case 'login':
        navigate('/auth');
        break;
      case 'connect-wallet':
        navigate('/web3-auth');
        break;
      case 'continue':
        // Clear the popup flag and navigate to home
        sessionStorage.removeItem('cameFromPopup');
        navigate('/', { replace: true });
        break;
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Intro video failed to load:", e);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/main.MP4"
        autoPlay
        muted
        loop
        playsInline
        poster="/main.jpg"
        onError={handleVideoError}
        style={{
          display: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'block'
        }}
      />
      
      {/* Fallback background for reduced motion */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/main.jpg)',
          display: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'block' : 'none'
        }}
      />
      
      {/* Black overlay for contrast */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-center p-6 md:p-8">
        <img 
          src="/lovable-uploads/bda33e8e-6cf9-4057-816e-d3c2a51425db.png" 
          alt="DR7 Exotic Logo" 
          className="h-12 w-auto object-contain"
        />
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white font-['Space_Grotesk'] leading-tight">
            Welcome to DR7 Empire
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 font-['Noto_Sans'] max-w-lg mx-auto leading-relaxed">
            Experience the pinnacle of luxury with our exclusive collection of exotic cars, villas, yachts, and premium services.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <Button
              onClick={() => handleButtonClick('signup')}
              data-action="signup"
              className="w-full md:w-auto px-8 py-3 bg-white text-black font-semibold font-['Space_Grotesk'] hover:bg-white/90 transition-all duration-200 border-2 border-white focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Sign up for DR7 Exotic account"
            >
              Sign Up
            </Button>
            
            <Button
              onClick={() => handleButtonClick('login')}
              data-action="login"
              variant="outline"
              className="w-full md:w-auto px-8 py-3 bg-transparent text-white font-semibold font-['Space_Grotesk'] border-2 border-white hover:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Log in to your DR7 Exotic account"
            >
              Log In
            </Button>
            
            <Button
              onClick={() => handleButtonClick('connect-wallet')}
              data-action="connect-wallet"
              variant="outline"
              className="w-full md:w-auto px-8 py-3 bg-transparent text-white font-semibold font-['Space_Grotesk'] border-2 border-white hover:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Connect your crypto wallet"
            >
              Connect Wallet
            </Button>
          </div>
          
          {/* Continue CTA */}
          <div className="pt-12">
            <Button
              onClick={() => navigate('/home')}
              data-action="continue"
              className="px-10 py-4 bg-white text-black font-bold text-lg font-['Space_Grotesk'] hover:bg-white/90 transition-all duration-200 border-2 border-white focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Continue to main website"
            >
              Continue
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
