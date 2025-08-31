import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReservationRequest {
  carName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  days: number;
  depositOption: string;
  insurance: string;
  fullCleaning: boolean;
  secondDriver: boolean;
  under25: boolean;
  licenseUnder3: boolean;
  outOfHours: boolean;
  basePricePerDay: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      carName, firstName, lastName, email, phone, startDate, endDate,
      days, depositOption, insurance, fullCleaning, secondDriver,
      under25, licenseUnder3, outOfHours, basePricePerDay
    }: ReservationRequest = await req.json();

    const baseTotal = days * basePricePerDay;
    const additionalCosts = (
      (depositOption === "no-deposit" ? days * 40 : 0) +
      (insurance === "premium" ? days * 20 : insurance === "standard" ? days * 10 : 0) +
      (fullCleaning ? 30 : 0) +
      (secondDriver ? days * 10 : 0) +
      (under25 ? days * 10 : 0) +
      (licenseUnder3 ? days * 20 : 0) +
      (outOfHours ? 50 : 0)
    );
    const totalPrice = baseTotal + additionalCosts;

    const additionalOptions = [
      fullCleaning && "Full cleaning with nitrogen sanitization (€30)",
      secondDriver && `Second driver (€${days * 10})`,
      under25 && `Under 25 years old (€${days * 10})`,
      licenseUnder3 && `Driving license under 3 years (€${days * 20})`,
      outOfHours && "Out-of-hours pickup (€50)"
    ].filter(Boolean);

    const businessEmailResponse = await resend.emails.send({
      from: "DR7 Exotic <onboarding@resend.dev>",
      to: ["amministrazione@dr7luxuryempire.com"],
      subject: `New Reservation Request - ${carName} (€${totalPrice})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI'; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h1 style="color: #d4af37;">New Reservation Request</h1>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Vehicle:</strong> ${carName}</p>
          <p><strong>Start:</strong> ${startDate}</p>
          <p><strong>End:</strong> ${endDate} (${days} days)</p>
          <p><strong>Deposit:</strong> ${depositOption === "with-deposit" ? "With deposit" : "No deposit (+€40/day)"}</p>
          <p><strong>Insurance:</strong> ${insurance}</p>
          ${additionalOptions.length > 0 ? `<p><strong>Options:</strong><br>${additionalOptions.join("<br>")}</p>` : ""}
          <p><strong>Total Estimated Revenue:</strong> €${totalPrice}</p>
        </div>`
    });

    console.log("Email sent:", businessEmailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
