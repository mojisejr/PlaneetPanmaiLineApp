# Database Migration Files

This directory contains SQL migration files for the Praneet Panmai LINE App database schema.

## Overview

The database schema supports a members-only durian plant calculator with tiered pricing and Row Level Security (RLS) policies.

## Migration Files

Execute these files in order in your Supabase SQL Editor:

1. **001_create_members.sql** - LINE OA members table
   - Stores LINE user profiles and registration data
   - Includes auto-update triggers for `updated_at`

2. **002_create_products.sql** - Durian plant catalog
   - Product details with Thai language support
   - Plant shapes: กระโดง (spiky) or ข้าง (rounded)
   - Unique constraint on (variety_name, size, plant_shape)

3. **003_create_price_tiers.sql** - Tiered pricing structure
   - Bulk purchase discount tiers
   - Foreign key relationship to products

4. **004_enable_rls.sql** - Row Level Security policies
   - Members-only access to calculator features
   - Admin policies for data management
   - Authentication function for LINE users

5. **005_create_indexes.sql** - Performance optimization
   - Indexes for common queries
   - Composite indexes for complex searches

6. **006_sample_data.sql** - Sample data insertion
   - 10 durian varieties with different sizes and shapes
   - Price tiers: 1-4 plants (regular), 5-9 (10% off), 10+ (20% off)
   - 2 sample test members

## How to Apply Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order (001 → 006)
4. Click "Run" for each file

### Option 2: Supabase CLI

```bash
# If using Supabase CLI
supabase db reset  # Reset database (careful in production!)
```

### Option 3: Manual Execution

```bash
# Using psql (requires direct database access)
psql -h [YOUR_DB_HOST] -U postgres -d postgres < 001_create_members.sql
psql -h [YOUR_DB_HOST] -U postgres -d postgres < 002_create_products.sql
# ... continue for all files
```

## Database Schema

### Tables

- **members** - LINE OA registered users
  - Primary key: `id` (UUID)
  - Unique: `line_user_id` (TEXT)
  - Fields: display_name, registration_date, contact_info, is_active

- **products** - Durian plant catalog
  - Primary key: `id` (UUID)
  - Unique: (variety_name, size, plant_shape)
  - Fields: base_price, is_available_in_store, image_url, description, is_active

- **price_tiers** - Tiered pricing for bulk purchases
  - Primary key: `id` (UUID)
  - Foreign key: `product_id` → products(id)
  - Fields: min_quantity, max_quantity, special_price, is_active

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Members**: Users can view/update only their own profile
- **Products**: Authenticated users can view active products
- **Price Tiers**: Authenticated users can view active pricing
- **Admin**: Users with `role = 'admin'` can manage all data

## Testing Database Connection

Use the provided test utility:

```typescript
import { testDatabaseConnection } from '@/lib/supabase/test-connection'

const result = await testDatabaseConnection()
console.log(result)
// {
//   success: true,
//   message: 'Database connection and basic queries successful',
//   products: 10,
//   members: 2,
//   priceTiers: 30
// }
```

## Sample Data

After running all migrations, you'll have:

- 10 durian varieties (ชมพู่, หมอนทอง, ก้านลาย, ชะนี)
- 30 price tier entries (3 tiers per product)
- 2 test member accounts

## Rollback

To rollback migrations, drop tables in reverse order:

```sql
DROP TABLE IF EXISTS price_tiers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.is_authenticated_line_member() CASCADE;
```

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- Prices use `DECIMAL(10, 2)` for precise monetary values
- Thai language content (กระโดง/ข้าง) is properly supported with UTF-8
- RLS policies enforce members-only access to calculator features

## Related Documentation

- [Supabase Database](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [LINE LIFF Authentication](https://developers.line.biz/en/docs/liff/)
