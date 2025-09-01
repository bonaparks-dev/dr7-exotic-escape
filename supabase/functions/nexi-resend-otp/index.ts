import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResendRequest {
  transactionId: string;
  orderId: string;
}

// Generate MAC for Nexi requests
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
    const { transactionId, orderId }: ResendRequest = await req.json();

    console.log('Processing OTP resend request:', { transactionId, orderId });

    // Validate input
    if (!transactionId || !orderId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters' 
      }), {
        status: 400,
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

    // Check if payment is still pending
    if (payment.payment_status !== 'pending') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Payment already processed' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare Nexi resend OTP request
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const params = [
      `alias=${nexiAlias}`,
      `codTrans=${transactionId}`,
      `timeStamp=${timestamp}`,
      `action=resend_otp`
    ].join('&');

    const mac = await generateMAC(params, nexiMacKey);
    const nexiParams = params + `&mac=${mac}`;

    console.log('Sending OTP resend request to Nexi:', { transactionId });

    // Send resend request to Nexi
    const nexiUrl = 'https://ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet';
    const nexiResponse = await fetch(nexiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: nexiParams,
    });

    const responseText = await nexiResponse.text();
    console.log('Nexi resend OTP response:', responseText);

    // Parse Nexi response
    const responseParams = new URLSearchParams(responseText);
    const esito = responseParams.get('esito');
    const codiceEsito = responseParams.get('codiceEsito');
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

    // Log audit trail
    const { error: auditError } = await supabase
      .from('payment_audit_logs')
      .insert({
        booking_id: payment.booking_id,
        payment_id: payment.id,
        action: 'otp_resend',
        amount: payment.amount,
        currency: payment.currency,
        gateway_response: {
          esito,
          codiceEsito,
          errorMessage,
          macVerified,
        },
      });

    if (auditError) {
      console.error('Error logging audit:', auditError);
    }

    if (isSuccess) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'OTP resent successfully',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'resend_failed',
        message: errorMessage || 'Failed to resend OTP',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error('Error in nexi-resend-otp function:', error);
    
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