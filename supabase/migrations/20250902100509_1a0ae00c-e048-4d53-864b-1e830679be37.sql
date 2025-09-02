-- Create google_reviews_config table if not exists
CREATE TABLE IF NOT EXISTS public.google_reviews_config (
  id SERIAL PRIMARY KEY,
  place_id TEXT NOT NULL,
  min_rating INTEGER DEFAULT 4,
  max_reviews INTEGER DEFAULT 50,
  auto_rotate_interval INTEGER DEFAULT 5000,
  last_fetch TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create google_reviews_cache table if not exists
CREATE TABLE IF NOT EXISTS public.google_reviews_cache (
  id SERIAL PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_url TEXT,
  profile_photo_url TEXT,
  rating INTEGER NOT NULL,
  relative_time_description TEXT,
  text TEXT,
  time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.google_reviews_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_reviews_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (reviews should be publicly viewable)
CREATE POLICY "Allow public read access to google_reviews_config" 
ON public.google_reviews_config 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to google_reviews_cache" 
ON public.google_reviews_cache 
FOR SELECT 
USING (true);

-- Insert or update the configuration with the provided Place ID
INSERT INTO public.google_reviews_config (place_id, min_rating, max_reviews, auto_rotate_interval)
VALUES ('ChIJo9UMY2k15xIRDCAm3s5imx8', 4, 50, 5000)
ON CONFLICT (id) DO UPDATE SET
  place_id = EXCLUDED.place_id,
  updated_at = now();

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_google_reviews_config_updated_at
  BEFORE UPDATE ON public.google_reviews_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_google_reviews_cache_updated_at
  BEFORE UPDATE ON public.google_reviews_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();