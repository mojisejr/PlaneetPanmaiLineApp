-- Enable Row Level Security on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is authenticated LINE member
CREATE OR REPLACE FUNCTION public.is_authenticated_line_member()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user exists in members table
  RETURN EXISTS (
    SELECT 1 FROM members
    WHERE line_user_id = (auth.jwt() ->> 'line_user_id')
    AND is_active = true
  );
END;
$$;

-- Members table RLS policies
CREATE POLICY "Users can view own profile"
ON members
FOR SELECT
TO authenticated
USING (line_user_id = (auth.jwt() ->> 'line_user_id'));

CREATE POLICY "Users can insert own profile"
ON members
FOR INSERT
TO authenticated
WITH CHECK (line_user_id = (auth.jwt() ->> 'line_user_id'));

CREATE POLICY "Users can update own profile"
ON members
FOR UPDATE
TO authenticated
USING (line_user_id = (auth.jwt() ->> 'line_user_id'));

-- Products table RLS policies
CREATE POLICY "Authenticated LINE members can view products"
ON products
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Admin users can manage products"
ON products
FOR ALL
TO authenticated
USING (
  -- Admin check - extend this based on your admin logic
  auth.jwt() ->> 'role' = 'admin'
);

-- Price tiers table RLS policies
CREATE POLICY "Authenticated LINE members can view price tiers"
ON price_tiers
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Admin users can manage price tiers"
ON price_tiers
FOR ALL
TO authenticated
USING (
  -- Admin check - extend this based on your admin logic
  auth.jwt() ->> 'role' = 'admin'
);
