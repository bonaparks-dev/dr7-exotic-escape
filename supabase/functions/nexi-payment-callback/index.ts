import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    console.log('nexi-payment-callback function started');
    
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse form data from Nexi callback
    const formData = await req.formData();
    const params: Record<string, string> = {};
    
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }

    console.log('Nexi callback params:', params);

    const {
      esito,
      codTrans,
      codAut,
      codiceEsito,
      mac: receivedMac,
      importo,
      divisa,
      timeStamp
    } = params;

    // Verify MAC
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;
    const macParams = `codTrans=${codTrans}esito=${esito}importo=${importo}divisa=${divisa}codAut=${codAut || ''}timeStamp=${timeStamp}`;
    const calculatedMac = await generateMAC(macParams, macKey);
    
    console.log('MAC verification:', {
      received: receivedMac,
      calculated: calculatedMac,
      match: receivedMac === calculatedMac
    });

    const macValid = receivedMac === calculatedMac;
    const paymentSuccessful = esito === 'OK';

    // Find payment record
    const { data: payment, error: paymentError } = await supabaseService
      .from("payments")
      .select("*")
      .eq("nexi_transaction_id", codTrans)
      .single();

    if (paymentError || !payment) {
      console.error("Payment not found:", paymentError);
      throw new Error("Payment record not found");
    }

    // Update payment status
    const updateData: any = {
      payment_status: paymentSuccessful ? 'completed' : 'failed',
      nexi_response_code: esito,
      nexi_auth_code: codAut || null,
      mac_verification_status: macValid ? 'valid' : 'invalid',
      completed_at: paymentSuccessful ? new Date().toISOString() : null,
      error_message: !paymentSuccessful ? codiceEsito : null
    };

    await supabaseService.from("payments").update(updateData).eq("id", payment.id);

    // Update booking status
    const bookingStatus = paymentSuccessful ? 'confirmed' : 'payment_failed';
    await supabaseService.from("bookings").update({
      payment_status: updateData.payment_status,
      payment_completed_at: updateData.completed_at,
      status: bookingStatus
    }).eq("id", payment.booking_id);

    // Log audit record
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: payment.booking_id,
      payment_id: payment.id,
      action: "callback",
      amount: parseInt(importo),
      currency: divisa,
      gateway_response: params
    });

    console.log("Payment callback processed:", {
      transactionId: codTrans,
      status: updateData.payment_status,
      macValid,
      paymentSuccessful
    });

    // Return appropriate response to Nexi
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("Payment callback error:", error);
    return new Response("ERROR", {
      status: 500,
      headers: { "Content-Type": "text/plain", ...corsHeaders }
    });
  }
};

serve(handler);