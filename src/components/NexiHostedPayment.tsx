import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NexiHostedPaymentProps {
  bookingData: {
    bookingId: string;
    lineItems: Array<{
      type: string;
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    totalAmount: number;
    currency: string;
    payerEmail: string;
    payerName: string;
    bookingDetails: any;
    language?: string;
  };
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
}

export const NexiHostedPayment: React.FC<NexiHostedPaymentProps> = ({
  bookingData,
  onPaymentSuccess,
  onPaymentError
}) => {
  const { language } = useLanguage();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState(bookingData.payerName);
  const [billingEmail, setBillingEmail] = useState(bookingData.payerEmail);

  const translations = {
    en: {
      paymentDetails: 'Payment Details',
      securePayment: 'Secure Payment with Nexi',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date (MM/YY)',
      cvv: 'CVV',
      cardholderName: 'Cardholder Name',
      billingEmail: 'Email Address',
      payNow: 'Pay Now',
      processing: 'Processing Payment...',
      orderSummary: 'Order Summary',
      total: 'Total',
      securityFeatures: 'Your payment is protected by:',
      ssl: 'SSL Encryption',
      pci: 'PCI DSS Compliant',
      secure3d: '3D Secure Authentication',
      paymentFailed: 'Payment failed. Please try again.',
      initializingPayment: 'Initializing secure payment...',
      invalidCard: 'Please enter valid card details',
      testCards: 'Test Cards',
      testCardNote: 'Use test card: 4242 4242 4242 4242, Expiry: 12/34, CVV: 123'
    },
    it: {
      paymentDetails: 'Dettagli Pagamento',
      securePayment: 'Pagamento Sicuro con Nexi',
      cardNumber: 'Numero Carta',
      expiryDate: 'Scadenza (MM/AA)',
      cvv: 'CVV',
      cardholderName: 'Nome Titolare',
      billingEmail: 'Indirizzo Email',
      payNow: 'Paga Ora',
      processing: 'Elaborazione Pagamento...',
      orderSummary: 'Riepilogo Ordine',
      total: 'Totale',
      securityFeatures: 'Il tuo pagamento è protetto da:',
      ssl: 'Crittografia SSL',
      pci: 'Conforme PCI DSS',
      secure3d: 'Autenticazione 3D Secure',
      paymentFailed: 'Pagamento fallito. Riprova.',
      initializingPayment: 'Inizializzazione pagamento sicuro...',
      invalidCard: 'Inserisci i dati della carta validi',
      testCards: 'Carte di Test',
      testCardNote: 'Usa carta di test: 4242 4242 4242 4242, Scadenza: 12/34, CVV: 123'
    }
  };

  const tr = translations[language as keyof typeof translations] || translations.en;

  // Initialize payment
  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      console.log('Initializing Nexi payment session...');
      
      const { data, error } = await supabase.functions.invoke('nexi-payment-init', {
        body: bookingData
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      console.log('Payment session initialized:', data);
      setPaymentSession(data);
      setIsInitializing(false);
      
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      onPaymentError(error.message || 'Failed to initialize payment');
      setIsInitializing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  // Validate card form
  const isCardFormValid = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    return (
      cleanCardNumber.length >= 13 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName.trim().length > 0 &&
      billingEmail.includes('@')
    );
  };

  const handleCardPayment = async () => {
    if (!isCardFormValid()) {
      toast.error(tr.invalidCard);
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('nexi-payment-process', {
        body: {
          bookingId: bookingData.bookingId,
          totalAmount: bookingData.totalAmount,
          currency: bookingData.currency,
          cardDetails: {
            number: cardNumber.replace(/\s/g, ''),
            expiryDate,
            cvv,
            cardholderName,
            billingEmail
          }
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Payment failed');

      console.log('Payment processed successfully:', data);
      toast.success(language === 'it' ? 'Pagamento completato!' : 'Payment completed!');
      onPaymentSuccess(data);

    } catch (error: any) {
      console.error('Card payment error:', error);
      toast.error(error.message || tr.paymentFailed);
      onPaymentError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const openSecurePage = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase.functions.invoke('nexi-payment', {
        body: {
          bookingId: bookingData.bookingId,
          bookingDetails: bookingData.bookingDetails,
          lineItems: bookingData.lineItems,
          totalAmount: bookingData.totalAmount,
          currency: bookingData.currency,
          language: bookingData.language || (language === 'it' ? 'it' : 'en'),
          payerEmail: bookingData.payerEmail,
          payerName: bookingData.payerName
        }
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to start payment');
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;
      Object.entries(data.paymentParams).forEach(([key, value]: any) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (e: any) {
      console.error('Fallback HPP error:', e);
      onPaymentError(e.message || 'Payment initialization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isInitializing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle>{tr.initializingPayment}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {tr.paymentDetails}
          </CardTitle>
          <CardDescription>{tr.securePayment}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Card Input Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">{tr.cardNumber}</Label>
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry-date">{tr.expiryDate}</Label>
                <Input
                  id="expiry-date"
                  placeholder="12/34"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">{tr.cvv}</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardholder-name">{tr.cardholderName}</Label>
              <Input
                id="cardholder-name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="billing-email">{tr.billingEmail}</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Test Card Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">{tr.testCards}</p>
            <p className="text-xs text-muted-foreground">{tr.testCardNote}</p>
          </div>

          <Separator />

          {/* Security Features */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{tr.securityFeatures}</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {tr.ssl}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {tr.pci}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                {tr.secure3d}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Pay Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCardPayment}
              disabled={!isCardFormValid() || isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {tr.processing}
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {tr.payNow} - €{bookingData.totalAmount.toFixed(2)}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={openSecurePage}
              disabled={isProcessing}
              className="w-full"
            >
              {language === 'it' ? 'Apri pagina Nexi' : 'Open Nexi secure page'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{tr.orderSummary}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {bookingData.lineItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × €{item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="font-medium">€{item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
          
          <Separator />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span>{tr.total}</span>
            <span>€{bookingData.totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};