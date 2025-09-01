import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RefundRequest {
  paymentId: string;
  bookingId: string;
  amount: number;
  reason: string;
  adminNotes?: string;
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

    // Authenticate admin user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) throw new Error("User not authenticated");

    const { paymentId, bookingId, amount, reason, adminNotes }: RefundRequest = await req.json();

    // Validate refund amount
    if (amount <= 0) {
      throw new Error("Refund amount must be greater than 0");
    }

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get payment details
    const { data: payment, error: paymentError } = await supabaseService
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }

    // Validate refund amount doesn't exceed captured amount
    const capturedAmount = payment.captured_amount || payment.amount;
    if (amount > capturedAmount) {
      throw new Error(`Refund amount (${amount}) cannot exceed captured amount (${capturedAmount})`);
    }

    // Check if payment is in a refundable state
    if (payment.payment_status !== "completed") {
      throw new Error("Payment must be completed to process refund");
    }

    // Get existing refunds to check total refunded amount
    const { data: existingRefunds } = await supabaseService
      .from("refund_requests")
      .select("requested_amount")
      .eq("payment_id", paymentId)
      .eq("status", "completed");

    const totalRefunded = existingRefunds?.reduce((sum, refund) => sum + refund.requested_amount, 0) || 0;
    const remainingRefundable = capturedAmount - totalRefunded;

    if (amount > remainingRefundable) {
      throw new Error(`Refund amount (${amount}) exceeds remaining refundable amount (${remainingRefundable})`);
    }

    // Create refund request record
    const refundId = `REF${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    const { data: refundRequest, error: refundInsertError } = await supabaseService
      .from("refund_requests")
      .insert({
        payment_id: paymentId,
        booking_id: bookingId,
        requested_amount: amount,
        reason,
        admin_notes: adminNotes,
        requested_by: user.id,
        status: "processing",
        nexi_refund_id: refundId
      })
      .select()
      .single();

    if (refundInsertError) {
      throw new Error("Failed to create refund request");
    }

    // Prepare Nexi refund request
    const codiceVendita = Deno.env.get("NEXI_CODICE_PUNTO_VENDITA")!;
    const alias = Deno.env.get("NEXI_ALIAS")!;
    const macKey = Deno.env.get("NEXI_MAC_KEY")!;

    const amountCents = Math.round(amount);
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Build parameters for MAC calculation
    const macParams = `alias=${alias}codTrans=${payment.nexi_transaction_id}importo=${amountCents}divisa=${payment.currency}timeStamp=${timestamp}`;
    const mac = await generateMAC(macParams, macKey);

    // Nexi refund parameters
    const nexiParams = new URLSearchParams({
      alias,
      codTrans: payment.nexi_transaction_id,
      importo: amountCents.toString(),
      divisa: payment.currency,
      timeStamp: timestamp,
      operazione: "refund",
      mac
    });

    console.log("Sending refund request to Nexi:", {
      transactionId: payment.nexi_transaction_id,
      amount: amountCents,
      refundId
    });

    // Send refund request to Nexi
    const nexiResponse = await fetch("https://ecommerce.nexi.it/ecomm/ecomm/DispatcherServlet", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: nexiParams.toString(),
    });

    const responseText = await nexiResponse.text();
    console.log("Nexi refund response:", responseText);

    // Parse Nexi response
    const responseParams = new URLSearchParams(responseText);
    const esito = responseParams.get("esito");
    const codiceEsito = responseParams.get("codiceEsito");
    const nexiRefundId = responseParams.get("refund_id") || refundId;
    const errorMessage = responseParams.get("messaggio");

    // Verify MAC in response
    const responseParamsWithoutMac = Array.from(responseParams.entries())
      .filter(([key]) => key !== 'mac')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('');
    
    const expectedMac = await generateMAC(responseParamsWithoutMac, macKey);
    const receivedMac = responseParams.get("mac");
    const macVerified = expectedMac === receivedMac;

    // Determine success
    const isSuccess = esito === "OK" && codiceEsito === "0";
    const refundStatus = isSuccess ? "completed" : "failed";

    // Update refund request
    await supabaseService
      .from("refund_requests")
      .update({
        status: refundStatus,
        nexi_refund_id: nexiRefundId,
        nexi_response: {
          esito,
          codiceEsito,
          errorMessage,
          macVerified,
          responseText
        },
        processed_by: user.id,
        processed_at: new Date().toISOString()
      })
      .eq("id", refundRequest.id);

    // Update payment record if successful
    if (isSuccess) {
      const newTotalRefunded = totalRefunded + amount;
      const newRefundStatus = newTotalRefunded >= capturedAmount ? "fully_refunded" : "partially_refunded";

      await supabaseService
        .from("payments")
        .update({
          refund_status: newRefundStatus
        })
        .eq("id", paymentId);

      // Update booking status if fully refunded
      if (newRefundStatus === "fully_refunded") {
        await supabaseService
          .from("bookings")
          .update({
            status: "refunded",
            refund_amount: newTotalRefunded,
            refund_status: "completed"
          })
          .eq("id", bookingId);
      } else {
        await supabaseService
          .from("bookings")
          .update({
            refund_amount: newTotalRefunded,
            refund_status: "partial"
          })
          .eq("id", bookingId);
      }
    }

    // Log audit trail
    await supabaseService.from("payment_audit_logs").insert({
      booking_id: bookingId,
      payment_id: paymentId,
      action: "refund",
      amount: amount,
      currency: payment.currency,
      gateway_response: {
        esito,
        codiceEsito,
        nexiRefundId,
        errorMessage,
        macVerified,
        refundRequestId: refundRequest.id
      },
      admin_user_id: user.id
    });

    console.log("Refund processed:", {
      refundId: nexiRefundId,
      status: refundStatus,
      amount,
      macVerified
    });

    if (isSuccess) {
      return new Response(JSON.stringify({
        success: true,
        refundId: nexiRefundId,
        amount,
        status: refundStatus,
        transactionId: payment.nexi_transaction_id
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: errorMessage || "Refund failed",
        refundId: nexiRefundId,
        nexiResponseCode: codiceEsito
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("Refund processing error:", error);
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