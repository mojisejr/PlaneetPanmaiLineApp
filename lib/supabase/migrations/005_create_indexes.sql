-- Create performance indexes

-- Members table indexes
CREATE INDEX idx_members_line_user_id ON members(line_user_id);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_members_registration_date ON members(registration_date);

-- Products table indexes
CREATE INDEX idx_products_variety_name ON products(variety_name);
CREATE INDEX idx_products_size ON products(size);
CREATE INDEX idx_products_plant_shape ON products(plant_shape);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_available_in_store ON products(is_available_in_store);
CREATE INDEX idx_products_combination ON products(variety_name, size, plant_shape);

-- Price tiers table indexes
CREATE INDEX idx_price_tiers_product_id ON price_tiers(product_id);
CREATE INDEX idx_price_tiers_min_quantity ON price_tiers(min_quantity);
CREATE INDEX idx_price_tiers_is_active ON price_tiers(is_active);
CREATE INDEX idx_price_tiers_quantity_range ON price_tiers(min_quantity, max_quantity);

-- Composite index for product pricing queries
CREATE INDEX idx_products_active_available ON products(is_active, is_available_in_store);
CREATE INDEX idx_price_tiers_product_active ON price_tiers(product_id, is_active);
