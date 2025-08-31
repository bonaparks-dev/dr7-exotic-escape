-- Add payment status and details to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS nexi_transaction_id text,
ADD COLUMN IF NOT EXISTS payment_error_message text,
ADD COLUMN IF NOT EXISTS payment_completed_at timestamp with time zone;

-- Create payments table for detailed payment tracking
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  payment_method text NOT NULL DEFAULT 'nexi',
  nexi_transaction_id text,
  nexi_response_code text,
  nexi_auth_code text,
  mac_verification_status text,
  payment_status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);