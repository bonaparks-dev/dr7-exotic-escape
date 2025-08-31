import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHash } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  language: string;
}

const generateMAC = (params: string, macKey: string): string => {
  return createHash('sha1').update(params + macKey).digest('hex');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) throw new Error("User not authenticated");

    const { bookingId, amount, currency, language }: PaymentRequest = await req.json();

    const codiceVendita = Deno.env.get("NEXI_CODICE_PUNTO_VENDITA")!;
    const alias = Deno.env.get("NEXI_ALIAS")!;
    const idTerminale = Deno.env.get("NEXI_ID_TERMINALE")!;
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;

    // Create unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate amount in cents (Nexi expects amount in smallest currency unit)
    const amountCents = Math.round(amount * 100);
    
    const origin = req.headers.get("origin") || "https://d9a6e588-965c-400c-b618-673fe52d03c9.sandbox.lovable.dev";
    const urlBack = `${origin}/payment-result`;
    const urlPost = `${origin}/api/payment-callback`;

    // Build parameters for MAC calculation (according to Nexi documentation)
    const macParams = `codTrans=${transactionId}divisa=${currency}importo=${amountCents}`;
    const mac = generateMAC(macParams, macKey);

    // Nexi payment form parameters
    const paymentParams = {
      alias,
      importo: amountCents.toString(),
      divisa: currency,
      codTrans: transactionId,
      url: urlBack,
      url_back: urlBack,
      url_post: urlPost,
      languageId: language === 'it' ? 'ITA' : 'ENG',
      mac
    };

    // Create payment record in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseService.from("payments").insert({
      booking_id: bookingId,
      user_id: user.id,
      amount: amountCents,
      currency,
      nexi_transaction_id: transactionId,
      payment_status: "pending"
    });

    // Update booking with payment info
    await supabaseService.from("bookings").update({
      payment_status: "pending",
      payment_method: "nexi",
      nexi_transaction_id: transactionId
    }).eq("id", bookingId);

    console.log("Payment initiated:", { transactionId, amount: amountCents, currency });

    return new Response(JSON.stringify({
      success: true,
      paymentUrl: "https://ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet",
      paymentParams,
      transactionId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Payment initiation error:", error);
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