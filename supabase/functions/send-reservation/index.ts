import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationRequest {
  carName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { carName, firstName, lastName, email, phone, startDate, endDate }: ReservationRequest = await req.json();

    console.log("Processing reservation for:", { carName, email, firstName, lastName });

    // Email to the client
    const clientEmailResponse = await resend.emails.send({
      from: "DR7 Exotic <onboarding@resend.dev>",
      to: [email],
      subject: "Reservation Confirmation - DR7 Exotic",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; padding: 40px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #d4af37; font-size: 32px; margin: 0; font-weight: 300;">DR7 EXOTIC</h1>
            <p style="color: #888; margin: 8px 0 0 0;">Luxury Car Rental</p>
          </div>
          
          <h2 style="color: #d4af37; font-size: 24px; margin-bottom: 20px;">Reservation Confirmation</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Dear ${firstName} ${lastName},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Thank you for your reservation request. We have received your inquiry for the <strong style="color: #d4af37;">${carName}</strong>.
          </p>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
            <h3 style="color: #d4af37; margin: 0 0 15px 0; font-size: 18px;">Reservation Details</h3>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Vehicle:</strong> ${carName}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Start Date:</strong> ${startDate}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>End Date:</strong> ${endDate}</p>
            <p style="margin: 8px 0; font-size: 14px;"><strong>Contact:</strong> ${phone}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Our team will contact you within 24 hours to confirm availability and finalize your reservation.
          </p>
          
          <p style="font-size: 14px; color: #888; line-height: 1.6;">
            Best regards,<br>
            The DR7 Exotic Team<br>
            Sardinia, Italy
          </p>
        </div>
      `,
    });

    // Email to DR7 Exotic
    const businessEmailResponse = await resend.emails.send({
      from: "DR7 Exotic <onboarding@resend.dev>",
      to: ["info@dr7exotic.com"],
      subject: `New Reservation Request - ${carName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333; padding: 40px; border-radius: 8px;">
          <h1 style="color: #d4af37; font-size: 24px; margin-bottom: 20px;">New Reservation Request</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Customer Information</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Reservation Details</h3>
            <p style="margin: 8px 0;"><strong>Vehicle:</strong> ${carName}</p>
            <p style="margin: 8px 0;"><strong>Start Date:</strong> ${startDate}</p>
            <p style="margin: 8px 0;"><strong>End Date:</strong> ${endDate}</p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { clientEmailResponse, businessEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Reservation request sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reservation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);