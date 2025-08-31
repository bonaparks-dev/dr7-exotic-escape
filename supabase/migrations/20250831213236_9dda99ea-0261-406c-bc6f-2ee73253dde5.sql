-- Update RLS policies to allow guest bookings
-- Allow service/anonymous users to create bookings for guest users

-- Update the bookings insert policy to allow service role and guest bookings
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;

CREATE POLICY "Users and guests can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can create their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id::uuid) OR
  -- Service role can create any booking (for guest users)
  (auth.role() = 'service_role') OR
  -- Anonymous users can create guest bookings (user_id starts with 'guest_')
  (auth.uid() IS NULL AND user_id LIKE 'guest_%')
);

-- Update the bookings select policy to allow service and anonymous access for guest bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

CREATE POLICY "Users and service can view bookings" 
ON public.bookings 
FOR SELECT 
USING (
  -- Authenticated users can view their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id::uuid) OR
  -- Service role can view all bookings
  (auth.role() = 'service_role') OR
  -- Guest bookings are not viewable by default for security
  false
);

-- Update the bookings update policy
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

CREATE POLICY "Users and service can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  -- Authenticated users can update their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id::uuid) OR
  -- Service role can update any booking
  (auth.role() = 'service_role')
);

-- Update storage policies to allow guest uploads
CREATE POLICY "Guests can upload license files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'driver-licenses' AND
  (
    -- Authenticated users can upload to their own folder
    (auth.uid()::text = (storage.foldername(name))[1]) OR
    -- Anonymous users can upload to guest folders
    (auth.uid() IS NULL AND (storage.foldername(name))[1] LIKE 'guest_%')
  )
);

-- Update payment audit logs policy for guest bookings
DROP POLICY IF EXISTS "Service can manage audit logs" ON public.payment_audit_logs;

CREATE POLICY "Service can manage audit logs" 
ON public.payment_audit_logs 
FOR ALL 
USING (true);