-- Allow anonymous and authenticated clients to upload driver licenses
CREATE POLICY IF NOT EXISTS "Public can upload driver licenses"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'driver-licenses');