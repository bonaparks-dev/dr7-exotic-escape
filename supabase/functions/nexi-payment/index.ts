import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  bookingId: string;
  bookingDetails: {
    vehicleName: string;
    pickupDate: string;
    dropoffDate: string;
    pickupLocation: string;
    dropoffLocation?: string;
    insurance: string;
    extras: {
      fullCleaning: boolean;
      secondDriver: boolean;
      under25: boolean;
      licenseUnder3: boolean;
      outOfHours: boolean;
    };
  };
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
    
    // Note: user can be null for guest bookings

    const { 
      bookingId, 
      bookingDetails, 
      lineItems, 
      totalAmount, 
      currency, 
      language,
      payerEmail,
      payerName 
    }: PaymentRequest = await req.json();

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Server-side total calculation using database function
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

    const serverCalculatedTotal = calculatedTotal / 100; // Convert back to euros
    if (Math.abs(serverCalculatedTotal - totalAmount) > 1) { // Allow 1 euro difference for rounding
      throw new Error(`Amount mismatch: client ${totalAmount}€, server ${serverCalculatedTotal}€`);
    }

    const codiceVendita = Deno.env.get("NEXI_CODICE_PUNTO_VENDITA")!;
    const alias = Deno.env.get("NEXI_ALIAS")!;
    const idTerminale = Deno.env.get("NEXI_ID_TERMINALE")!;
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;

    // Create unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    // Use validated total amount in cents
    const amountCents = Math.round(totalAmount * 100);
    
    const origin = req.headers.get("origin") || "https://d9a6e588-965c-400c-b618-673fe52d03c9.sandbox.lovable.dev";
    const urlBack = `${origin}/verify-payment?transactionId=${transactionId}&orderId=${bookingId}`;
    const urlPost = `${origin}/api/payment-callback`;

    // Build parameters for MAC calculation (according to Nexi documentation)
    const macParams = `codTrans=${transactionId}divisa=${currency}importo=${amountCents}`;
    const mac = await generateMAC(macParams, macKey);

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

    // Create payment record with detailed breakdown
    await supabaseService.from("payments").insert({
      booking_id: bookingId,
      user_id: user?.id || null, // Handle null for guest bookings
      amount: amountCents,
      currency,
      nexi_transaction_id: transactionId,
      payment_status: "pending",
      line_items: lineItems,
      payer_email: payerEmail,
      payer_name: payerName
    });

    // Create detailed line items
    for (const item of lineItems) {
      await supabaseService.from("booking_line_items").insert({
        booking_id: bookingId,
        item_type: item.type,
        description: item.description,
        quantity: item.quantity,
        unit_price: Math.round(item.unitPrice * 100),
        total_price: Math.round(item.totalPrice * 100),
        currency
      });
    }

    // Update booking with payment info and breakdown
    await supabaseService.from("bookings").update({
      payment_status: "pending",
      payment_method: "nexi",
      nexi_transaction_id: transactionId,
      payment_breakdown: {
        lineItems,
        totalAmount,
        currency,
        payerEmail,
        payerName
      }
    }).eq("id", bookingId);

    // Log payment audit
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: bookingId,
      action: "charge",
      amount: amountCents,
      currency,
      gateway_response: { transactionId, status: "initiated" },
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip")
    });

    console.log("Payment initiated:", { 
      transactionId, 
      amount: amountCents, 
      currency, 
      lineItemsCount: lineItems.length,
      payerEmail 
    });

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