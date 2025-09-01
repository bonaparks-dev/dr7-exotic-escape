-- Ensure all required fields are present for complete payment flow

-- Add missing fields to bookings table if they don't exist
DO $$ 
BEGIN
  -- Add eligibility fields if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'license_file_url') THEN
    ALTER TABLE public.bookings ADD COLUMN license_file_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'google_event_id') THEN
    ALTER TABLE public.bookings ADD COLUMN google_event_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'terms_accepted') THEN
    ALTER TABLE public.bookings ADD COLUMN terms_accepted BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'date_of_birth') THEN
    ALTER TABLE public.bookings ADD COLUMN date_of_birth DATE;
  END IF;
END $$;

-- Add missing fields to payments table if they don't exist
DO $$ 
BEGIN
  -- Payment capture and 3DS fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'three_ds_status') THEN
    ALTER TABLE public.payments ADD COLUMN three_ds_status TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'risk_flags') THEN
    ALTER TABLE public.payments ADD COLUMN risk_flags JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'gateway_transaction_time') THEN
    ALTER TABLE public.payments ADD COLUMN gateway_transaction_time TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'refund_status') THEN
    ALTER TABLE public.payments ADD COLUMN refund_status TEXT DEFAULT 'none';
  END IF;
END $$;

-- Create dedicated refund_requests table for admin refund management
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  requested_amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  admin_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  nexi_refund_id TEXT,
  nexi_response JSONB,
  requested_by UUID REFERENCES auth.users(id),
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  currency TEXT NOT NULL DEFAULT 'EUR'
);

-- Enable RLS on refund_requests
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for refund_requests
CREATE POLICY "Service can manage refund requests" ON public.refund_requests
  FOR ALL USING (true);

-- Create payment_configurations table if it doesn't exist with additional fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_config') THEN
    CREATE TABLE public.payment_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      enable_full_charge BOOLEAN NOT NULL DEFAULT TRUE,
      enable_security_deposit_preauth BOOLEAN NOT NULL DEFAULT FALSE,
      security_deposit_amount INTEGER DEFAULT 50000, -- 500 EUR in cents
      max_retry_attempts INTEGER DEFAULT 3,
      verification_timeout_minutes INTEGER DEFAULT 5,
      nexi_environment TEXT DEFAULT 'sandbox', -- sandbox or production
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Insert default configuration
    INSERT INTO public.payment_config (enable_full_charge, enable_security_deposit_preauth) 
    VALUES (TRUE, FALSE);

    -- Enable RLS
    ALTER TABLE public.payment_config ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Anyone can view payment config" ON public.payment_config
      FOR SELECT USING (true);

    CREATE POLICY "Service can manage payment config" ON public.payment_config
      FOR ALL USING (true);
  END IF;
END $$;

-- Add timezone support and ensure Europe/Rome is set
DO $$
BEGIN
  -- Set timezone for all timestamp operations
  IF NOT EXISTS (SELECT 1 FROM pg_settings WHERE name = 'timezone' AND setting = 'Europe/Rome') THEN
    ALTER DATABASE postgres SET timezone TO 'Europe/Rome';
  END IF;
END $$;

-- Create function to calculate line item totals server-side
CREATE OR REPLACE FUNCTION calculate_booking_total(
  base_price_cents INTEGER,
  days INTEGER,
  insurance_type TEXT,
  extras JSONB
) RETURNS INTEGER AS $$
DECLARE
  total INTEGER := 0;
  insurance_daily_cost INTEGER := 0;
BEGIN
  -- Base price calculation
  total := base_price_cents * days;
  
  -- Insurance costs per day
  CASE insurance_type
    WHEN 'kasko' THEN insurance_daily_cost := 1500; -- 15 EUR
    WHEN 'kasko-black' THEN insurance_daily_cost := 2500; -- 25 EUR
    WHEN 'kasko-signature' THEN insurance_daily_cost := 3500; -- 35 EUR
    ELSE insurance_daily_cost := 0;
  END CASE;
  
  total := total + (insurance_daily_cost * days);
  
  -- Add extras (one-time costs)
  IF (extras->>'fullCleaning')::BOOLEAN THEN
    total := total + 3000; -- 30 EUR
  END IF;
  
  IF (extras->>'outOfHours')::BOOLEAN THEN
    total := total + 5000; -- 50 EUR
  END IF;
  
  -- Add daily extras
  IF (extras->>'secondDriver')::BOOLEAN THEN
    total := total + (1000 * days); -- 10 EUR per day
  END IF;
  
  IF (extras->>'under25')::BOOLEAN THEN
    total := total + (1000 * days); -- 10 EUR per day
  END IF;
  
  IF (extras->>'licenseUnder3')::BOOLEAN THEN
    total := total + (2000 * days); -- 20 EUR per day
  END IF;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;