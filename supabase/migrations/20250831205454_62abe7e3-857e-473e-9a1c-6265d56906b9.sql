-- Add payment configuration and refund tracking tables
CREATE TABLE IF NOT EXISTS public.payment_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enable_full_charge BOOLEAN NOT NULL DEFAULT TRUE,
  enable_security_deposit_preauth BOOLEAN NOT NULL DEFAULT FALSE,
  security_deposit_amount INTEGER DEFAULT 50000, -- Amount in cents
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default configuration
INSERT INTO public.payment_configurations (enable_full_charge, enable_security_deposit_preauth) 
VALUES (TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- Add refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  payment_id UUID,
  nexi_refund_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'EUR',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Enable RLS on refunds table
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- Create policies for refunds (admin only for now)
CREATE POLICY "Service can manage refunds"
ON public.refunds
FOR ALL
USING (true);

-- Add audit logs for payment actions
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  payment_id UUID,
  action TEXT NOT NULL, -- 'charge', 'refund', 'preauth', 'capture', 'void'
  amount INTEGER,
  currency TEXT DEFAULT 'EUR',
  gateway_response JSONB,
  admin_user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs (service only)
CREATE POLICY "Service can manage audit logs"
ON public.payment_audit_logs
FOR ALL
USING (true);

-- Add line items table for detailed payment breakdown
CREATE TABLE IF NOT EXISTS public.booking_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  item_type TEXT NOT NULL, -- 'base_rate', 'insurance', 'extra', 'tax', 'discount'
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL, -- Amount in cents
  total_price INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'EUR',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on line items
ALTER TABLE public.booking_line_items ENABLE ROW LEVEL SECURITY;

-- Create policies for line items
CREATE POLICY "Users can view own booking line items"
ON public.booking_line_items
FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM public.bookings WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Service can manage line items"
ON public.booking_line_items
FOR ALL
USING (true);

-- Update bookings table with additional payment fields
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_breakdown JSONB,
ADD COLUMN IF NOT EXISTS security_deposit_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS security_deposit_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS refund_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none';

-- Update payments table with additional fields
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS line_items JSONB,
ADD COLUMN IF NOT EXISTS payer_email TEXT,
ADD COLUMN IF NOT EXISTS payer_name TEXT,
ADD COLUMN IF NOT EXISTS captured_amount INTEGER,
ADD COLUMN IF NOT EXISTS gateway_fees INTEGER DEFAULT 0;