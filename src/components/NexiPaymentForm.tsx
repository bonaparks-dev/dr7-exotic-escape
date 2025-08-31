import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NexiPaymentFormProps {
  bookingId: string;
  amount: number;
  currency: string;
  onPaymentInitiated?: () => void;
}

export const NexiPaymentForm: React.FC<NexiPaymentFormProps> = ({
  bookingId,
  amount,
  currency,
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
          bookingId,
          amount,
          currency,
          language
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
            {amount.toFixed(2)} {currency}
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

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{t('nexiPaymentDescription')}</p>
          <p>{t('cardTypesAccepted')}</p>
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