-- Enable Row Level Security on all tables (idempotent)
ALTER TABLE IF EXISTS public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.price_tiers ENABLE ROW LEVEL SECURITY;

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

-- Members table RLS policies (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'Users can view own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view own profile" ON public.members FOR SELECT TO authenticated USING (line_user_id = (auth.jwt() ->> ''line_user_id''))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON public.members FOR INSERT TO authenticated WITH CHECK (line_user_id = (auth.jwt() ->> ''line_user_id''))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'Users can update own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update own profile" ON public.members FOR UPDATE TO authenticated USING (line_user_id = (auth.jwt() ->> ''line_user_id''))';
  END IF;
END $$;

-- Products table RLS policies (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Authenticated LINE members can view products'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated LINE members can view products" ON public.products FOR SELECT TO authenticated USING (is_active = true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Admin users can manage products'
  ) THEN
    EXECUTE 'CREATE POLICY "Admin users can manage products" ON public.products FOR ALL TO authenticated USING (auth.jwt() ->> ''role'' = ''admin'')';
  END IF;
END $$;

-- Price tiers table RLS policies (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'price_tiers' AND policyname = 'Authenticated LINE members can view price tiers'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated LINE members can view price tiers" ON public.price_tiers FOR SELECT TO authenticated USING (is_active = true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'price_tiers' AND policyname = 'Admin users can manage price tiers'
  ) THEN
    EXECUTE 'CREATE POLICY "Admin users can manage price tiers" ON public.price_tiers FOR ALL TO authenticated USING (auth.jwt() ->> ''role'' = ''admin'')';
  END IF;
END $$;
