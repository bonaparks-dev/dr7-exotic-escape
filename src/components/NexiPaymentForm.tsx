import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NexiPaymentFormProps {
  bookingData: {
    bookingId: string;
    bookingDetails: any;
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
  };
  onPaymentInitiated?: () => void;
}

export const NexiPaymentForm: React.FC<NexiPaymentFormProps> = ({
  bookingData,
  onPaymentInitiated
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const { data, error } = await supabase.functions.invoke('nexi-payment', {
        body: {
          bookingId: bookingData.bookingId,
          bookingDetails: bookingData.bookingDetails,
          lineItems: bookingData.lineItems,
          totalAmount: bookingData.totalAmount,
          currency: bookingData.currency,
          language,
          payerEmail: bookingData.payerEmail,
          payerName: bookingData.payerName
        }
      });

      if (error) throw error;

      if (data.success) {
        // Create a form and submit it to Nexi
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.paymentUrl;
        form.target = '_blank';

        // Add all payment parameters as hidden inputs
        Object.entries(data.paymentParams).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        onPaymentInitiated?.();

        toast({
          title: t('paymentInitiated'),
          description: t('redirectedToNexi'),
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: t('paymentError'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl">
          {t('securePayment')}
        </CardTitle>
        <CardDescription>
          {t('paymentAmount')}: <span className="font-semibold text-lg">
            {bookingData.totalAmount.toFixed(2)} {bookingData.currency}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{t('secureTransaction')}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm">{t('sslEncrypted')}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t('pciCompliant')}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {language === 'it' 
                ? "Ti verrà addebitato l'intero importo ora." 
                : "You will be charged the full amount now."}
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{t('nexiPaymentDescription')}</p>
            <p>{t('cardTypesAccepted')}</p>
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-12 text-base"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('processing')}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              {t('payNow')}
            </>
          )}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          {t('nexiPowered')}
        </div>
      </CardContent>
    </Card>
  );
};