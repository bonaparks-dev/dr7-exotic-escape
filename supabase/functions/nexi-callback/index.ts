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
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const formData = await req.formData();
    
    // Extract Nexi callback parameters
    const codTrans = formData.get("codTrans")?.toString();
    const esito = formData.get("esito")?.toString();
    const importo = formData.get("importo")?.toString();
    const divisa = formData.get("divisa")?.toString();
    const codAut = formData.get("codAut")?.toString();
    const mac = formData.get("mac")?.toString();
    const data = formData.get("data")?.toString();
    const orario = formData.get("orario")?.toString();
    const codiceEsito = formData.get("codiceEsito")?.toString();

    console.log("Nexi callback received:", {
      codTrans,
      esito,
      importo,
      divisa,
      codAut,
      codiceEsito,
      data,
      orario
    });

    if (!codTrans) {
      throw new Error("Missing transaction ID in callback");
    }

    // Verify MAC
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;
    const macParams = `codTrans=${codTrans}esito=${esito}importo=${importo}divisa=${divisa}codAut=${codAut}data=${data}orario=${orario}`;
    const expectedMac = await generateMAC(macParams, macKey);
    
    const macVerified = mac === expectedMac;
    console.log("MAC verification:", { 
      received: mac, 
      expected: expectedMac, 
      verified: macVerified 
    });

    // Determine payment status based on Nexi response codes
    const isSuccess = esito === "OK" && (codiceEsito === "0" || codiceEsito === "00");
    const paymentStatus = isSuccess ? "completed" : "failed";
    
    // Update payment record (make idempotent using upsert pattern)
    const { data: paymentData, error: paymentError } = await supabaseService
      .from("payments")
      .update({
        payment_status: paymentStatus,
        nexi_response_code: codiceEsito,
        nexi_auth_code: codAut,
        mac_verification_status: macVerified ? "verified" : "failed",
        completed_at: isSuccess ? new Date().toISOString() : null,
        captured_amount: isSuccess ? parseInt(importo || '0') : null,
        gateway_transaction_time: new Date().toISOString(),
        three_ds_status: isSuccess ? "authenticated" : "failed",
        error_message: isSuccess ? null : `Payment failed: ${codiceEsito}`
      })
      .eq("nexi_transaction_id", codTrans)
      .select()
      .single();

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      throw new Error("Failed to update payment record");
    }

    // Update booking status
    const bookingUpdateData: any = {
      payment_status: paymentStatus,
      payment_completed_at: isSuccess ? new Date().toISOString() : null,
      payment_error_message: isSuccess ? null : `Payment failed: ${codiceEsito}`
    };

    if (isSuccess) {
      bookingUpdateData.status = "confirmed";
    }

    await supabaseService
      .from("bookings")
      .update(bookingUpdateData)
      .eq("nexi_transaction_id", codTrans);

    // Log detailed audit trail
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: paymentData?.booking_id,
      payment_id: paymentData?.id,
      action: "callback",
      amount: parseInt(importo || '0'),
      currency: divisa || 'EUR',
      gateway_response: {
        esito,
        codiceEsito,
        codAut,
        data,
        orario,
        macVerified,
        responseType: "callback"
      },
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip")
    });

    console.log("Payment processed:", {
      transactionId: codTrans,
      status: paymentStatus,
      macVerified,
      amount: importo,
      authCode: codAut
    });

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Callback processing error:", error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain", ...corsHeaders },
    });
  }
};

serve(handler);