-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION public.validate_user_id(user_id_input uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
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
SET search_path = public
AS $$
BEGIN
  -- Check if slug is valid format (alphanumeric with hyphens)
  RETURN slug_input ~ '^[a-z0-9-]+$' AND length(slug_input) BETWEEN 1 AND 50;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_delete_category(category_id_input uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if category has associated listings
  RETURN NOT EXISTS (
    SELECT 1 FROM public.listings WHERE category_id = category_id_input
  );
END;
$$;