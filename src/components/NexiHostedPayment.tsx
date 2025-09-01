import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Shield, Lock, AlertCircle } from 'lucide-react';
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
  };
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
}

// Declare Nexi global types
declare global {
  interface Window {
    XPayBuild?: any;
    XPay?: any;
  }
}

export const NexiHostedPayment: React.FC<NexiHostedPaymentProps> = ({
  bookingData,
  onPaymentSuccess,
  onPaymentError
}) => {
  const { t, language } = useLanguage();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [cardValid, setCardValid] = useState(false);
  const [billingName, setBillingName] = useState(bookingData.payerName);
  const [billingEmail, setBillingEmail] = useState(bookingData.payerEmail);
  
  const hostedFieldsRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  const translations = {
    en: {
      paymentDetails: 'Payment Details',
      securePayment: 'Secure Payment with Nexi',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      billingName: 'Cardholder Name',
      billingEmail: 'Email Address',
      payNow: 'Pay Now',
      processing: 'Processing Payment...',
      orderSummary: 'Order Summary',
      total: 'Total',
      securityFeatures: 'Your payment is protected by:',
      ssl: 'SSL Encryption',
      pci: 'PCI DSS Compliant',
      secure3d: '3D Secure Authentication',
      cardRequired: 'Please enter valid card details',
      paymentFailed: 'Payment failed. Please try again.',
      initializingPayment: 'Initializing secure payment...'
    },
    it: {
      paymentDetails: 'Dettagli Pagamento',
      securePayment: 'Pagamento Sicuro con Nexi',
      cardNumber: 'Numero Carta',
      expiryDate: 'Scadenza',
      cvv: 'CVV',
      billingName: 'Nome Titolare',
      billingEmail: 'Indirizzo Email',
      payNow: 'Paga Ora',
      processing: 'Elaborazione Pagamento...',
      orderSummary: 'Riepilogo Ordine',
      total: 'Totale',
      securityFeatures: 'Il tuo pagamento è protetto da:',
      ssl: 'Crittografia SSL',
      pci: 'Conforme PCI DSS',
      secure3d: 'Autenticazione 3D Secure',
      cardRequired: 'Inserisci i dati della carta validi',
      paymentFailed: 'Pagamento fallito. Riprova.',
      initializingPayment: 'Inizializzazione pagamento sicuro...'
    }
  };

  const tr = translations[language as keyof typeof translations] || translations.en;

  // Load Nexi scripts
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const loadNexiScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://ecommerce.nexi.it/ecomm/XPayBuild/XPayBuild.js';
        script.onload = () => {
          scriptLoadedRef.current = true;
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadNexiScript()
      .then(() => initializePayment())
      .catch((error) => {
        console.error('Failed to load Nexi script:', error);
        onPaymentError('Failed to initialize payment system');
      });
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

      // Initialize Nexi hosted fields
      if (window.XPayBuild) {
        const xpayBuild = new window.XPayBuild();
        
        // Configure hosted fields
        hostedFieldsRef.current = xpayBuild.create({
          baseUrl: 'https://ecommerce.nexi.it',
          alias: data.alias,
          timestamp: data.timestamp,
          mac: data.mac,
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '1234 5678 9012 3456'
            },
            expiryDate: {
              selector: '#expiry-date',
              placeholder: 'MM/YY'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            }
          },
          style: {
            'font-family': 'inherit',
            'font-size': '14px',
            'color': 'hsl(var(--foreground))',
            'background-color': 'hsl(var(--background))',
            'border': '1px solid hsl(var(--border))',
            'border-radius': '6px',
            'padding': '8px 12px'
          },
          onFieldEvent: (event: any) => {
            console.log('Field event:', event);
            if (event.type === 'validation') {
              setCardValid(event.allFieldsValid);
            }
          }
        });

        await hostedFieldsRef.current.mount();
        setIsInitializing(false);
      } else {
        throw new Error('Nexi XPayBuild not available');
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      onPaymentError(error.message || 'Failed to initialize payment');
      setIsInitializing(false);
    }
  };

  const handlePayment = async () => {
    if (!cardValid || !hostedFieldsRef.current) {
      toast.error(tr.cardRequired);
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment token with hosted fields
      const tokenResult = await hostedFieldsRef.current.createToken({
        billingName,
        billingEmail
      });

      if (!tokenResult.success) {
        throw new Error(tokenResult.error || 'Failed to create payment token');
      }

      console.log('Payment token created:', tokenResult.token);

      // Process payment with token
      const { data, error } = await supabase.functions.invoke('nexi-payment-process', {
        body: {
          ...bookingData,
          paymentToken: tokenResult.token,
          billingName,
          billingEmail
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      console.log('Payment processed:', data);

      // Handle 3D Secure if required
      if (data.requiresAuthentication) {
        window.location.href = data.authenticationUrl;
        return;
      }

      // Payment successful
      onPaymentSuccess(data);

    } catch (error: any) {
      console.error('Payment processing error:', error);
      onPaymentError(error.message || tr.paymentFailed);
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
          {/* Hosted Card Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">{tr.cardNumber}</Label>
              <div id="card-number" className="mt-1 min-h-[40px] border rounded-md"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry-date">{tr.expiryDate}</Label>
                <div id="expiry-date" className="mt-1 min-h-[40px] border rounded-md"></div>
              </div>
              <div>
                <Label htmlFor="cvv">{tr.cvv}</Label>
                <div id="cvv" className="mt-1 min-h-[40px] border rounded-md"></div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="billing-name">{tr.billingName}</Label>
              <Input
                id="billing-name"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="billing-email">{tr.billingEmail}</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                required
              />
            </div>
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

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={!cardValid || isProcessing || !billingName || !billingEmail}
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