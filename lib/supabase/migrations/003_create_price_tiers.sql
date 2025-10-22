-- Create price_tiers table for tiered pricing
CREATE TABLE IF NOT EXISTS price_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
  max_quantity INTEGER CHECK (max_quantity IS NULL OR max_quantity >= min_quantity),
  special_price DECIMAL(10, 2) NOT NULL CHECK (special_price > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for price_tiers
CREATE TRIGGER handle_price_tiers_updated_at
    BEFORE UPDATE ON price_tiers
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Add unique constraint for pricing tiers
ALTER TABLE price_tiers ADD CONSTRAINT unique_pricing_tier
UNIQUE (product_id, min_quantity, max_quantity);

-- Add comments for documentation
COMMENT ON TABLE price_tiers IS 'Tiered pricing structure for bulk purchases';
COMMENT ON COLUMN price_tiers.product_id IS 'Reference to products table';
COMMENT ON COLUMN price_tiers.min_quantity IS 'Minimum quantity for this tier (inclusive)';
COMMENT ON COLUMN price_tiers.max_quantity IS 'Maximum quantity for this tier (inclusive, null = unlimited)';
COMMENT ON COLUMN price_tiers.special_price IS 'Special price for this quantity range';
COMMENT ON COLUMN price_tiers.is_active IS 'Whether this pricing tier is currently active';
