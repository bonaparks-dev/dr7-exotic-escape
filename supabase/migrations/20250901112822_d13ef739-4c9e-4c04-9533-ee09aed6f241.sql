-- Update bookings table to make dob and license_issue_date nullable and add new required fields
ALTER TABLE public.bookings 
ALTER COLUMN date_of_birth DROP NOT NULL,
ALTER COLUMN license_issue_date DROP NOT NULL;

-- Add the new required fields for age and years licensed buckets
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS age_bucket TEXT,
ADD COLUMN IF NOT EXISTS years_licensed_bucket TEXT;