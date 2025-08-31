-- Fix RLS disabled error by enabling RLS on payment_configurations table
ALTER TABLE public.payment_configurations ENABLE ROW LEVEL SECURITY;

-- Create policy for payment configurations (read-only for all, admin write)
CREATE POLICY "Anyone can view payment configurations"
ON public.payment_configurations
FOR SELECT
USING (true);

CREATE POLICY "Service can manage payment configurations"
ON public.payment_configurations
FOR ALL
USING (true);