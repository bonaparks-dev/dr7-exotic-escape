-- Tighten SELECT policy to prevent public reads
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create a secure function to create bookings for unauthenticated users
CREATE OR REPLACE FUNCTION public.create_public_booking(b jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.bookings (
    user_id, vehicle_type, vehicle_name, vehicle_image_url,
    pickup_date, dropoff_date, pickup_location, price_total,
    booking_details, age_bucket, years_licensed_bucket,
    license_file_url, terms_accepted, country_iso2, currency,
    status, payment_status
  )
  VALUES (
    NULL,
    b->>'vehicle_type',
    b->>'vehicle_name',
    b->>'vehicle_image_url',
    (b->>'pickup_date')::timestamptz,
    (b->>'dropoff_date')::timestamptz,
    b->>'pickup_location',
    (b->>'price_total')::integer,
    b->'booking_details',
    b->>'age_bucket',
    b->>'years_licensed_bucket',
    b->>'license_file_url',
    (b->>'terms_accepted')::boolean,
    b->>'country_iso2',
    coalesce(b->>'currency', 'eur'),
    'pending',
    'pending'
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_public_booking(jsonb) TO anon, authenticated;