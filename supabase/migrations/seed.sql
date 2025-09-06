-- ============================================
-- Seed Data for Development
-- ============================================
-- Run this file to populate the database with sample data
-- DO NOT run in production!

-- Clear existing data (careful!)
TRUNCATE TABLE public.order_drafts CASCADE;
TRUNCATE TABLE public.product_payment_plans CASCADE;
TRUNCATE TABLE public.product_images CASCADE;
TRUNCATE TABLE public.products CASCADE;

-- ============================================
-- Insert Sample Products
-- ============================================

INSERT INTO public.products (id, name, sku, description, base_price, is_active) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'מחשב נייד Dell XPS 13', 'LAPTOP-001', 'מחשב נייד קל ומהיר עם מסך 13.3 אינץ', 599900, true),
  ('b2c3d4e5-f678-90ab-cdef-123456789012', 'אוזניות Sony WH-1000XM4', 'AUDIO-001', 'אוזניות אלחוטיות עם ביטול רעשים אקטיבי', 129900, true),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'טלפון iPhone 15 Pro', 'PHONE-001', 'טלפון חכם מתקדם עם מצלמה משולשת', 549900, true),
  ('d4e5f678-90ab-cdef-1234-567890123456', 'שעון חכם Apple Watch', 'WATCH-001', 'שעון חכם עם מעקב כושר ובריאות', 179900, true),
  ('e5f67890-abcd-ef12-3456-789012345678', 'טאבלט iPad Air', 'TABLET-001', 'טאבלט 10.9 אינץ עם Apple Pencil', 249900, true),
  ('f6789012-cdef-1234-5678-901234567890', 'מצלמה Canon EOS R6', 'CAMERA-001', 'מצלמה מקצועית Full Frame', 899900, true),
  ('67890123-def1-2345-6789-012345678901', 'מקלדת מכנית Keychron K2', 'KEYBOARD-001', 'מקלדת מכנית אלחוטית עם תאורת RGB', 39900, true),
  ('78901234-ef12-3456-7890-123456789012', 'עכבר גיימינג Logitech G Pro', 'MOUSE-001', 'עכבר גיימינג אלחוטי מקצועי', 49900, true),
  ('89012345-f123-4567-8901-234567890123', 'מסך LG UltraWide 34"', 'MONITOR-001', 'מסך רחב 34 אינץ ברזולוציית 4K', 199900, true),
  ('90123456-1234-5678-9012-345678901234', 'רמקול JBL Flip 6', 'SPEAKER-001', 'רמקול נייד עמיד במים', 44900, false); -- One inactive product

-- ============================================
-- Insert Sample Payment Plans
-- ============================================

-- Custom payment plans for expensive items
INSERT INTO public.product_payment_plans (product_id, installments, surcharge_pct) VALUES
  -- Laptop - special rates
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 0.015), -- 1.5% for 3 payments
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6, 0.035), -- 3.5% for 6 payments
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 12, 0.070), -- 7% for 12 payments
  
  -- iPhone - special rates
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 3, 0.020),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 6, 0.040),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 12, 0.075),
  
  -- Camera - premium rates
  ('f6789012-cdef-1234-5678-901234567890', 3, 0.025),
  ('f6789012-cdef-1234-5678-901234567890', 6, 0.050),
  ('f6789012-cdef-1234-5678-901234567890', 12, 0.090);

-- ============================================
-- Insert Sample Product Images
-- ============================================

-- Note: These are placeholder paths. In real usage, upload actual images to storage
INSERT INTO public.product_images (product_id, path, url, is_primary, sort_order) VALUES
  -- Laptop images
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'product-images/laptop-001/main.jpg', 'https://via.placeholder.com/500x500/4A90E2/FFFFFF?text=Dell+XPS+13', true, 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'product-images/laptop-001/side.jpg', 'https://via.placeholder.com/500x500/4A90E2/FFFFFF?text=Side+View', false, 1),
  
  -- Headphones images
  ('b2c3d4e5-f678-90ab-cdef-123456789012', 'product-images/audio-001/main.jpg', 'https://via.placeholder.com/500x500/E24A4A/FFFFFF?text=Sony+WH1000XM4', true, 0),
  
  -- iPhone images
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'product-images/phone-001/main.jpg', 'https://via.placeholder.com/500x500/4AE290/FFFFFF?text=iPhone+15+Pro', true, 0),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'product-images/phone-001/back.jpg', 'https://via.placeholder.com/500x500/4AE290/FFFFFF?text=Back+View', false, 1),
  ('c3d4e5f6-7890-abcd-ef12-345678901234', 'product-images/phone-001/camera.jpg', 'https://via.placeholder.com/500x500/4AE290/FFFFFF?text=Camera+Detail', false, 2),
  
  -- Watch images
  ('d4e5f678-90ab-cdef-1234-567890123456', 'product-images/watch-001/main.jpg', 'https://via.placeholder.com/500x500/E2904A/FFFFFF?text=Apple+Watch', true, 0),
  
  -- Tablet images
  ('e5f67890-abcd-ef12-3456-789012345678', 'product-images/tablet-001/main.jpg', 'https://via.placeholder.com/500x500/904AE2/FFFFFF?text=iPad+Air', true, 0),
  
  -- Camera images
  ('f6789012-cdef-1234-5678-901234567890', 'product-images/camera-001/main.jpg', 'https://via.placeholder.com/500x500/E2E24A/FFFFFF?text=Canon+EOS+R6', true, 0),
  ('f6789012-cdef-1234-5678-901234567890', 'product-images/camera-001/lens.jpg', 'https://via.placeholder.com/500x500/E2E24A/FFFFFF?text=With+Lens', false, 1);

-- ============================================
-- Insert Sample Order Drafts
-- ============================================

INSERT INTO public.order_drafts (customer_name, customer_phone, customer_email, currency, payload, status, sign_url) VALUES
  (
    'ישראל ישראלי',
    '050-1234567',
    'israel@example.com',
    'ILS',
    '{
      "lines": [
        {
          "product_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "product_name": "מחשב נייד Dell XPS 13",
          "quantity": 1,
          "unit_price": 599900,
          "total": 599900
        }
      ],
      "totals": {
        "subtotal": 599900,
        "surcharge": 0,
        "grand_total": 599900
      }
    }'::jsonb,
    'sent',
    'https://sign.example.com/draft-001'
  ),
  (
    'שרה כהן',
    '052-9876543',
    'sarah@example.com',
    'ILS',
    '{
      "lines": [
        {
          "product_id": "b2c3d4e5-f678-90ab-cdef-123456789012",
          "product_name": "אוזניות Sony WH-1000XM4",
          "quantity": 2,
          "unit_price": 129900,
          "total": 259800
        }
      ],
      "totals": {
        "subtotal": 259800,
        "surcharge": 5196,
        "grand_total": 264996
      }
    }'::jsonb,
    'pending',
    NULL
  );

-- ============================================
-- Display Summary
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=================================';
  RAISE NOTICE 'Seed data loaded successfully!';
  RAISE NOTICE '=================================';
  RAISE NOTICE 'Products: %', (SELECT COUNT(*) FROM public.products);
  RAISE NOTICE 'Product Images: %', (SELECT COUNT(*) FROM public.product_images);
  RAISE NOTICE 'Payment Plans: %', (SELECT COUNT(*) FROM public.product_payment_plans);
  RAISE NOTICE 'Order Drafts: %', (SELECT COUNT(*) FROM public.order_drafts);
  RAISE NOTICE '=================================';
END $$;
