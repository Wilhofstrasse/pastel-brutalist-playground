-- Add missing fields to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'CHF',
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE;

-- Add check constraint for moderation_status if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'listings_moderation_status_check') THEN
        ALTER TABLE public.listings ADD CONSTRAINT listings_moderation_status_check CHECK (moderation_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Add missing fields to categories table  
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Update categories with slugs for existing data
UPDATE public.categories 
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL;

-- Add unique constraint to slug if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'categories_slug_unique') THEN
        ALTER TABLE public.categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
    END IF;
END $$;

-- Add unique constraint to saved_listings if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'saved_listings_user_listing_unique') THEN
        ALTER TABLE public.saved_listings ADD CONSTRAINT saved_listings_user_listing_unique UNIQUE (user_id, listing_id);
    END IF;
END $$;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_moderation_status ON public.listings(moderation_status);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);

-- Update listings RLS to include moderation
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;
CREATE POLICY "Anyone can view approved active listings" ON public.listings
  FOR SELECT USING (status = 'active' AND moderation_status = 'approved');

-- Drop and recreate user view policy to avoid conflicts
DROP POLICY IF EXISTS "Users can view own listings" ON public.listings;
CREATE POLICY "Users can view their own listings" ON public.listings
  FOR SELECT USING (auth.uid() = user_id);

-- Update categories with better data
UPDATE public.categories SET 
  description = CASE name
    WHEN 'Electronics' THEN 'Smartphones, computers, cameras and electronic devices'
    WHEN 'Vehicles' THEN 'Cars, motorcycles, bicycles and transportation'
    WHEN 'Fashion' THEN 'Clothing, shoes, accessories and jewelry'
    WHEN 'Home' THEN 'Furniture, appliances and home improvement'
    WHEN 'Sports' THEN 'Sports equipment, outdoor gear and fitness'
    WHEN 'Books' THEN 'Books, magazines, DVDs and media'
    WHEN 'Services' THEN 'Professional services and freelance work'
    WHEN 'Jobs' THEN 'Job opportunities and career positions'
    WHEN 'Real Estate' THEN 'Properties for sale and rent'
    WHEN 'Animals' THEN 'Pets, pet supplies and animal care'
    WHEN 'Music' THEN 'Musical instruments and audio equipment'
    WHEN 'Games' THEN 'Video games, board games and toys'
    WHEN 'Art' THEN 'Artwork, antiques and collectibles'
    ELSE 'Miscellaneous items and other categories'
  END
WHERE description IS NULL;