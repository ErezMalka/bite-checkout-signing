-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_drafts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Public can view active products
CREATE POLICY "Public can view active products" 
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all products (including inactive)
CREATE POLICY "Authenticated users can view all products" 
  ON public.products
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert products
CREATE POLICY "Authenticated users can insert products" 
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update products
CREATE POLICY "Authenticated users can update products" 
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete products
CREATE POLICY "Authenticated users can delete products" 
  ON public.products
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- PRODUCT IMAGES POLICIES
-- ============================================

-- Public can view all product images
CREATE POLICY "Public can view product images" 
  ON public.product_images
  FOR SELECT
  USING (true);

-- Authenticated users can insert images
CREATE POLICY "Authenticated users can insert images" 
  ON public.product_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update images
CREATE POLICY "Authenticated users can update images" 
  ON public.product_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete images
CREATE POLICY "Authenticated users can delete images" 
  ON public.product_images
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- PAYMENT PLANS POLICIES
-- ============================================

-- Public can view payment plans
CREATE POLICY "Public can view payment plans" 
  ON public.product_payment_plans
  FOR SELECT
  USING (true);

-- Authenticated users can manage payment plans
CREATE POLICY "Authenticated users can insert payment plans" 
  ON public.product_payment_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment plans" 
  ON public.product_payment_plans
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment plans" 
  ON public.product_payment_plans
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- ORDER DRAFTS POLICIES
-- ============================================

-- Anyone can create order drafts (for checkout)
CREATE POLICY "Anyone can create order drafts" 
  ON public.order_drafts
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own orders by ID (passed in session/URL)
CREATE POLICY "Users can view order drafts" 
  ON public.order_drafts
  FOR SELECT
  USING (true); -- In production, add more specific conditions

-- Authenticated users can update order status
CREATE POLICY "Authenticated users can update orders" 
  ON public.order_drafts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete orders
CREATE POLICY "Authenticated users can delete orders" 
  ON public.order_drafts
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions to anon role
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT ON public.product_payment_plans TO anon;
GRANT SELECT, INSERT ON public.order_drafts TO anon;

-- Grant permissions to authenticated role
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.product_images TO authenticated;
GRANT ALL ON public.product_payment_plans TO authenticated;
GRANT ALL ON public.order_drafts TO authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
