-- Add RLS policies for better security and fix missing policies

-- Enhanced RLS policies for admin_activities to prevent cross-admin access
DROP POLICY IF EXISTS "Admins can view admin activities" ON public.admin_activities;
CREATE POLICY "Admins can view admin activities" ON public.admin_activities
  FOR SELECT USING (
    is_admin(auth.uid()) AND 
    (auth.uid() = admin_id OR has_role(auth.uid(), 'admin'))
  );

-- Add missing storage policy for avatar uploads by folder
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Users can upload their own avatars by folder'
    ) THEN
        CREATE POLICY "Users can upload their own avatars by folder" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'avatars' AND 
            auth.role() = 'authenticated' AND 
            (storage.foldername(name))[1] = auth.uid()::text
          );
    END IF;
END $$;

-- Add input validation functions for security
CREATE OR REPLACE FUNCTION public.validate_user_id(user_id_input uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists in auth.users (indirectly through profiles)
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = user_id_input
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_listing_id(listing_id_input uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.listings WHERE id = listing_id_input
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_category_slug(slug_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if slug is valid format (alphanumeric with hyphens)
  RETURN slug_input ~ '^[a-z0-9-]+$' AND length(slug_input) BETWEEN 1 AND 50;
END;
$$;

-- Add constraint to ensure valid category slugs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'valid_slug_format'
    ) THEN
        ALTER TABLE public.categories 
        ADD CONSTRAINT valid_slug_format 
        CHECK (slug ~ '^[a-z0-9-]+$' AND length(slug) BETWEEN 1 AND 50);
    END IF;
END $$;

-- Add function to check if category can be safely deleted
CREATE OR REPLACE FUNCTION public.can_delete_category(category_id_input uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if category has associated listings
  RETURN NOT EXISTS (
    SELECT 1 FROM public.listings WHERE category_id = category_id_input
  );
END;
$$;