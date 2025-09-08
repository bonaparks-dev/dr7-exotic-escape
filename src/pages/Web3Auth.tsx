import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Web3Auth() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // For now, we'll use Google OAuth as the Web3 integration
      // This can be extended later with actual wallet providers
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast.error('Failed to connect. Please try again.');
        console.error('Web3 connection error:', error);
      } else {
        toast.success('Successfully connected!');
        navigate('/', { replace: true });
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Web3 auth video failed to load:", e);
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
      <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-white hover:bg-white/10 font-sans"
          aria-label="Go back"
        >
          ← Back
        </Button>
        
        <img 
          src="/lovable-uploads/bda33e8e-6cf9-4057-816e-d3c2a51425db.png" 
          alt="DR7 Exotic Logo" 
          className="h-12 w-auto object-contain"
        />
        
        <div className="w-20" /> {/* Spacer for center alignment */}
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white font-sans leading-tight">
            Connect Your Digital Identity
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 font-sans max-w-lg mx-auto leading-relaxed">
            Secure access to DR7 Luxury Empire through decentralized authentication. Your gateway to exclusive luxury experiences.
          </p>
          
          {/* Connection Status */}
          {isConnecting && (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white font-sans">Connecting...</span>
            </div>
          )}
          
          {/* Web3 Connect Button */}
          <div className="pt-8">
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="px-12 py-4 bg-white text-black font-bold text-lg font-sans hover:bg-white/90 transition-all duration-200 border-2 border-white focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Connect your digital wallet"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>
          
          {/* Alternative Authentication */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-sm text-white/60 font-sans mb-4">
              Or use traditional authentication
            </p>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="px-8 py-3 bg-transparent text-white font-semibold font-sans border-2 border-white hover:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Use email and password"
            >
              Email & Password
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}