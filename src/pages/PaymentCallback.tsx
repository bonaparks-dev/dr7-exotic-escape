import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Nexi usually returns: esito, codTrans (transactionId), codiceEsito, mac, timeStamp, importo, divisa, numOrdine, ecc.
  const transactionId = searchParams.get('codTrans') || '';
  const errorCode = searchParams.get('codiceEsito') || '';
  const allParams = React.useMemo(
    () => Object.fromEntries(Array.from(searchParams.entries())),
    [searchParams]
  );

  // Poll payments.status written by server after MAC verification
  const pollPaymentUntilFinal = async ({
    txId,
    timeoutMs = 90000,
    intervalMs = 2000,
  }: {
    txId: string;
    timeoutMs?: number;
    intervalMs?: number;
  }) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const { data, error } = await supabase
        .from('payments')
        .select('status,captured_amount,currency,result_code,result_message')
        .eq('nexi_transaction_id', txId)
        .maybeSingle();

      if (!error) {
        const status = data?.status?.toUpperCase();
        if (status === 'PAID') return { ok: true, payment: data };
        if (status === 'PAYMENT_FAILED' || status === 'CANCELED' || status === 'DECLINED') {
          return { ok: false, payment: data };
        }
      }
      await new Promise(r => setTimeout(r, intervalMs));
    }
    return { ok: false, timeout: true as const };
  };

  React.useEffect(() => {
    // Sécurité: si pas d’identifiant de transaction → retour home
    if (!transactionId) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      try {
        // 1) Envoyer TOUS les paramètres à la function serveur
        //    Cette function doit: vérifier la MAC, faire correspondre l’ordre/payment,
        //    et écrire le statut final (ou en attente) dans `payments`.
        const { error } = await supabase.functions.invoke('nexi-callback', {
          body: { query: allParams },
        });
        if (error) {
          // Si la function échoue, on bascule vers échec (avec le code Nexi si dispo)
          navigate(`/payment-failure?codTrans=${encodeURIComponent(transactionId)}&codiceEsito=${encodeURIComponent(errorCode || 'CALLBACK_ERROR')}`, { replace: true });
          return;
        }

        // 2) Poll la DB jusqu’à obtenir l’état final écrit par le serveur (source de vérité)
        const result = await pollPaymentUntilFinal({ txId: transactionId });

        if (result.ok) {
          navigate(`/payment-success?codTrans=${encodeURIComponent(transactionId)}`, { replace: true });
        } else {
          const reason = (result as any).timeout ? 'timeout_or_pending' : (errorCode || 'DECLINED');
          navigate(`/payment-failure?codTrans=${encodeURIComponent(transactionId)}&codiceEsito=${encodeURIComponent(reason)}`, { replace: true });
        }
      } catch (e) {
        navigate(`/payment-failure?codTrans=${encodeURIComponent(transactionId)}&codiceEsito=${encodeURIComponent(errorCode || 'UNEXPECTED_ERROR')}`, { replace: true });
      }
    })();
  }, [allParams, errorCode, navigate, transactionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-xl">{t('processing') ?? 'Processing...'}</CardTitle>
          <CardDescription>
            {/* Texte neutre pendant la validation serveur */}
            {`Please wait while we securely confirm your payment with the bank...`}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Do not close this page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
