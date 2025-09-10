import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, language = 'en' }: WelcomeEmailRequest = await req.json();

    const isItalian = language === 'it';
    
    const subject = isItalian 
      ? "Benvenuto in DR7 Luxury Empire!" 
      : "Welcome to DR7 Luxury Empire!";

    const emailContent = isItalian ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://ahpmzjgkfxrrgxyirasa.supabase.co/storage/v1/object/public/avatars/logo.png" alt="DR7 Luxury Empire" style="max-width: 200px;">
        </div>
        
        <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Benvenuto, ${firstName}!</h1>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Grazie per esserti unito a DR7 Luxury Empire! Il tuo account è stato creato con successo.
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Ora puoi accedere a tutti i nostri servizi di lusso:
        </p>
        
        <ul style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          <li>Noleggio di auto di lusso</li>
          <li>Ville esclusive</li>
          <li>Yacht privati</li>
          <li>Elicotteri e jet privati</li>
          <li>Servizi di detailing premium</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://your-app.vercel.app'}" 
             style="background-color: #1a1a1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Inizia ad Esplorare
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 40px;">
          Se non hai creato questo account, puoi ignorare questa email.
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://ahpmzjgkfxrrgxyirasa.supabase.co/storage/v1/object/public/avatars/logo.png" alt="DR7 Luxury Empire" style="max-width: 200px;">
        </div>
        
        <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome, ${firstName}!</h1>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Thank you for joining DR7 Luxury Empire! Your account has been successfully created.
        </p>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          You now have access to all our luxury services:
        </p>
        
        <ul style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          <li>Luxury car rentals</li>
          <li>Exclusive villas</li>
          <li>Private yachts</li>
          <li>Helicopters and private jets</li>
          <li>Premium detailing services</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://your-app.vercel.app'}" 
             style="background-color: #1a1a1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Exploring
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 40px;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "DR7 Luxury Empire <noreply@resend.dev>",
      to: [email],
      subject: subject,
      html: emailContent,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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