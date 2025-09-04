import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PaymentCanceled = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Payment Canceled',
      message: 'Your payment was canceled. No charges were made to your account.',
      description: 'You can return to complete your booking at any time.',
      tryAgain: 'Try Payment Again',
      backHome: 'Back to Home',
      needHelp: 'Need Help?',
      contactSupport: 'Contact our support team at info@dr7rentals.com or +39 123 456 7890',
    },
    it: {
      title: 'Pagamento Annullato',
      message: 'Il tuo pagamento è stato annullato. Nessun addebito è stato effettuato sul tuo account.',
      description: 'Puoi tornare a completare la tua prenotazione in qualsiasi momento.',
      tryAgain: 'Riprova Pagamento',
      backHome: 'Torna alla Home',
      needHelp: 'Hai Bisogno di Aiuto?',
      contactSupport: 'Contatta il nostro team di supporto a info@dr7rentals.com o +39 123 456 7890',
    },
  };

  const t = translations[language];

  const handleTryAgain = () => {
    navigate(-2); // Go back to the reservation form
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-lg font-medium">{t.message}</p>
            <p className="text-muted-foreground">{t.description}</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleTryAgain} 
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.tryAgain}
            </Button>
            
            <Button 
              onClick={handleBackHome} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {t.backHome}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">{t.needHelp}</h4>
            <p className="text-sm text-muted-foreground">
              {t.contactSupport}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceled;