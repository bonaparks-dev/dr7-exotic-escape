-- Fix the database to allow guest bookings
-- First, let's change the user_id column to TEXT to support guest identifiers

-- Update the bookings table to allow TEXT user_id for guest bookings
ALTER TABLE public.bookings ALTER COLUMN user_id TYPE TEXT;

-- Drop existing policies
DROP POLICY IF EXISTS "Users and guests can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users and service can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users and service can update bookings" ON public.bookings;

-- Create new policies that handle both UUID auth users and TEXT guest users
CREATE POLICY "Users and guests can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can create their own bookings (user_id matches auth.uid())
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
  -- Service role can create any booking
  (auth.role() = 'service_role') OR
  -- Anonymous users can create guest bookings (user_id starts with 'guest_')
  (auth.uid() IS NULL AND user_id LIKE 'guest_%')
);

CREATE POLICY "Users and service can view bookings" 
ON public.bookings 
FOR SELECT 
USING (
  -- Authenticated users can view their own bookings
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
  -- Service role can view all bookings
  (auth.role() = 'service_role')
);

CREATE POLICY "Users and service can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  -- Authenticated users can update their own bookings
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
  -- Service role can update any booking
  (auth.role() = 'service_role')
);

-- Update related tables to use TEXT for user_id consistency
ALTER TABLE public.payments ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.transactions ALTER COLUMN user_id TYPE TEXT;