-- Drop ALL policies that reference user_id across all tables
DROP POLICY IF EXISTS "Users can view own booking line items" ON public.booking_line_items;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Service can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service can update payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;

-- Now alter the column types
ALTER TABLE public.bookings ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.payments ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.transactions ALTER COLUMN user_id TYPE TEXT;

-- Recreate all policies
-- Bookings policies
CREATE POLICY "Users and guests can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Authenticated users creating their own bookings
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
  -- Anonymous users creating guest bookings
  (auth.uid() IS NULL AND user_id LIKE 'guest_%')
);

CREATE POLICY "Users and service can view bookings" 
ON public.bookings 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
  (auth.role() = 'service_role')
);

CREATE POLICY "Users and service can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
  (auth.role() = 'service_role')
);

-- Booking line items policies  
CREATE POLICY "Users can view own booking line items" 
ON public.booking_line_items 
FOR SELECT 
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE (auth.uid() IS NOT NULL AND user_id = auth.uid()::text) OR
          (auth.role() = 'service_role')
  )
);

-- Payments policies
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid()::text);

CREATE POLICY "Service can manage payments" 
ON public.payments 
FOR ALL 
USING (auth.role() = 'service_role');

-- Transactions policies
CREATE POLICY "Users can view own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid()::text);