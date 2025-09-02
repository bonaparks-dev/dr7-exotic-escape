-- Update the configuration with the provided Place ID
UPDATE public.google_reviews_config 
SET place_id = 'ChIJo9UMY2k15xIRDCAm3s5imx8', 
    updated_at = now()
WHERE id = (SELECT id FROM public.google_reviews_config LIMIT 1);

-- If no configuration exists, insert it
INSERT INTO public.google_reviews_config (place_id, min_rating, max_reviews, auto_rotate_interval)
SELECT 'ChIJo9UMY2k15xIRDCAm3s5imx8', 4, 50, 5000
WHERE NOT EXISTS (SELECT 1 FROM public.google_reviews_config);