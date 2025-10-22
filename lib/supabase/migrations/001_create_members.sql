-- Create members table for LINE OA user registration
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contact_info TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Add comments for documentation
COMMENT ON TABLE members IS 'LINE OA members registered for calculator access';
COMMENT ON COLUMN members.id IS 'Primary key UUID';
COMMENT ON COLUMN members.line_user_id IS 'LINE User ID (unique identifier from LINE)';
COMMENT ON COLUMN members.display_name IS 'Display name from LINE profile';
COMMENT ON COLUMN members.registration_date IS 'When user registered in system';
COMMENT ON COLUMN members.contact_info IS 'Optional contact information (phone, email, etc.)';
COMMENT ON COLUMN members.is_active IS 'Whether member has calculator access';
