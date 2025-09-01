-- Update RLS policies for payments table to handle guest bookings
-- Drop and recreate the view policy
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;

CREATE POLICY "Users can view own payments" ON public.payments
FOR SELECT 
USING (
  -- Authenticated users can see their own payments
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- For guest payments, we'll handle this via a different mechanism later
  -- (like payment confirmation page with transaction ID)
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Update insert policy for service to handle guest payments
-- The existing policy should work, but let's verify it allows service role to insert
-- guest payments with null user_id