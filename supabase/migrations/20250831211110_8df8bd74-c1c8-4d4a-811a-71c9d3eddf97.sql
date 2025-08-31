-- Add license_issue_date field to bookings table if it doesn't exist
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS license_issue_date DATE;