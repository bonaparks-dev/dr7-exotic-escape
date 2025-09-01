-- Fix function search path security issues

-- Update existing functions to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name');
  
  INSERT INTO public.loyalty_points (user_id, points_balance, points_lifetime)
  VALUES (NEW.id, 0, 0);
  
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN 'DR7-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$function$;

CREATE OR REPLACE FUNCTION calculate_booking_total(
  base_price_cents INTEGER,
  days INTEGER,
  insurance_type TEXT,
  extras JSONB
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;