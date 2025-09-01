-- Allow null values in user_id column for guest bookings
ALTER TABLE public.bookings 
ALTER COLUMN user_id DROP NOT NULL;

-- Add a check constraint to ensure data integrity
-- Either user_id is provided (authenticated user) OR guest info is in booking_details
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_user_or_guest_check 
CHECK (
  user_id IS NOT NULL 
  OR 
  (user_id IS NULL AND booking_details ? 'guestInfo')
);