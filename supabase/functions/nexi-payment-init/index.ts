import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentInitRequest {
  bookingId: string;
  lineItems: Array<{
    type: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  currency: string;
  payerEmail: string;
  payerName: string;
  bookingDetails: any;
  language?: string;
}

async function generateMAC(params: string, macKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(macKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(params));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const paymentRequest: PaymentInitRequest = await req.json();
    console.log('Payment init request:', paymentRequest);

    // Get Nexi configuration
    const nexiAlias = Deno.env.get('NEXI_ALIAS');
    const nexiMacKey = Deno.env.get('NEXI_MAC_KEY');

    if (!nexiAlias || !nexiMacKey) {
      throw new Error('Nexi configuration not found');
    }

    // Create unique transaction ID
    const transactionId = `dr7-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now().toString();

    // Insert payment record using existing table structure
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        nexi_transaction_id: transactionId,
        booking_id: paymentRequest.bookingId,
        amount: paymentRequest.totalAmount * 100,
        currency: paymentRequest.currency,
        payment_status: 'pending',
        payment_method: 'nexi',
        payer_email: paymentRequest.payerEmail,
        payer_name: paymentRequest.payerName
      });

    if (paymentError) {
      console.error('Payment insert error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    // Update booking with payment info
    const { error: bookingError } = await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: 'initializing',
        nexi_transaction_id: transactionId
      })
      .eq('id', paymentRequest.bookingId);

    if (bookingError) {
      console.error('Booking update error:', bookingError);
      throw new Error('Failed to update booking');
    }

    // Generate MAC for XPayBuild
    const macParams = `${nexiAlias}${timestamp}${transactionId}${paymentRequest.totalAmount * 100}${paymentRequest.currency}`;
    const mac = await generateMAC(macParams, nexiMacKey);

    console.log('Payment session created:', { transactionId, alias: nexiAlias, timestamp });

    return new Response(
      JSON.stringify({
        success: true,
        transactionId,
        alias: nexiAlias,
        timestamp,
        mac,
        amount: paymentRequest.totalAmount * 100,
        currency: paymentRequest.currency
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Payment init error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

Deno.serve(handler);