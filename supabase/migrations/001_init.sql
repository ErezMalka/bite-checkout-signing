-- ============================================
-- Initial Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  base_price INTEGER NOT NULL CHECK (base_price >= 0), -- Price in agorot (cents)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Products catalog table';
COMMENT ON COLUMN public.products.base_price IS 'Price in agorot (1/100 of ILS)';
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit - unique product identifier';

-- ============================================
-- PRODUCT IMAGES TABLE
-- ============================================
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  path TEXT NOT NULL, -- Storage path in bucket
  url TEXT, -- Public URL for direct access
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.product_images IS 'Product images with support for galleries';
COMMENT ON COLUMN public.product_images.path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN public.product_images.is_primary IS 'Primary image shown in product cards';
COMMENT ON COLUMN public.product_images.sort_order IS 'Order for gallery display';

-- ============================================
-- PAYMENT PLANS TABLE
-- ============================================
CREATE TABLE public.product_payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  installments INTEGER NOT NULL CHECK (installments IN (1, 3, 6, 12)),
  surcharge_pct NUMERIC(5,3) NOT NULL DEFAULT 0.000 CHECK (surcharge_pct >= 0 AND surcharge_pct < 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, installments)
);

COMMENT ON TABLE public.product_payment_plans IS 'Custom payment plans per product';
COMMENT ON COLUMN public.product_payment_plans.surcharge_pct IS 'Surcharge percentage as decimal (0.080 = 8%)';
COMMENT ON COLUMN public.product_payment_plans.installments IS 'Number of monthly installments';

-- ============================================
-- ORDER DRAFTS TABLE
-- ============================================
CREATE TABLE public.order_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  currency TEXT NOT NULL DEFAULT 'ILS' CHECK (currency IN ('ILS', 'USD', 'EUR')),
  payload JSONB NOT NULL, -- Full order data including lines and calculations
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'signed', 'failed', 'cancelled')),
  sign_url TEXT, -- URL for digital signature
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.order_drafts IS 'Order drafts for digital signing';
COMMENT ON COLUMN public.order_drafts.payload IS 'Complete order data in JSON format';
COMMENT ON COLUMN public.order_drafts.sign_url IS 'External signing service URL';
COMMENT ON COLUMN public.order_drafts.status IS 'Order status in signing workflow';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Products indexes
CREATE INDEX idx_products_sku ON public.products(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_created ON public.products(created_at DESC);

-- Product images indexes
CREATE INDEX idx_product_images_product ON public.product_images(product_id);
CREATE INDEX idx_product_images_primary ON public.product_images(product_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_product_images_sort ON public.product_images(product_id, sort_order);

-- Payment plans indexes
CREATE INDEX idx_payment_plans_product ON public.product_payment_plans(product_id);
CREATE INDEX idx_payment_plans_installments ON public.product_payment_plans(product_id, installments);

-- Order drafts indexes
CREATE INDEX idx_order_drafts_status ON public.order_drafts(status);
CREATE INDEX idx_order_drafts_created ON public.order_drafts(created_at DESC);
CREATE INDEX idx_order_drafts_customer_email ON public.order_drafts(customer_email) WHERE customer_email IS NOT NULL;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON public.products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_drafts_updated_at 
  BEFORE UPDATE ON public.order_drafts
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to ensure only one primary image per product
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE public.product_images 
    SET is_primary = false 
    WHERE product_id = NEW.product_id 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_image_trigger
  BEFORE INSERT OR UPDATE ON public.product_images
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_image();

-- ============================================
-- SAMPLE DATA (Optional - Comment out in production)
-- ============================================

-- Insert sample products
-- INSERT INTO public.products (name, sku, description, base_price, is_active) VALUES
-- ('מוצר לדוגמה 1', 'SAMPLE-001', 'תיאור של מוצר לדוגמה', 9900, true),
-- ('מוצר לדוגמה 2', 'SAMPLE-002', 'תיאור נוסף למוצר', 19900, true),
-- ('מוצר לדוגמה 3', 'SAMPLE-003', 'מוצר נוסף עם מחיר גבוה', 49900, true);
