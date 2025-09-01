-- Fix RLS policies for bookings table to properly handle guest bookings
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Guests can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;

-- Create new policies that properly handle both authenticated users and guests
CREATE POLICY "Anyone can create bookings" ON public.bookings
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and user_id matches auth.uid()
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR 
  -- Allow if user is not authenticated and user_id is null (guest booking)
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Also update the select policy to allow guests to view their bookings
-- (though guests won't be able to see their bookings after the session ends)
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings" ON public.bookings
FOR SELECT 
USING (
  -- Authenticated users can see their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- For now, we'll need another way for guests to retrieve their bookings
  -- This could be done via a booking reference number or email
  (auth.uid() IS NULL AND user_id IS NULL)
);