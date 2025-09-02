-- Create table for Google Reviews configuration
CREATE TABLE IF NOT EXISTS public.google_reviews_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL DEFAULT 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  min_rating REAL NOT NULL DEFAULT 4.0,
  max_reviews INTEGER NOT NULL DEFAULT 12,
  auto_rotate_interval INTEGER NOT NULL DEFAULT 5000,
  last_fetch TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2000-01-01 00:00:00+00',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for cached Google Reviews
CREATE TABLE IF NOT EXISTS public.google_reviews_cache (
  review_id TEXT NOT NULL PRIMARY KEY,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  relative_time TEXT,
  time BIGINT NOT NULL,
  profile_photo_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default configuration if none exists
INSERT INTO public.google_reviews_config (place_id, min_rating, max_reviews, auto_rotate_interval)
SELECT 'ChIJN1t_tDeuEmsRUsoyG83frY4', 4.0, 12, 5000
WHERE NOT EXISTS (SELECT 1 FROM public.google_reviews_config);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_google_reviews_config_updated_at ON public.google_reviews_config;
CREATE TRIGGER update_google_reviews_config_updated_at
  BEFORE UPDATE ON public.google_reviews_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_google_reviews_cache_updated_at ON public.google_reviews_cache;
CREATE TRIGGER update_google_reviews_cache_updated_at
  BEFORE UPDATE ON public.google_reviews_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_google_reviews_cache_rating ON public.google_reviews_cache(rating);
CREATE INDEX IF NOT EXISTS idx_google_reviews_cache_time ON public.google_reviews_cache(time DESC);