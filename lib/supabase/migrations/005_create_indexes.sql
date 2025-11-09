-- Create performance indexes (idempotent)

-- Members table indexes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_members_line_user_id' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_members_line_user_id ON public.members(line_user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_members_is_active' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_members_is_active ON public.members(is_active);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_members_registration_date' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_members_registration_date ON public.members(registration_date);
  END IF;
END $$;

-- Products table indexes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_variety_name' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_variety_name ON public.products(variety_name);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_size' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_size ON public.products(size);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_plant_shape' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_plant_shape ON public.products(plant_shape);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_is_active' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_is_active ON public.products(is_active);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_available_in_store' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_available_in_store ON public.products(is_available_in_store);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_combination' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_combination ON public.products(variety_name, size, plant_shape);
  END IF;
END $$;

-- Price tiers table indexes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_price_tiers_product_id' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_price_tiers_product_id ON public.price_tiers(product_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_price_tiers_min_quantity' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_price_tiers_min_quantity ON public.price_tiers(min_quantity);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_price_tiers_is_active' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_price_tiers_is_active ON public.price_tiers(is_active);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_price_tiers_quantity_range' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_price_tiers_quantity_range ON public.price_tiers(min_quantity, max_quantity);
  END IF;
END $$;

-- Composite index for product pricing queries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_products_active_available' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_products_active_available ON public.products(is_active, is_available_in_store);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = 'idx_price_tiers_product_active' AND n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_price_tiers_product_active ON public.price_tiers(product_id, is_active);
  END IF;
END $$;
