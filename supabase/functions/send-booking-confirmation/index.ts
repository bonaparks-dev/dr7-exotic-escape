import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  paymentId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { bookingId, paymentId }: BookingConfirmationRequest = await req.json();

    // Get booking details with payment information
    const { data: booking, error: bookingError } = await supabaseService
      .from("bookings")
      .select(`
        *,
        booking_line_items (*)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    const { data: payment, error: paymentError } = await supabaseService
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }

    const bookingDetails = booking.booking_details;
    const customerName = `${bookingDetails.firstName} ${bookingDetails.lastName}`;
    const customerEmail = bookingDetails.email;

    // Format line items for email
    const lineItemsHtml = booking.booking_line_items
      .map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.description}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${(item.unit_price / 100).toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${(item.total_price / 100).toFixed(2)}</td>
        </tr>
      `)
      .join('');

    const emailContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Booking Confirmation</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing DR7 Luxury Car Rental</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px;">Booking Details</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Vehicle:</strong> ${booking.vehicle_name}</p>
            <p><strong>Pickup Date:</strong> ${new Date(booking.pickup_date).toLocaleDateString()}</p>
            <p><strong>Dropoff Date:</strong> ${new Date(booking.dropoff_date).toLocaleDateString()}</p>
            <p><strong>Pickup Location:</strong> ${booking.pickup_location}</p>
            <p><strong>Dropoff Location:</strong> ${booking.dropoff_location || booking.pickup_location}</p>
          </div>

          <h3 style="color: #1a1a1a; margin-top: 30px;">Customer Information</h3>
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${bookingDetails.phone}</p>
          </div>

          <h3 style="color: #1a1a1a; margin-top: 30px;">Billing Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Description</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Unit Price</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #1a1a1a; color: white;">
                <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">TOTAL PAID:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold;">€${(payment.captured_amount / 100).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <h3 style="color: #1a1a1a; margin-top: 30px;">Payment Information</h3>
          <div style="margin: 20px 0;">
            <p><strong>Payment Method:</strong> ${payment.payment_method.toUpperCase()}</p>
            <p><strong>Transaction ID:</strong> ${payment.nexi_transaction_id}</p>
            <p><strong>Payment Status:</strong> ${payment.payment_status.toUpperCase()}</p>
            <p><strong>Payment Date:</strong> ${new Date(payment.completed_at).toLocaleDateString()}</p>
          </div>

          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h4 style="color: #1a1a1a; margin-top: 0;">Important Information</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Please bring a valid driver's license and credit card for verification</li>
              <li>Arrive 15 minutes before your pickup time</li>
              <li>Contact us at +39 123 456 7890 for any changes or questions</li>
              <li>Cancellation policy applies as per terms and conditions</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">DR7 Luxury Car Rental</p>
            <p style="color: #666; margin: 5px 0;">Email: info@dr7luxury.com | Phone: +39 123 456 7890</p>
          </div>
        </div>
      </div>
    `;

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "DR7 Luxury <bookings@dr7luxury.com>",
      to: [customerEmail],
      subject: `Booking Confirmation - ${booking.vehicle_name} (${booking.id})`,
      html: emailContent,
    });

    console.log("Confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailSent: true,
      bookingId,
      paymentId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending booking confirmation:", error);
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