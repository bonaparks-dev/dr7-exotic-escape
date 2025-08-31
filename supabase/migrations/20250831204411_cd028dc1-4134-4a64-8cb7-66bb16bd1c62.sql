-- Create storage bucket for driver license photos
INSERT INTO storage.buckets (id, name, public) VALUES ('driver-licenses', 'driver-licenses', false);

-- Create RLS policies for driver license uploads
CREATE POLICY "Users can upload their own license photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'driver-licenses' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own license photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'driver-licenses' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own license photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'driver-licenses' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own license photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'driver-licenses' AND auth.uid()::text = (storage.foldername(name))[1]);