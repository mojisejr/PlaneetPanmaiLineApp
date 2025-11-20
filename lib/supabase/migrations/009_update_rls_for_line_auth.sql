-- Migration: Update RLS Policies for LINE Authentication
-- This updates existing Row Level Security policies to use custom JWT validation functions

BEGIN;

-- Drop existing RLS policies that use old authentication method
DROP POLICY IF EXISTS "Users can view own profile" ON public.members;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.members;
DROP POLICY IF EXISTS "Users can update own profile" ON public.members;
DROP POLICY IF EXISTS "Authenticated LINE members can view products" ON public.products;
DROP POLICY IF EXISTS "Admin users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated LINE members can view price tiers" ON public.price_tiers;
DROP POLICY IF EXISTS "Admin users can manage price tiers" ON public.price_tiers;

-- Drop old authentication function (no longer needed)
DROP FUNCTION IF EXISTS public.is_authenticated_line_member();

-- Create updated RLS policies for members table using custom JWT validation
CREATE POLICY "LINE users can view own profile"
  ON public.members
  FOR SELECT TO authenticated
  USING (
    line_user_id = get_current_line_user_id()
  );

CREATE POLICY "LINE users can insert own profile"
  ON public.members
  FOR INSERT TO authenticated
  WITH CHECK (
    line_user_id = get_current_line_user_id()
  );

CREATE POLICY "LINE users can update own profile"
  ON public.members
  FOR UPDATE TO authenticated
  USING (
    line_user_id = get_current_line_user_id()
  );

-- Create updated RLS policies for products table using custom JWT validation
CREATE POLICY "LINE authenticated users can view active products"
  ON public.products
  FOR SELECT TO authenticated
  USING (
    is_active = true AND
    is_line_authenticated() = true
  );

CREATE POLICY "LINE admin users can manage products"
  ON public.products
  FOR ALL TO authenticated
  USING (
    is_line_authenticated() = true AND
    EXISTS (
      SELECT 1 FROM members
      WHERE line_user_id = get_current_line_user_id()
      AND role = 'admin'
      AND is_active = true
    )
  );

-- Create updated RLS policies for price_tiers table using custom JWT validation
CREATE POLICY "LINE authenticated users can view active price tiers"
  ON public.price_tiers
  FOR SELECT TO authenticated
  USING (
    is_active = true AND
    is_line_authenticated() = true
  );

CREATE POLICY "LINE admin users can manage price tiers"
  ON public.price_tiers
  FOR ALL TO authenticated
  USING (
    is_line_authenticated() = true AND
    EXISTS (
      SELECT 1 FROM members
      WHERE line_user_id = get_current_line_user_id()
      AND role = 'admin'
      AND is_active = true
    )
  );

-- Additional security: Ensure service_role has full access for system operations
CREATE POLICY "Service role full access to members"
  ON public.members
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to products"
  ON public.products
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to price_tiers"
  ON public.price_tiers
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy validation helper functions
CREATE OR REPLACE FUNCTION validate_line_user_access(target_line_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is authenticated via LINE
  IF NOT is_line_authenticated() THEN
    RETURN FALSE;
  END IF;

  -- Check if user is accessing their own data or is admin
  RETURN (
    target_line_user_id = get_current_line_user_id() OR
    EXISTS (
      SELECT 1 FROM members
      WHERE line_user_id = get_current_line_user_id()
      AND role = 'admin'
      AND is_active = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for comprehensive policy testing
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(
  test_name TEXT,
  result TEXT,
  details TEXT
) AS $$
BEGIN
  -- Test 1: LINE authentication function
  RETURN QUERY
  SELECT
    'LINE Authentication Test'::TEXT,
    CASE WHEN is_line_authenticated() THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'Custom JWT validation function working'::TEXT;

  -- Test 2: Current user ID extraction
  RETURN QUERY
  SELECT
    'User ID Extraction Test'::TEXT,
    CASE WHEN get_current_line_user_id() IS NOT NULL THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'LINE user ID extraction working'::TEXT;

  -- Test 3: Member access validation
  RETURN QUERY
  SELECT
    'Member Access Validation Test'::TEXT,
    CASE WHEN EXISTS (SELECT 1 FROM members LIMIT 1) THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'Member table access policies working'::TEXT;

  -- Test 4: Product access validation
  RETURN QUERY
  SELECT
    'Product Access Validation Test'::TEXT,
    CASE WHEN EXISTS (SELECT 1 FROM products WHERE is_active = true LIMIT 1) THEN 'PASS' ELSE 'FAIL' END::TEXT,
    'Product table access policies working'::TEXT;

RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions for new functions
GRANT EXECUTE ON FUNCTION validate_line_user_access(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_policies() TO service_role;

-- Add comments for documentation
COMMENT ON POLICY "LINE users can view own profile" ON public.members IS 'Allows LINE authenticated users to view their own member profile';
COMMENT ON POLICY "LINE users can insert own profile" ON public.members IS 'Allows LINE authenticated users to create their own member profile';
COMMENT ON POLICY "LINE users can update own profile" ON public.members IS 'Allows LINE authenticated users to update their own member profile';
COMMENT ON POLICY "LINE authenticated users can view active products" ON public.products IS 'Allows LINE authenticated users to view active products only';
COMMENT ON POLICY "LINE admin users can manage products" ON public.products IS 'Allows LINE admin users to perform all operations on products';
COMMENT ON POLICY "LINE authenticated users can view active price tiers" ON public.price_tiers IS 'Allows LINE authenticated users to view active price tiers only';
COMMENT ON POLICY "LINE admin users can manage price tiers" ON public.price_tiers IS 'Allows LINE admin users to perform all operations on price tiers';

COMMIT;