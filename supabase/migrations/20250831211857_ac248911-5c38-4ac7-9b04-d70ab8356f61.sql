-- Create table for Google reviews cache
CREATE TABLE public.google_reviews_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  text TEXT,
  relative_time TEXT,
  time BIGINT,
  profile_photo_url TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.google_reviews_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (reviews are public)
CREATE POLICY "Anyone can view reviews" 
ON public.google_reviews_cache 
FOR SELECT 
USING (true);

-- Service can manage reviews
CREATE POLICY "Service can manage reviews" 
ON public.google_reviews_cache 
FOR ALL 
USING (true);

-- Create index for performance
CREATE INDEX idx_google_reviews_rating ON public.google_reviews_cache(rating);
CREATE INDEX idx_google_reviews_time ON public.google_reviews_cache(time DESC);

-- Create function to update timestamps
CREATE TRIGGER update_google_reviews_cache_updated_at
BEFORE UPDATE ON public.google_reviews_cache
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for Google reviews configuration
CREATE TABLE public.google_reviews_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL,
  min_rating DECIMAL(2,1) DEFAULT 4.0,
  max_reviews INTEGER DEFAULT 12,
  auto_rotate_interval INTEGER DEFAULT 5000,
  last_fetch TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_reviews_config ENABLE ROW LEVEL SECURITY;

-- Public can read config
CREATE POLICY "Anyone can view config" 
ON public.google_reviews_config 
FOR SELECT 
USING (true);

-- Service can manage config
CREATE POLICY "Service can manage config" 
ON public.google_reviews_config 
FOR ALL 
USING (true);

-- Insert default config
INSERT INTO public.google_reviews_config (place_id, min_rating, max_reviews, auto_rotate_interval)
VALUES ('YOUR_PLACE_ID_HERE', 4.0, 12, 5000);

-- Update trigger for config
CREATE TRIGGER update_google_reviews_config_updated_at
BEFORE UPDATE ON public.google_reviews_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();