-- Create guest booking policy for authenticated and anonymous users
CREATE POLICY "Guests can create bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);