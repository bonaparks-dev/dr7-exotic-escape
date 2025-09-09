import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Web3Auth() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const apply = () => setPrefersReducedMotion(mq.matches);
      apply();
      mq.addEventListener?.('change', apply);
      return () => mq.removeEventListener?.('change', apply);
    }
  }, []);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        toast.error('MetaMask not detected. Please install the extension.');
        return;
      }
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (!accounts || accounts.length === 0) {
        toast.error('No account selected in MetaMask.');
        return;
      }
      toast.success('Wallet connected with MetaMask!');
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('MetaMask connect error:', err);
      if (err?.code === 4001) {
        toast.error('Connection request rejected.');
      } else {
        toast.error('Failed to connect MetaMask.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    toast.info('WalletConnect integration coming soon.');
  };

  const handleConnectWithGoogle = async () => {
    setIsConnecting(true);
    try {
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
    console.error('Web3 auth video failed to load:', e);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Video */}
      {!prefersReducedMotion && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/main.MP4"
          autoPlay
          muted
          loop
          playsInline
          poster="/main.jpg"
          onError={handleVideoError}
        />
      )}
      {prefersReducedMotion && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/main.jpg)' }}
        />
      )}

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-white hover:bg-white/10 font-['Space_Grotesk']"
          aria-label="Go back"
        >
          ← Back
        </Button>
        <img
          src="/lovable-uploads/bda33e8e-6cf9-4057-816e-d3c2a51425db.png"
          alt="DR7 Exotic Logo"
          className="h-12 w-auto object-contain"
        />
        <div className="w-20" />
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold font-seasons text-white leading-tight">
            Connect Your Web3 Wallet
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 font-['Noto_Sans'] max-w-lg mx-auto leading-relaxed">
            Connecting your wallet unlocks exclusive features and seamless transactions within the DR7 Luxury Empire.
          </p>

          {/* Loader */}
          {isConnecting && (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white font-['Space_Grotesk']">Connecting...</span>
            </div>
          )}

          {/* --- Wallet buttons --- */}
          <div className="px-0 md:px-6">
            {/* MetaMask */}
            <button
              type="button"
              aria-label="Connect with MetaMask"
              className="w-full text-left flex items-center gap-4 bg-[#181611] px-4 min-h-[72px] py-3 rounded-xl hover:bg-[#3a3427]/70 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
              onClick={connectMetaMask}
              disabled={isConnecting}
            >
              <div className="text-white flex items-center justify-center rounded-lg bg-[#3a3427] shrink-0 size-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M240,149.31c0,16.11-3.17,29.89-9.17,39.84-7.43,12.33-19,18.85-33.39,18.85-27.94,0-47.78-37-68.78-76.22C111.64,100,92.35,64,74,64c-9.38,0-19.94,10-28.25,26.67A138.18,138.18,0,0,0,32,149.31c0,13.2,2.38,24.12,6.88,31.58S49.82,192,58.56,192c15.12,0,30.85-24.54,44.23-48.55a8,8,0,0,1,14,7.8C101.46,178.71,83.07,208,58.56,208c-14.41,0-26-6.52-33.39-18.85-6-10-9.17-23.73-9.17-39.84A154.81,154.81,0,0,1,31.42,83.54C42.82,60.62,57.94,48,74,48c27.94,0,47.77,37,68.78,76.22C159.79,156,179.08,192,197.44,192c8.74,0,15.18-3.63,19.68-11.11S224,162.51,224,149.31a138.18,138.18,0,0,0-13.74-58.64C202,74,191.39,64,182,64c-8.36,0-17.68,7.48-28.51,22.88a8,8,0,1,1-13.08-9.21c9-12.74,23-29.67,41.59-29.67,16.05,0,31.17,12.62,42.57,35.54A154.81,154.81,0,0,1,240,149.31Z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium">MetaMask</p>
                <p className="text-[#bbb19b] text-sm">Connect with your MetaMask browser extension</p>
              </div>
            </button>

            {/* WalletConnect */}
            <button
              type="button"
              aria-label="Connect with WalletConnect"
              className="mt-3 w-full text-left flex items-center gap-4 bg-[#181611] px-4 min-h-[72px] py-3 rounded-xl hover:bg-[#3a3427]/70 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
              onClick={connectWalletConnect}
              disabled={isConnecting}
            >
              <div className="text-white flex items-center justify-center rounded-lg bg-[#3a3427] shrink-0 size-12">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24,24,0,0,0,32,64V192a24,24,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm0,128H56a8,8,0,0,1-8-8V86.63A23.84,23.84,0,0,0,56,88H216Zm-48-60a12,12,0,1,1,12,12A12,12,0,0,1,168,140Z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium">WalletConnect</p>
                <p className="text-[#bbb19b] text-sm">Connect with WalletConnect to access other wallets</p>
              </div>
            </button>

            <p className="text-[#bbb19b] text-sm pt-3 px-4 text-center">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          {/* Google fallback */}
          <div className="pt-4">
            <Button
              onClick={handleConnectWithGoogle}
              disabled={isConnecting}
              className="px-12 py-4 bg-white text-black font-bold text-lg font-['Space_Grotesk'] hover:bg-white/90 transition-all duration-200 border-2 border-white focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Connect with Google"
            >
              {isConnecting ? 'Connecting...' : 'Connect with Google'}
            </Button>
          </div>

          {/* Traditional */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-sm text-white/60 font-['Noto_Sans'] mb-4">Or use traditional authentication</p>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="px-8 py-3 bg-transparent text-white font-semibold font-['Space_Grotesk'] border-2 border-white hover:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
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
