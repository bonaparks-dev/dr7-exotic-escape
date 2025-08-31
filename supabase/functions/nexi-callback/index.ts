import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHash } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generateMAC = (params: string, macKey: string): string => {
  return createHash('sha1').update(params + macKey).digest('hex');
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
    const expectedMac = generateMAC(macParams, macKey);
    
    const macVerified = mac === expectedMac;
    console.log("MAC verification:", { 
      received: mac, 
      expected: expectedMac, 
      verified: macVerified 
    });

    // Determine payment status
    const isSuccess = esito === "OK" && codiceEsito === "0";
    const paymentStatus = isSuccess ? "completed" : "failed";
    
    // Update payment record
    const { data: paymentData, error: paymentError } = await supabaseService
      .from("payments")
      .update({
        payment_status: paymentStatus,
        nexi_response_code: codiceEsito,
        nexi_auth_code: codAut,
        mac_verification_status: macVerified ? "verified" : "failed",
        completed_at: new Date().toISOString(),
        error_message: isSuccess ? null : `Payment failed with code: ${codiceEsito}`
      })
      .eq("nexi_transaction_id", codTrans)
      .select()
      .single();

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      throw new Error("Failed to update payment record");
    }

    // Update booking status
    await supabaseService
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        payment_completed_at: isSuccess ? new Date().toISOString() : null,
        payment_error_message: isSuccess ? null : `Payment failed with code: ${codiceEsito}`
      })
      .eq("nexi_transaction_id", codTrans);

    console.log("Payment processed:", {
      transactionId: codTrans,
      status: paymentStatus,
      macVerified,
      amount: importo
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