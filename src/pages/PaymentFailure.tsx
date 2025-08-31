import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, Home, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const transactionId = searchParams.get('codTrans');
  const errorCode = searchParams.get('codiceEsito');
  const result = searchParams.get('esito');

  const getErrorMessage = (code: string | null) => {
    const errorMessages: { [key: string]: string } = {
      '1': t('cardDeclined'),
      '2': t('insufficientFunds'),
      '3': t('invalidCard'),
      '4': t('expiredCard'),
      '5': t('authenticationFailed'),
      '6': t('transactionTimeout'),
      '7': t('systemError'),
      '8': t('duplicateTransaction'),
      '9': t('securityViolation'),
      '10': t('cardNotSupported')
    };

    return errorMessages[code || ''] || t('unknownPaymentError');
  };

  const handleRetryPayment = () => {
    // Navigate back to the booking page or payment form
    navigate(-2); // Go back 2 steps to return to payment form
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-destructive/10 p-4 rounded-full">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl text-destructive mb-2">
              {t('paymentFailed')}
            </CardTitle>
            <CardDescription className="text-base">
              {t('paymentNotProcessed')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-destructive">
                {t('errorDetails')}
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('errorCode')}:</span>
                  <span className="ml-2 font-mono">{errorCode || 'N/A'}</span>
                </div>
                
                <div>
                  <span className="text-muted-foreground">{t('transactionId')}:</span>
                  <span className="ml-2 font-mono text-xs">{transactionId || 'N/A'}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-muted-foreground">{t('errorMessage')}:</span>
                  <p className="mt-1 text-destructive font-medium">
                    {getErrorMessage(errorCode)}
                  </p>
                </div>
              </div>
            </div>

            {/* Possible Solutions */}
            <div className="space-y-3">
              <h3 className="font-semibold">{t('possibleSolutions')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">•</span>
                  {t('checkCardDetails')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">•</span>
                  {t('checkCardBalance')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">•</span>
                  {t('tryDifferentCard')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">•</span>
                  {t('contactBank')}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleRetryPayment}
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('retryPayment')}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                {t('backToHome')}
              </Button>
            </div>

            {/* Support Section */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('needHelp')}</h3>
              </div>
              
              <div className="text-sm space-y-2">
                <p>{t('supportDescription')}</p>
                <div className="space-y-1">
                  <p className="font-medium">Email: support@dr7luxuryempire.com</p>
                  <p className="font-medium">Phone: +39 XXX XXX XXXX</p>
                  <p className="text-muted-foreground">
                    {t('includeTransactionId')}: {transactionId}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>{t('securityNotice')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};