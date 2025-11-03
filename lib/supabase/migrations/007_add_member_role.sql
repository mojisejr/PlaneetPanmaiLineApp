-- Migration: Add 'role' column to members table
-- This enables role-based access control with 'member' (default) and 'admin' roles

BEGIN;

-- Add role column with default value 'member'
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member';

-- Add constraint to restrict allowed values to 'member' or 'admin'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'members_role_check'
  ) THEN
    ALTER TABLE public.members
      ADD CONSTRAINT members_role_check CHECK (role IN ('member', 'admin'));
  END IF;
END$$;

-- Add comment for documentation
COMMENT ON COLUMN public.members.role IS 'User role: member (default) or admin for backend management';

COMMIT;
