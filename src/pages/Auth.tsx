import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import type { User, Session } from "@supabase/supabase-js";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to dashboard
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link.",
      });
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      toast({
        title: "OAuth sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-charcoal via-luxury-charcoal/95 to-luxury-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4 text-luxury-gold hover:text-luxury-gold/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('rentals.backto')}
          </Button>
          <img 
            src="/lovable-uploads/f625c9f3-98fc-4327-8e35-dea92f9b3761.png" 
            alt="DR7 Exotic Cars & Luxury" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-luxury-ivory">{t('auth.welcome')}</h1>
          <p className="text-luxury-ivory/70">{t('auth.subtitle')}</p>
        </div>

        <Card className="bg-luxury-charcoal/50 border-luxury-gold/20 backdrop-blur-sm">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-luxury-charcoal/80">
              <TabsTrigger value="signin" className="text-luxury-ivory data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-charcoal">
                {t('auth.signin')}
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-luxury-ivory data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-charcoal">
                {t('auth.signup')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <CardHeader>
                <CardTitle className="text-luxury-ivory">{t('auth.signin.title')}</CardTitle>
                <CardDescription className="text-luxury-ivory/70">
                  {t('auth.signin.desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm 
                  onSubmit={handleSignIn}
                  onForgotPassword={handleForgotPassword}
                  loading={loading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-luxury-ivory">{t('auth.signup.title')}</CardTitle>
                <CardDescription className="text-luxury-ivory/70">
                  {t('auth.signup.desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm 
                  onSubmit={handleSignUp}
                  loading={loading}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </CardContent>
            </TabsContent>
          </Tabs>

          <CardContent className="pt-0">
            <div className="space-y-4">
              <Separator className="bg-luxury-gold/20" />
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('auth.continuewithgoogle')}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2]"
                  onClick={() => handleOAuthSignIn('facebook')}
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t('auth.continuewithfacebook')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SignInForm = ({ onSubmit, onForgotPassword, loading, showPassword, setShowPassword }: {
  onSubmit: (email: string, password: string) => void;
  onForgotPassword: (email: string) => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(email, password);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email" className="text-luxury-ivory">{t('auth.email')}</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-luxury-charcoal/80 border-luxury-gold/30 text-luxury-ivory"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signin-password" className="text-luxury-ivory">{t('auth.password')}</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-luxury-charcoal/80 border-luxury-gold/30 text-luxury-ivory pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-luxury-ivory/70 hover:text-luxury-ivory"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          className="p-0 text-luxury-gold hover:text-luxury-gold/80"
          onClick={() => onForgotPassword(email)}
          disabled={!email || loading}
        >
          {t('auth.forgotpassword')}
        </Button>
      </div>

      <Button 
        type="submit" 
        variant="luxury"
        className="w-full"
        disabled={loading}
      >
        {loading ? t('auth.signingin') : t('auth.signin')}
      </Button>
    </form>
  );
};

const SignUpForm = ({ onSubmit, loading, showPassword, setShowPassword }: {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { t } = useLanguage();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(email, password);
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-luxury-ivory">{t('auth.email')}</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-luxury-charcoal/80 border-luxury-gold/30 text-luxury-ivory"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-luxury-ivory">{t('auth.password')}</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-luxury-charcoal/80 border-luxury-gold/30 text-luxury-ivory pr-10"
            required
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-luxury-ivory/70 hover:text-luxury-ivory"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-luxury-ivory/60">{t('auth.minchars')}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          className="border-luxury-gold/30 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
        />
        <Label htmlFor="terms" className="text-sm text-luxury-ivory/70">
          {t('auth.acceptterms')}{" "}
          <a href="#" className="text-luxury-gold hover:underline">
            {t('auth.termsofservice')}
          </a>{" "}
          {t('auth.and')}{" "}
          <a href="#" className="text-luxury-gold hover:underline">
            {t('auth.privacypolicy')}
          </a>
        </Label>
      </div>

      <Button 
        type="submit" 
        variant="luxury"
        className="w-full"
        disabled={loading || !acceptTerms}
      >
        {loading ? t('auth.creatingaccount') : t('auth.createaccount')}
      </Button>
    </form>
  );
};

export default Auth;