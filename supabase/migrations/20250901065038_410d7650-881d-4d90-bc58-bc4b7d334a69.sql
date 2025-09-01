-- Allow public to upload driver licenses
CREATE POLICY "Public can upload driver licenses"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'driver-licenses');