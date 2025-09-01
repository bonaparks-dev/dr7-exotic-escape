import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentProcessRequest {
  bookingId: string;
  paymentToken: string;
  billingName: string;
  billingEmail: string;
  totalAmount: number;
  currency: string;
}

const generateMAC = async (params: string, macKey: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(params + macKey);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('nexi-payment-process function started');
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const requestBody = await req.json();
    console.log('Payment process request:', JSON.stringify(requestBody, null, 2));
    
    const { 
      bookingId, 
      paymentToken,
      billingName,
      billingEmail,
      totalAmount,
      currency
    }: PaymentProcessRequest = requestBody;

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get existing payment record
    const { data: payment, error: paymentError } = await supabaseService
      .from("payments")
      .select("*")
      .eq("booking_id", bookingId)
      .eq("payment_status", "initialized")
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment session not found or invalid");
    }

    // Get Nexi configuration
    const alias = Deno.env.get("NEXI_ALIAS")!;
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;
    
    const timeStamp = Date.now().toString();
    const amountCents = Math.round(totalAmount * 100);
    const transactionId = payment.nexi_transaction_id;

    // Build payment request to Nexi
    const nexiPaymentData = {
      alias,
      codTrans: transactionId,
      divisa: currency,
      importo: amountCents.toString(),
      timeStamp,
      token: paymentToken,
      billingName,
      billingEmail
    };

    // Build MAC for payment
    const macParams = `alias=${alias}codTrans=${transactionId}divisa=${currency}importo=${amountCents}timeStamp=${timeStamp}token=${paymentToken}`;
    const mac = await generateMAC(macParams, macKey);
    
    console.log('Nexi payment macParams:', macParams);

    // Make payment request to Nexi
    const nexiResponse = await fetch('https://ecommerce.nexi.it/ecomm/api/hostedpayments/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        ...nexiPaymentData,
        mac
      })
    });

    const nexiResult = await nexiResponse.text();
    console.log('Nexi payment response:', nexiResult);

    // Parse Nexi response (typically form-encoded)
    const params = new URLSearchParams(nexiResult);
    const esito = params.get('esito');
    const authCode = params.get('codAut');
    const errorCode = params.get('codiceEsito');
    const threeDSUrl = params.get('url3ds');

    // Update payment record
    const paymentStatus = esito === 'OK' ? 'completed' : 'failed';
    
    await supabaseService.from("payments").update({
      payment_status: paymentStatus,
      nexi_response_code: esito,
      nexi_auth_code: authCode,
      error_message: errorCode,
      three_ds_status: threeDSUrl ? 'required' : 'not_required',
      completed_at: paymentStatus === 'completed' ? new Date().toISOString() : null
    }).eq("id", payment.id);

    // Update booking
    await supabaseService.from("bookings").update({
      payment_status: paymentStatus,
      payment_completed_at: paymentStatus === 'completed' ? new Date().toISOString() : null,
      status: paymentStatus === 'completed' ? 'confirmed' : 'payment_failed'
    }).eq("id", bookingId);

    // Log payment audit
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: bookingId,
      payment_id: payment.id,
      action: "process",
      amount: amountCents,
      currency,
      gateway_response: { esito, authCode, errorCode, threeDSUrl }
    });

    console.log("Payment processed:", { 
      transactionId, 
      status: paymentStatus,
      requiresAuthentication: !!threeDSUrl
    });

    // Check if 3D Secure is required
    if (threeDSUrl) {
      return new Response(JSON.stringify({
        success: true,
        requiresAuthentication: true,
        authenticationUrl: threeDSUrl,
        transactionId
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Payment completed
    if (paymentStatus === 'completed') {
      return new Response(JSON.stringify({
        success: true,
        requiresAuthentication: false,
        paymentStatus: 'completed',
        transactionId,
        authCode
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      throw new Error(`Payment failed: ${errorCode || 'Unknown error'}`);
    }

  } catch (error: any) {
    console.error("Payment processing error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);