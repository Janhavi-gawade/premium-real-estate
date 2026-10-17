-- ====================================================================
-- ARTH PROPERTIES — INITIAL DATABASE SCHEMA MIGRATION
-- Database: Supabase PostgreSQL
-- Author: Senior Full-Stack Database Architect
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('residential', 'commercial', 'plots', 'investment')),
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('buy', 'rent')),
  price NUMERIC(14, 2) NOT NULL,
  price_label VARCHAR(100), -- Formatted e.g. "₹2.45 Cr" or "₹45,000 / month"
  location VARCHAR(150) NOT NULL, -- e.g. "Baner, Pune"
  landmark VARCHAR(255),
  carpet_area NUMERIC(10, 2) NOT NULL, -- in sq.ft.
  built_up_area NUMERIC(10, 2), -- in sq.ft.
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  furnishing_status VARCHAR(50) DEFAULT 'unfurnished' CHECK (furnishing_status IN ('unfurnished', 'semi-furnished', 'fully-furnished')),
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_title VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  enquiry_type VARCHAR(30) DEFAULT 'general' CHECK (enquiry_type IN ('general', 'visit_request', 'call_back')),
  preferred_date DATE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. OWNER SUBMISSIONS TABLE (Sell Your Property submissions)
CREATE TABLE IF NOT EXISTS public.owner_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name VARCHAR(100) NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  owner_email VARCHAR(100),
  property_type VARCHAR(50) NOT NULL,
  location VARCHAR(150) NOT NULL,
  expected_price NUMERIC(14, 2) NOT NULL,
  carpet_area NUMERIC(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties (slug);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties (category);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON public.properties (transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties (price);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties (featured);
CREATE INDEX IF NOT EXISTS idx_properties_is_published ON public.properties (is_published);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS idx_owner_submissions_status ON public.owner_submissions (review_status);

-- 6. AUTO-UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_properties_updated_at ON public.properties;
CREATE TRIGGER trigger_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_submissions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (anonymous & authenticated) can view published properties
DROP POLICY IF EXISTS "Public can view published properties" ON public.properties;
CREATE POLICY "Public can view published properties"
  ON public.properties FOR SELECT
  USING (is_published = true);

-- Policy 2: Authenticated administrators can perform all actions on properties
DROP POLICY IF EXISTS "Admins have full access to properties" ON public.properties;
CREATE POLICY "Admins have full access to properties"
  ON public.properties FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 3: Public can submit inquiries
DROP POLICY IF EXISTS "Public can create enquiries" ON public.enquiries;
CREATE POLICY "Public can create enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

-- Policy 4: Only authenticated administrators can view/manage enquiries
DROP POLICY IF EXISTS "Admins can view and manage enquiries" ON public.enquiries;
CREATE POLICY "Admins can view and manage enquiries"
  ON public.enquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Public can submit owner property listings
DROP POLICY IF EXISTS "Public can submit owner property" ON public.owner_submissions;
CREATE POLICY "Public can submit owner property"
  ON public.owner_submissions FOR INSERT
  WITH CHECK (true);

-- Policy 6: Only authenticated administrators can view/approve owner submissions
DROP POLICY IF EXISTS "Admins can view and manage owner submissions" ON public.owner_submissions;
CREATE POLICY "Admins can view and manage owner submissions"
  ON public.owner_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ====================================================================
-- STORAGE BUCKET POLICIES (property-images)
-- ====================================================================
-- Run this in Supabase SQL editor to create the public bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
--
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
-- CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-images');
-- CREATE POLICY "Admin Deletions" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-images');
