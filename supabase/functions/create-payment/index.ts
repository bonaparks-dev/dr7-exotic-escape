import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting payment creation process");
    
    const { bookingData } = await req.json();
    console.log("Received booking data:", bookingData);

    if (!bookingData) {
      throw new Error("Booking data is required");
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    console.log("Stripe initialized");

    // Create Supabase client using service role key for secure operations
    const supabaseServiceRole = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if user is authenticated (optional for guest payments)
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseServiceRole.auth.getUser(token);
      user = data.user;
      console.log("User authenticated:", user?.email);
    } else {
      console.log("Processing as guest payment");
    }

    // Determine customer email
    const customerEmail = user?.email || bookingData.guestInfo?.email || "guest@dr7rentals.com";
    console.log("Customer email:", customerEmail);

    // Check if Stripe customer exists
    const customers = await stripe.customers.list({ 
      email: customerEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer found:", customerId);
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: bookingData.guestInfo?.phone || "Guest Customer",
      });
      customerId = customer.id;
      console.log("New customer created:", customerId);
    }

    // Calculate line items based on booking data
    const lineItems = [];
    
    // Base rental price
    const basePrice = Math.round(bookingData.priceTotal || 0);
    if (basePrice > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${bookingData.vehicleName || 'Vehicle'} Rental`,
            description: `${bookingData.pickupLocation} - ${new Date(bookingData.pickupDate).toLocaleDateString()} to ${new Date(bookingData.dropoffDate).toLocaleDateString()}`,
          },
          unit_amount: basePrice,
        },
        quantity: 1,
      });
    }

    console.log("Line items created:", lineItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      payment_intent_data: {
        metadata: {
          booking_id: bookingData.bookingId || "",
          user_id: user?.id || "",
          customer_email: customerEmail,
        },
      },
      metadata: {
        booking_id: bookingData.bookingId || "",
        user_id: user?.id || "",
        customer_email: customerEmail,
      },
    });

    console.log("Stripe session created:", session.id);

    // Update booking with payment session info
    if (bookingData.bookingId) {
      await supabaseServiceRole
        .from("bookings")
        .update({
          payment_method: "stripe",
          payment_status: "pending",
          nexi_transaction_id: session.id, // Reusing this field for Stripe session ID
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingData.bookingId);
      
      console.log("Booking updated with payment session");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create payment session",
        success: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});