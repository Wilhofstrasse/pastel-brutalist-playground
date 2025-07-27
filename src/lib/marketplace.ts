import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Type definitions for our marketplace
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type SavedListing = Database['public']['Tables']['saved_listings']['Row'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ListingInsert = Database['public']['Tables']['listings']['Insert'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type SavedListingInsert = Database['public']['Tables']['saved_listings']['Insert'];

// Auth functions
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
};

// Profile functions
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<ProfileInsert>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, ...updates })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Category functions
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

// Listing functions
export const getListings = async (categoryId?: string): Promise<Listing[]> => {
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getListing = async (id: string): Promise<Listing | null> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createListing = async (listing: Omit<ListingInsert, 'user_id'>): Promise<Listing> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to create a listing');
  
  const { data, error } = await supabase
    .from('listings')
    .insert({ ...listing, user_id: user.id })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateListing = async (id: string, updates: Partial<ListingInsert>): Promise<Listing> => {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteListing = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getUserListings = async (userId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Saved listings functions
export const getSavedListings = async (userId: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('saved_listings')
    .select(`
      listing_id,
      listings (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(item => item.listings).filter(Boolean) as Listing[] || [];
};

export const saveListing = async (listingId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to save a listing');
  
  const { error } = await supabase
    .from('saved_listings')
    .insert({ user_id: user.id, listing_id: listingId });
  
  if (error) throw error;
};

export const unsaveListing = async (listingId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to unsave a listing');
  
  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId);
  
  if (error) throw error;
};

export const isListingSaved = async (listingId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('saved_listings')
    .select('id')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

// Image upload function with enhanced security
export const uploadImage = async (file: File, bucket: string = 'listing-images'): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to upload images');
  
  // Security: File size limit (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }
  
  // Security: Strict file type validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }
  
  // Security: Validate file extension matches MIME type
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  if (!fileExt || !validExtensions.includes(fileExt)) {
    throw new Error('Invalid file extension');
  }
  
  // Security: Sanitize filename and use UUID-based naming
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (uploadError) throw uploadError;
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};

// Search function
export const searchListings = async (query: string): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};