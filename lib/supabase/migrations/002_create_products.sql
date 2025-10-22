-- Create products table for durian plant catalog
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variety_name TEXT NOT NULL,
  size TEXT NOT NULL,
  plant_shape TEXT NOT NULL CHECK (plant_shape IN ('กระโดง', 'ข้าง')),
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price > 0),
  is_available_in_store BOOLEAN DEFAULT false,
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for products
CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Add unique constraint for product combinations
ALTER TABLE products ADD CONSTRAINT unique_product_combination
UNIQUE (variety_name, size, plant_shape);

-- Add comments for documentation
COMMENT ON TABLE products IS 'Durian plant catalog with pricing information';
COMMENT ON COLUMN products.variety_name IS 'Durian variety name (e.g., ชมพู่, หมอนทอง)';
COMMENT ON COLUMN products.size IS 'Plant size (e.g., S, M, L, XL)';
COMMENT ON COLUMN products.plant_shape IS 'Plant shape: กระโดง (spiky) or ข้าง (rounded)';
COMMENT ON COLUMN products.base_price IS 'Base price before tiered pricing discounts';
COMMENT ON COLUMN products.is_available_in_store IS 'Whether plant is available for purchase in store';
COMMENT ON COLUMN products.image_url IS 'URL to plant image';
COMMENT ON COLUMN products.description IS 'Optional plant description';
COMMENT ON COLUMN products.is_active IS 'Whether product is shown in calculator';
