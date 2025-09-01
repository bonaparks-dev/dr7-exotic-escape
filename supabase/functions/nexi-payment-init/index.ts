import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentInitRequest {
  bookingId: string;
  bookingDetails: any;
  lineItems: Array<{
    type: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  currency: string;
  language: string;
  payerEmail: string;
  payerName: string;
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
    console.log('nexi-payment-init function started');
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Handle both authenticated users and guests
    let user = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const requestBody = await req.json();
    console.log('Payment init request:', JSON.stringify(requestBody, null, 2));
    
    const { 
      bookingId, 
      bookingDetails, 
      lineItems, 
      totalAmount, 
      currency, 
      language,
      payerEmail,
      payerName 
    }: PaymentInitRequest = requestBody;

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Server-side total calculation validation
    const { data: calculatedTotal, error: calcError } = await supabaseService
      .rpc('calculate_booking_total', {
        base_price_cents: Math.round(parseFloat(bookingDetails.basePrice || '0') * 100),
        days: Math.ceil((new Date(bookingDetails.dropoffDate).getTime() - new Date(bookingDetails.pickupDate).getTime()) / (1000 * 60 * 60 * 24)),
        insurance_type: bookingDetails.insurance,
        extras: bookingDetails.extras
      });

    if (calcError) {
      console.error("Error calculating total:", calcError);
      throw new Error("Failed to calculate booking total");
    }

    const serverCalculatedTotal = calculatedTotal / 100;
    if (Math.abs(serverCalculatedTotal - totalAmount) > 1) {
      throw new Error(`Amount mismatch: client ${totalAmount}€, server ${serverCalculatedTotal}€`);
    }

    // Get Nexi configuration
    const alias = Deno.env.get("NEXI_ALIAS")!;
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;

    // Create unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const timeStamp = Date.now().toString();
    const amountCents = Math.round(totalAmount * 100);

    // Build parameters for MAC calculation for hosted fields initialization
    const macParams = `alias=${alias}timeStamp=${timeStamp}`;
    const mac = await generateMAC(macParams, macKey);

    console.log('Nexi init macParams:', macParams);

    // Create payment record in database
    await supabaseService.from("payments").insert({
      booking_id: bookingId,
      user_id: user?.id || null,
      amount: amountCents,
      currency,
      nexi_transaction_id: transactionId,
      payment_status: "initialized",
      line_items: lineItems,
      payer_email: payerEmail,
      payer_name: payerName
    });

    // Update booking status
    await supabaseService.from("bookings").update({
      payment_status: "initializing",
      payment_method: "nexi",
      nexi_transaction_id: transactionId
    }).eq("id", bookingId);

    console.log("Payment session initialized:", { 
      transactionId, 
      amount: amountCents, 
      currency,
      alias 
    });

    return new Response(JSON.stringify({
      success: true,
      transactionId,
      alias,
      timestamp: timeStamp,
      mac,
      amount: amountCents,
      currency,
      environment: "sandbox" // Change to "production" for live
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Payment initialization error:", error);
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