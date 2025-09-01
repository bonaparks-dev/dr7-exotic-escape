import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
  language?: string;
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

    const { bookingId, language = "en" }: BookingConfirmationRequest = await req.json();

    // Fetch booking details with payment info
    const { data: booking, error } = await supabaseService
      .from("bookings")
      .select(`
        *,
        payments (
          nexi_transaction_id,
          amount,
          currency,
          payment_status,
          completed_at
        ),
        profiles (
          first_name,
          last_name
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      throw new Error("Booking not found");
    }

    const payment = booking.payments?.[0];
    if (!payment || payment.payment_status !== "completed") {
      throw new Error("Payment not completed");
    }

    // Get customer email from booking details
    const customerEmail = booking.booking_details?.customerInfo?.email;
    const customerName = booking.profiles?.first_name && booking.profiles?.last_name 
      ? `${booking.profiles.first_name} ${booking.profiles.last_name}`
      : booking.booking_details?.customerInfo?.name || "Valued Customer";

    if (!customerEmail) {
      throw new Error("Customer email not found");
    }

    // Format dates
    const pickupDate = new Date(booking.pickup_date).toLocaleDateString(
      language === "it" ? "it-IT" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
    const dropoffDate = new Date(booking.dropoff_date).toLocaleDateString(
      language === "it" ? "it-IT" : "en-US", 
      { year: "numeric", month: "long", day: "numeric" }
    );

    // Format amount
    const amount = new Intl.NumberFormat(language === "it" ? "it-IT" : "en-US", {
      style: "currency",
      currency: payment.currency || "EUR"
    }).format(payment.amount / 100);

    const isItalian = language === "it";

    const subject = isItalian 
      ? `Conferma Prenotazione DR7 - ${booking.vehicle_name}`
      : `DR7 Booking Confirmation - ${booking.vehicle_name}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .total { background: #1a1a2e; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DR7 LUXURY EMPIRE</h1>
            <h2>${isItalian ? "Conferma di Prenotazione" : "Booking Confirmation"}</h2>
          </div>
          
          <div class="content">
            <p>${isItalian ? `Caro/a ${customerName},` : `Dear ${customerName},`}</p>
            
            <p>${isItalian 
              ? "Grazie per aver scelto DR7 Luxury Empire! La tua prenotazione è stata confermata con successo."
              : "Thank you for choosing DR7 Luxury Empire! Your booking has been successfully confirmed."
            }</p>
            
            <div class="booking-details">
              <h3>${isItalian ? "Dettagli della Prenotazione" : "Booking Details"}</h3>
              
              <div class="detail-row">
                <span class="label">${isItalian ? "ID Prenotazione:" : "Booking ID:"}</span>
                <span class="value">${booking.id}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">${isItalian ? "Veicolo:" : "Vehicle:"}</span>
                <span class="value">${booking.vehicle_name}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">${isItalian ? "Data di Ritiro:" : "Pickup Date:"}</span>
                <span class="value">${pickupDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">${isItalian ? "Data di Riconsegna:" : "Dropoff Date:"}</span>
                <span class="value">${dropoffDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">${isItalian ? "Luogo di Ritiro:" : "Pickup Location:"}</span>
                <span class="value">${booking.pickup_location}</span>
              </div>
              
              ${booking.dropoff_location ? `
              <div class="detail-row">
                <span class="label">${isItalian ? "Luogo di Riconsegna:" : "Dropoff Location:"}</span>
                <span class="value">${booking.dropoff_location}</span>
              </div>
              ` : ''}
              
              <div class="detail-row">
                <span class="label">${isItalian ? "ID Transazione:" : "Transaction ID:"}</span>
                <span class="value">${payment.nexi_transaction_id}</span>
              </div>
            </div>
            
            <div class="total">
              <h3>${isItalian ? "Importo Pagato:" : "Amount Paid:"} ${amount}</h3>
            </div>
            
            <h3>${isItalian ? "Prossimi Passi:" : "Next Steps:"}</h3>
            <ul>
              <li>${isItalian 
                ? "Ti invieremo il contratto di noleggio entro 24 ore"
                : "We will send you the rental contract within 24 hours"
              }</li>
              <li>${isItalian 
                ? "Assicurati di avere la patente di guida valida e i documenti richiesti"
                : "Make sure you have a valid driver's license and required documents"
              }</li>
              <li>${isItalian 
                ? "Arriva 15 minuti prima dell'orario di ritiro programmato"
                : "Arrive 15 minutes before your scheduled pickup time"
              }</li>
            </ul>
            
            <p>${isItalian 
              ? "Se hai domande o hai bisogno di assistenza, non esitare a contattarci:"
              : "If you have any questions or need assistance, don't hesitate to contact us:"
            }</p>
            
            <p>
              <strong>Email:</strong> support@dr7luxuryempire.com<br>
              <strong>${isItalian ? "Telefono:" : "Phone"}:</strong> +39 XXX XXX XXXX
            </p>
          </div>
          
          <div class="footer">
            <p>${isItalian 
              ? "Grazie per aver scelto DR7 Luxury Empire"
              : "Thank you for choosing DR7 Luxury Empire"
            }</p>
            <p>&copy; 2025 DR7 Luxury Empire. ${isItalian ? "Tutti i diritti riservati." : "All rights reserved."}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "DR7 Luxury Empire <booking@dr7luxuryempire.com>",
      to: [customerEmail],
      subject: subject,
      html: html,
    });

    console.log("Confirmation email sent:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
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