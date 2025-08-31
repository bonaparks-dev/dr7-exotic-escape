-- Add age_bucket and country_iso2 fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS age_bucket TEXT,
ADD COLUMN IF NOT EXISTS country_iso2 TEXT;