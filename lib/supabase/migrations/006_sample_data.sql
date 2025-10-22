-- Insert sample durian varieties
INSERT INTO products (variety_name, size, plant_shape, base_price, is_available_in_store, description) VALUES
('ชมพู่', 'M', 'กระโดง', 1500.00, true, 'พันธุ์ชมพู่ ขนาดกลาง รูปทรงกระโดง'),
('ชมพู่', 'M', 'ข้าง', 1200.00, true, 'พันธุ์ชมพู่ ขนาดกลาง รูปทรงข้าง'),
('ชมพู่', 'L', 'กระโดง', 2000.00, true, 'พันธุ์ชมพู่ ขนาดใหญ่ รูปทรงกระโดง'),
('ชมพู่', 'L', 'ข้าง', 1700.00, true, 'พันธุ์ชมพู่ ขนาดใหญ่ รูปทรงข้าง'),
('หมอนทอง', 'M', 'กระโดง', 1800.00, false, 'พันธุ์หมอนทอง ขนาดกลาง รูปทรงกระโดง (อ้างอิง)'),
('หมอนทอง', 'L', 'กระโดง', 2500.00, false, 'พันธุ์หมอนทอง ขนาดใหญ่ รูปทรงกระโดง (อ้างอิง)'),
('ก้านลาย', 'M', 'กระโดง', 1600.00, true, 'พันธุ์ก้านลาย ขนาดกลาง รูปทรงกระโดง'),
('ก้านลาย', 'L', 'กระโดง', 2200.00, true, 'พันธุ์ก้านลาย ขนาดใหญ่ รูปทรงกระโดง'),
('ชะนี', 'M', 'กระโดง', 1400.00, true, 'พันธุ์ชะนี ขนาดกลาง รูปทรงกระโดง'),
('ชะนี', 'L', 'กระโดง', 1900.00, true, 'พันธุ์ชะนี ขนาดใหญ่ รูปทรงกระโดง');

-- Insert price tiers for all products
INSERT INTO price_tiers (product_id, min_quantity, max_quantity, special_price)
SELECT
  p.id,
  1,  -- min_quantity
  4,  -- max_quantity
  p.base_price  -- 1-4 plants: regular price
FROM products p;

INSERT INTO price_tiers (product_id, min_quantity, max_quantity, special_price)
SELECT
  p.id,
  5,  -- min_quantity
  9,  -- max_quantity
  p.base_price * 0.9  -- 5-9 plants: 10% discount
FROM products p;

INSERT INTO price_tiers (product_id, min_quantity, max_quantity, special_price)
SELECT
  p.id,
  10, -- min_quantity
  NULL, -- max_quantity (unlimited)
  p.base_price * 0.8  -- 10+ plants: 20% discount
FROM products p;

-- Insert sample member (for testing)
INSERT INTO members (line_user_id, display_name, contact_info) VALUES
('U1234567890abcdef', 'สมชาย ใจดี', '081-234-5678'),
('U0987654321fedcba', 'มานี รักต้นไม้', '082-345-6789');
