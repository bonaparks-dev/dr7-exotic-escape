import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  transactionId: string;
  orderId: string;
  otpCode: string;
  retryCount: number;
}

// Generate MAC for Nexi verification
async function generateMAC(params: string, macKey: string): Promise<string> {
  const key = new TextEncoder().encode(macKey);
  const data = new TextEncoder().encode(params);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const { transactionId, orderId, otpCode, retryCount }: VerifyRequest = await req.json();

    console.log('Processing OTP verification:', { transactionId, orderId, retryCount });

    // Validate input
    if (!transactionId || !orderId || !otpCode) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check retry limit
    if (retryCount >= 3) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Maximum retry attempts exceeded' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Nexi credentials
    const nexiAlias = Deno.env.get('NEXI_ALIAS');
    const nexiIdTerminale = Deno.env.get('NEXI_ID_TERMINALE');
    const nexiMacKey = Deno.env.get('NEXI_MAC_KEY');

    if (!nexiAlias || !nexiIdTerminale || !nexiMacKey) {
      throw new Error('Nexi configuration missing');
    }

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('nexi_transaction_id', transactionId)
      .single();

    if (paymentError || !payment) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Payment not found' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare Nexi verification request
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const params = [
      `alias=${nexiAlias}`,
      `codTrans=${transactionId}`,
      `importo=${payment.amount}`,
      `divisa=${payment.currency}`,
      `timeStamp=${timestamp}`,
      `otp=${otpCode}`
    ].join('&');

    const mac = await generateMAC(params, nexiMacKey);
    const nexiParams = params + `&mac=${mac}`;

    console.log('Sending verification to Nexi:', { transactionId, amount: payment.amount });

    // Send verification to Nexi
    const nexiUrl = 'https://ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet';
    const nexiResponse = await fetch(nexiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: nexiParams,
    });

    const responseText = await nexiResponse.text();
    console.log('Nexi verification response:', responseText);

    // Parse Nexi response
    const responseParams = new URLSearchParams(responseText);
    const esito = responseParams.get('esito');
    const codiceEsito = responseParams.get('codiceEsito');
    const authCode = responseParams.get('codAut');
    const errorMessage = responseParams.get('messaggio');

    // Verify MAC in response
    const responseParamsWithoutMac = Array.from(responseParams.entries())
      .filter(([key]) => key !== 'mac')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    const expectedMac = await generateMAC(responseParamsWithoutMac, nexiMacKey);
    const receivedMac = responseParams.get('mac');
    const macVerified = expectedMac === receivedMac;

    console.log('MAC verification:', { macVerified, expected: expectedMac, received: receivedMac });

    // Determine success
    const isSuccess = esito === 'OK' && codiceEsito === '0';

    // Update payment record
    const updateData: any = {
      nexi_response_code: codiceEsito,
      mac_verification_status: macVerified ? 'verified' : 'failed',
      payment_status: isSuccess ? 'completed' : 'failed',
      error_message: errorMessage,
    };

    if (authCode) {
      updateData.nexi_auth_code = authCode;
    }

    if (isSuccess) {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
    }

    // Update booking status if payment successful
    if (isSuccess && payment.booking_id) {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          payment_completed_at: new Date().toISOString(),
          status: 'confirmed',
        })
        .eq('id', payment.booking_id);

      if (bookingError) {
        console.error('Error updating booking:', bookingError);
      }
    }

    // Log audit trail
    const { error: auditError } = await supabase
      .from('payment_audit_logs')
      .insert({
        booking_id: payment.booking_id,
        payment_id: payment.id,
        action: 'otp_verification',
        amount: payment.amount,
        currency: payment.currency,
        gateway_response: {
          esito,
          codiceEsito,
          authCode,
          errorMessage,
          macVerified,
          retryCount,
        },
      });

    if (auditError) {
      console.error('Error logging audit:', auditError);
    }

    if (isSuccess) {
      return new Response(JSON.stringify({ 
        success: true,
        transactionId,
        authCode,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      let errorType = 'verification_failed';
      if (codiceEsito === '9999') errorType = 'expired';
      if (codiceEsito === '1001') errorType = 'invalid_otp';

      return new Response(JSON.stringify({ 
        success: false,
        error: errorType,
        message: errorMessage,
        retryAllowed: retryCount < 2,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error('Error in nexi-verify function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error',
      message: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);