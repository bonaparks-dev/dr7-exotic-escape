import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const result = searchParams.get('esito');
  const transactionId = searchParams.get('codTrans');
  const errorCode = searchParams.get('codiceEsito');

  // Check if payment was successful
  const isSuccess = result === 'OK' || result === '1';

  React.useEffect(() => {
    // Redirect to appropriate page based on result
    if (isSuccess) {
      navigate(`/payment-success?codTrans=${transactionId}&esito=${result}`, { replace: true });
    } else {
      navigate(`/payment-failure?codTrans=${transactionId}&esito=${result}&codiceEsito=${errorCode}`, { replace: true });
    }
  }, [isSuccess, transactionId, result, errorCode, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-xl">
            {t('processing')}
          </CardTitle>
          <CardDescription>
            {isSuccess 
              ? 'Redirecting to confirmation page...' 
              : 'Redirecting to error page...'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your payment result...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};