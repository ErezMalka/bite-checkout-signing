-- ============================================
-- Storage Bucket Configuration
-- ============================================

-- Note: Storage buckets must be created through Supabase Dashboard or CLI
-- This file documents the required storage configuration

-- Create bucket for product images (Run in Supabase Dashboard SQL Editor)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true, -- Public bucket for product images
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[];

-- ============================================
-- Storage Policies
-- ============================================

-- Allow public to view images
CREATE POLICY "Public can view product images in storage"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- ============================================
-- Helper Functions for Storage
-- ============================================

-- Function to get storage public URL
CREATE OR REPLACE FUNCTION get_storage_public_url(bucket TEXT, path TEXT)
RETURNS TEXT AS $$
DECLARE
  base_url TEXT;
BEGIN
  -- Get the base URL from environment or use default
  SELECT current_setting('app.settings.storage_url', true) INTO base_url;
  
  IF base_url IS NULL THEN
    -- Use Supabase project URL
    base_url := current_setting('app.settings.supabase_url', true);
    IF base_url IS NULL THEN
      -- Fallback to placeholder
      base_url := 'https://your-project.supabase.co';
    END IF;
  END IF;
  
  RETURN base_url || '/storage/v1/object/public/' || bucket || '/' || path;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to delete product images when product is deleted
CREATE OR REPLACE FUNCTION delete_product_images_from_storage()
RETURNS TRIGGER AS $$
DECLARE
  image_record RECORD;
BEGIN
  -- Loop through all images of the deleted product
  FOR image_record IN 
    SELECT path FROM public.product_images 
    WHERE product_id = OLD.id
  LOOP
    -- Delete from storage (this requires service role key in practice)
    -- In production, this would be handled by a background job or edge function
    PERFORM storage.delete_object('product-images', image_record.path);
  END LOOP;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger requires service role permissions
-- CREATE TRIGGER delete_product_images_on_product_delete
--   BEFORE DELETE ON public.products
--   FOR EACH ROW
--   EXECUTE FUNCTION delete_product_images_from_storage();

-- ============================================
-- Storage Utility Views
-- ============================================

-- View to get products with their primary image
CREATE OR REPLACE VIEW products_with_images AS
SELECT 
  p.*,
  pi.url as primary_image_url,
  pi.path as primary_image_path,
  COUNT(pi2.id) as total_images
FROM public.products p
LEFT JOIN public.product_images pi 
  ON p.id = pi.product_id AND pi.is_primary = true
LEFT JOIN public.product_images pi2 
  ON p.id = pi2.product_id
GROUP BY p.id, pi.url, pi.path;

-- Grant permissions on view
GRANT SELECT ON products_with_images TO anon, authenticated;
