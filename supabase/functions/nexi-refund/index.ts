import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RefundRequest {
  bookingId: string;
  paymentId: string;
  amount: number; // Amount to refund in euros
  reason: string;
  adminUserId?: string;
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

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) throw new Error("User not authenticated");

    const { bookingId, paymentId, amount, reason, adminUserId }: RefundRequest = await req.json();

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get payment details
    const { data: payment, error: paymentError } = await supabaseService
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .eq("booking_id", bookingId)
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }

    if (payment.payment_status !== "completed") {
      throw new Error("Can only refund completed payments");
    }

    const amountCents = Math.round(amount * 100);
    if (amountCents > payment.captured_amount) {
      throw new Error("Refund amount cannot exceed captured amount");
    }

    // Create refund record
    const refundId = `REF${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    // For Nexi refunds, you would typically need to call their refund API
    // This is a simplified implementation
    const { data: refund, error: refundError } = await supabaseService
      .from("refunds")
      .insert({
        booking_id: bookingId,
        payment_id: paymentId,
        nexi_refund_id: refundId,
        amount: amountCents,
        currency: payment.currency,
        reason,
        status: "completed", // In real implementation, this would be "pending" until API call succeeds
        admin_notes: `Refund processed by admin: ${adminUserId || user.id}`,
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (refundError) {
      throw new Error("Failed to create refund record");
    }

    // Update booking refund status
    const currentRefundAmount = parseInt(payment.booking?.refund_amount || "0");
    const newRefundAmount = currentRefundAmount + amountCents;
    const isFullRefund = newRefundAmount >= payment.captured_amount;

    await supabaseService.from("bookings").update({
      refund_amount: newRefundAmount,
      refund_status: isFullRefund ? "fully_refunded" : "partially_refunded",
      status: isFullRefund ? "refunded" : "confirmed"
    }).eq("id", bookingId);

    // Log audit
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: bookingId,
      payment_id: paymentId,
      action: "refund",
      amount: amountCents,
      currency: payment.currency,
      gateway_response: { refundId, reason },
      admin_user_id: adminUserId,
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip")
    });

    console.log("Refund processed:", { 
      refundId, 
      bookingId, 
      amount: amountCents, 
      reason 
    });

    return new Response(JSON.stringify({
      success: true,
      refundId,
      amount: amountCents,
      status: "completed"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Refund error:", error);
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