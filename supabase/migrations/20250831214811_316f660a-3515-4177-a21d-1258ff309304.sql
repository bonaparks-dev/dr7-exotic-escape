-- First drop all policies that depend on user_id column
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;

-- Drop policies on related tables
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Service can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service can update payments" ON public.payments;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;

-- Now we can safely alter the column types
ALTER TABLE public.bookings ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.payments ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.transactions ALTER COLUMN user_id TYPE TEXT;

-- Recreate policies for bookings
CREATE POLICY "Users and guests can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can create their own bookings
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
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

-- Recreate policies for payments
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND user_id = auth.uid()::text
);

CREATE POLICY "Service can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Recreate policies for transactions
CREATE POLICY "Users can view own transactions" 
ON public.transactions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND user_id = auth.uid()::text
);