import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Clock, Shield } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OrderSummary {
  orderId: string;
  carName: string;
  pickupDate: string;
  dropoffDate: string;
  totalAmount: number; // in minor units (cents)
  currency: string;
  transactionId?: string;
  cardBrand?: string;
  cardLast4?: string;
}

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [retryCount, setRetryCount] = useState(0);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const maxRetries = 3;
  const transactionId = searchParams.get('transactionId');
  const orderId = searchParams.get('orderId');

  const translations = {
    en: {
      title: 'Secure Payment Verification',
      enterCode: 'Enter the verification code sent by your bank.',
      otpLabel: 'Verification Code',
      orderSummary: 'Order Summary',
      orderNumber: 'Order Number',
      vehicle: 'Vehicle',
      pickup: 'Pickup',
      dropoff: 'Dropoff',
      total: 'Total Amount',
      timeRemaining: 'Time Remaining',
      verify: 'Verify Payment',
      cancel: 'Cancel & Go Back',
      resendCode: 'Resend Code',
      processing: 'Processing verification...',
      expired: 'Verification code has expired',
      invalid: 'Invalid verification code',
      failed: 'Payment verification failed',
      maxRetries: 'Maximum retry attempts reached',
      networkError: 'Network error. Please try again.',
      cardInfo: 'Card ending in',
      successTitle: 'Success',
      successDesc: 'Payment verified successfully',
      pendingOrTimeout: 'Verification pending or timed out. Please check your bank app and try again.',
      missingInfo: 'Missing payment information',
      failedToLoad: 'Failed to load order details',
      orderNotFound: 'Order not found',
      goHome: 'Go Home',
    },
    it: {
      title: 'Verifica Pagamento Sicuro',
      enterCode: 'Inserisci il codice di verifica inviato dalla tua banca.',
      otpLabel: 'Codice di Verifica',
      orderSummary: 'Riepilogo Ordine',
      orderNumber: 'Numero Ordine',
      vehicle: 'Veicolo',
      pickup: 'Ritiro',
      dropoff: 'Consegna',
      total: 'Importo Totale',
      timeRemaining: 'Tempo Rimanente',
      verify: 'Verifica Pagamento',
      cancel: 'Annulla e Torna Indietro',
      resendCode: 'Reinvia Codice',
      processing: 'Elaborazione verifica...',
      expired: 'Il codice di verifica è scaduto',
      invalid: 'Codice di verifica non valido',
      failed: 'Verifica pagamento fallita',
      maxRetries: 'Raggiunto numero massimo di tentativi',
      networkError: 'Errore di rete. Riprova.',
      cardInfo: 'Carta che termina con',
      successTitle: 'Successo',
      successDesc: 'Pagamento verificato correttamente',
      pendingOrTimeout: 'Verifica in sospeso o scaduta. Controlla la tua app bancaria e riprova.',
      missingInfo: 'Informazioni di pagamento mancanti',
      failedToLoad: "Impossibile caricare i dettagli dell'ordine",
      orderNotFound: 'Ordine non trovato',
      goHome: 'Vai alla Home',
    }
  } as const;

  const t = translations[language as 'en' | 'it'];

  // -------- Helpers --------
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amountMinorUnits: number, currency: string) => {
    return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amountMinorUnits / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'it' ? 'it-IT' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  // Poll payment status in DB (server is source of truth)
  const pollPaymentUntilFinal = async ({
    txId,
    expectedTotalMinor,
    timeoutMs = 90000, // 90s
    intervalMs = 2000, // 2s
  }: {
    txId: string;
    expectedTotalMinor: number;
    timeoutMs?: number;
    intervalMs?: number;
  }) => {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('payment_status,captured_amount,currency,nexi_response_code,error_message')
        .eq('nexi_transaction_id', txId)
        .maybeSingle();

      if (error) {
        console.error('Polling error:', error);
        await new Promise((r) => setTimeout(r, intervalMs));
        continue;
      }

      const status = payment?.payment_status?.toUpperCase();

      if (status === 'PAID') {
        // Extra safety: verify captured amount equals expected total
        if (
          typeof payment.captured_amount === 'number' &&
          payment.captured_amount === expectedTotalMinor
        ) {
          return { ok: true, payment };
        } else {
          // Amount mismatch → treat as failure
          return { ok: false, payment, reason: 'amount_mismatch' as const };
        }
      }

      if (
        status === 'PAYMENT_FAILED' ||
        status === 'CANCELED' ||
        status === 'DECLINED'
      ) {
        return { ok: false, payment };
      }

      // Still pending
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    return { ok: false, timeout: true as const };
  };

  // -------- Effects --------
  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load order summary from DB
  useEffect(() => {
    const loadOrderSummary = async () => {
      if (!transactionId || !orderId) {
        toast({
          title: 'Error',
          description: t.missingInfo,
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select(
            `
            *,
            bookings (
              vehicle_name,
              pickup_date,
              dropoff_date,
              price_total,
              currency
            )
          `
          )
          .eq('nexi_transaction_id', transactionId)
          .maybeSingle();

        if (paymentError) throw paymentError;

        if (payment && payment.bookings) {
          const booking = payment.bookings;
          setOrderSummary({
            orderId,
            carName: booking.vehicle_name,
            pickupDate: booking.pickup_date,
            dropoffDate: booking.dropoff_date,
            totalAmount: booking.price_total,
            currency: booking.currency || 'EUR',
            transactionId,
            cardBrand: searchParams.get('cardBrand') || undefined,
            cardLast4: searchParams.get('cardLast4') || undefined,
          });
        } else {
          // No booking found for this tx
          toast({
            title: 'Error',
            description: t.orderNotFound,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading order summary:', error);
        toast({
          title: 'Error',
          description: t.failedToLoad,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId, orderId]);

  // -------- Handlers --------
  const handleVerification = async () => {
    if (!transactionId || !orderId) {
      toast({
        title: 'Error',
        description: t.missingInfo,
        variant: 'destructive',
      });
      return;
    }
    if (!otpValue || otpValue.length < 6) {
      toast({
        title: 'Error',
        description: t.invalid,
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);

    try {
      // 1) Relay the OTP to serverless function which talks to Nexi.
      // Do NOT trust the function's success as final truth.
      const { data, error } = await supabase.functions.invoke('nexi-verify', {
        body: {
          transactionId,
          orderId,
          otpCode: otpValue,
          retryCount,
        },
      });

      if (error) throw error;

      // 2) Poll DB until final status is written by Nexi callback (MAC-verified)
      const expectedTotal =
        orderSummary?.totalAmount ?? 0; // minor units (cents)

      const result = await pollPaymentUntilFinal({
        txId: transactionId,
        expectedTotalMinor: expectedTotal,
        timeoutMs: 90000,
        intervalMs: 2000,
      });

      if (result.ok) {
        toast({
          title: t.successTitle,
          description: t.successDesc,
        });
        navigate('/payment-success', {
          state: { transactionId, orderId },
        });
      } else {
        if ((result as any).timeout) {
          toast({
            title: 'Error',
            description: t.pendingOrTimeout,
            variant: 'destructive',
          });
          navigate('/payment-failure', {
            state: { reason: 'timeout_or_pending', transactionId, orderId },
          });
        } else if ((result as any).reason === 'amount_mismatch') {
          toast({
            title: 'Error',
            description: t.failed,
            variant: 'destructive',
          });
          navigate('/payment-failure', {
            state: { reason: 'amount_mismatch', transactionId, orderId },
          });
        } else {
          toast({
            title: 'Error',
            description: t.failed,
            variant: 'destructive',
          });
          setRetryCount((prev) => prev + 1);
        }
      }
    } catch (error: any) {
      console.error('Verification error:', error);

      if (error?.message?.toLowerCase().includes('expired')) {
        toast({
          title: 'Error',
          description: t.expired,
          variant: 'destructive',
        });
      } else if (error?.message?.toLowerCase().includes('invalid')) {
        toast({
          title: 'Error',
          description: t.invalid,
          variant: 'destructive',
        });
        setRetryCount((prev) => prev + 1);
      } else {
        toast({
          title: 'Error',
          description: t.networkError,
          variant: 'destructive',
        });
      }
    } finally {
      setOtpValue('');
      setIsVerifying(false);
    }
  };

  const handleTimeout = () => {
    toast({
      title: 'Error',
      description: t.expired,
      variant: 'destructive',
    });
    navigate('/payment-failure', {
      state: { reason: 'timeout', transactionId, orderId },
    });
  };

  const handleCancel = () => {
    navigate('/payment-failure', {
      state: { reason: 'cancelled', transactionId, orderId },
    });
  };

  const handleResendCode = async () => {
    try {
      setIsVerifying(true);
      const { error } = await supabase.functions.invoke('nexi-resend-otp', {
        body: { transactionId, orderId },
      });

      if (error) throw error;

      setTimeLeft(300); // Reset timer
      setRetryCount(0);
      toast({
        title: t.successTitle,
        description: language === 'it' ? 'Codice di verifica reinviato' : 'Verification code resent',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: t.networkError,
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // -------- UI --------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p>{t.orderNotFound}</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              {t.goHome}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
          <p className="text-muted-foreground">{t.enterCode}</p>
        </div>

        {/* Timer */}
        <Card className="mb-6">
          <CardContent className="flex items-center justify-center p-4">
            <Clock className="h-5 w-5 text-orange-500 mr-2" />
            <span className="font-medium">
              {t.timeRemaining}: {formatTime(timeLeft)}
            </span>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              {t.orderSummary}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.orderNumber}:</span>
              <span className="font-medium">{orderSummary.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.vehicle}:</span>
              <span className="font-medium">{orderSummary.carName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.pickup}:</span>
              <span className="font-medium">{formatDate(orderSummary.pickupDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.dropoff}:</span>
              <span className="font-medium">{formatDate(orderSummary.dropoffDate)}</span>
            </div>
            {orderSummary.cardLast4 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.cardInfo}:</span>
                <span className="font-medium">
                  {orderSummary.cardBrand} •••• {orderSummary.cardLast4}
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-3">
              <span>{t.total}:</span>
              <span>{formatCurrency(orderSummary.totalAmount, orderSummary.currency)}</span>
            </div>
          </CardContent>
        </Card>

        {/* OTP Input */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label htmlFor="otp" className="text-base font-medium">
                {t.otpLabel}
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  value={otpValue}
                  onChange={setOtpValue}
                  maxLength={8}
                  disabled={isVerifying || retryCount >= maxRetries}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              {retryCount > 0 && retryCount < maxRetries && (
                <p className="text-sm text-orange-600 text-center">
                  Attempt {retryCount + 1} of {maxRetries}
                </p>
              )}
              
              {retryCount >= maxRetries && (
                <p className="text-sm text-destructive text-center">
                  {t.maxRetries}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleVerification}
            disabled={isVerifying || !otpValue || otpValue.length < 6 || retryCount >= maxRetries}
            className="w-full"
            size="lg"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.processing}
              </>
            ) : (
              t.verify
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleResendCode}
              disabled={isVerifying || timeLeft > 240} // Allow resend after 1 minute
              variant="outline"
              className="flex-1"
            >
              {t.resendCode}
            </Button>
            
            <Button
              onClick={handleCancel}
              disabled={isVerifying}
              variant="outline"
              className="flex-1"
            >
              {t.cancel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
