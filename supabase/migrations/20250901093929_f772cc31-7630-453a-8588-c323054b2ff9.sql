-- Allow null user_id in payments table for guest bookings
ALTER TABLE public.payments 
ALTER COLUMN user_id DROP NOT NULL;

-- Add check constraint to ensure data integrity for payments
ALTER TABLE public.payments 
ADD CONSTRAINT payments_user_or_guest_check 
CHECK (
  user_id IS NOT NULL 
  OR 
  (user_id IS NULL AND payer_email IS NOT NULL)
);