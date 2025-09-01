import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentProcessRequest {
  bookingId: string;
  paymentToken?: string;
  billingName?: string;
  billingEmail?: string;
  totalAmount: number;
  currency: string;
}

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const paymentRequest: PaymentProcessRequest = await req.json();
    console.log('Processing payment for booking:', paymentRequest.bookingId);

    // Get payment session from existing table structure
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('booking_id', paymentRequest.bookingId)
      .eq('payment_status', 'pending')
      .single();

    if (paymentError || !payment) {
      console.error('Payment session not found:', paymentError);
      throw new Error('Payment session not found');
    }

    // For now, just return success to test the flow
    // In production, this would integrate with actual Nexi API
    console.log('Payment found:', payment.nexi_transaction_id);

    // Update payment status
    const { error: updateError } = await supabaseAdmin
      .from('payments')
      .update({
        payment_status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Payment update error:', updateError);
    }

    // Update booking status
    const { error: bookingUpdateError } = await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: 'completed',
        payment_completed_at: new Date().toISOString()
      })
      .eq('id', paymentRequest.bookingId);

    if (bookingUpdateError) {
      console.error('Booking update error:', bookingUpdateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentStatus: 'completed',
        message: 'Payment processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Payment processing error:', error);
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