import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const { transactionId, orderId, otpCode, retryCount } = await req.json();

    if (!transactionId || !orderId || !otpCode) {
      throw new Error("Missing required parameters");
    }

    // For demo purposes, we'll simulate OTP verification
    // In production, this would integrate with Nexi's 3DS verification API
    const isValidOtp = otpCode.length >= 6 && /^\d+$/.test(otpCode);
    
    if (!isValidOtp) {
      throw new Error("Invalid OTP format");
    }

    // Simulate different scenarios based on OTP value
    if (otpCode === "000000") {
      throw new Error("expired");
    } else if (otpCode === "111111") {
      throw new Error("invalid");
    } else if (!["123456", "654321", "888888"].includes(otpCode)) {
      throw new Error("invalid");
    }

    // Update payment status to completed
    const { data: payment, error: paymentError } = await supabaseService
      .from("payments")
      .update({
        payment_status: "completed",
        three_ds_status: "authenticated",
        completed_at: new Date().toISOString(),
        captured_amount: (await supabaseService
          .from("payments")
          .select("amount")
          .eq("nexi_transaction_id", transactionId)
          .single()).data?.amount || 0
      })
      .eq("nexi_transaction_id", transactionId)
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
        payment_status: "completed",
        status: "confirmed",
        payment_completed_at: new Date().toISOString()
      })
      .eq("nexi_transaction_id", transactionId);

    // Log audit trail
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: payment?.booking_id,
      payment_id: payment?.id,
      action: "verify",
      amount: payment?.amount || 0,
      currency: "EUR",
      gateway_response: {
        transactionId,
        otpCode: "***REDACTED***",
        retryCount,
        status: "verified"
      },
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip")
    });

    // Send confirmation email
    await supabaseService.functions.invoke('send-booking-confirmation', {
      body: {
        bookingId: payment?.booking_id,
        language: 'en' // Could be dynamic based on booking data
      }
    });

    console.log("Payment verified successfully:", {
      transactionId,
      paymentId: payment?.id,
      amount: payment?.amount
    });

    return new Response(JSON.stringify({
      success: true,
      paymentId: payment?.id,
      status: "completed"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);