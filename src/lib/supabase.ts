import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  category_id: string;
  image_urls: string[];
  user_id: string;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  categories?: Category;
}

export interface Category {
  id: string;
  name: string;
  name_de: string;
  name_en: string;
  icon: string;
  created_at: string;
}

export interface SavedListing {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listings?: Listing;
}

// Auth functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Listing functions
export const getListings = async (categoryId?: string) => {
  let query = supabase
    .from('listings')
    .select(`
      *,
      profiles (id, full_name, avatar_url),
      categories (id, name, name_de, name_en, icon)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  return { data, error };
};

export const getListing = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles (id, full_name, avatar_url, email),
      categories (id, name, name_de, name_en, icon)
    `)
    .eq('id', id)
    .single();

  return { data, error };
};

export const createListing = async (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...listing,
      user_id: user.id
    })
    .select()
    .single();

  return { data, error };
};

export const updateListing = async (id: string, updates: Partial<Listing>) => {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteListing = async (id: string) => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  return { error };
};

export const getUserListings = async (userId: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      categories (id, name, name_de, name_en, icon)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Saved listings functions
export const getSavedListings = async (userId: string) => {
  const { data, error } = await supabase
    .from('saved_listings')
    .select(`
      *,
      listings (
        *,
        profiles (id, full_name, avatar_url),
        categories (id, name, name_de, name_en, icon)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const saveListing = async (listingId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('saved_listings')
    .insert({
      user_id: user.id,
      listing_id: listingId
    })
    .select()
    .single();

  return { data, error };
};

export const unsaveListing = async (listingId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('saved_listings')
    .delete()
    .eq('user_id', user.id)
    .eq('listing_id', listingId);

  return { error };
};

// Categories functions
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return { data, error };
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

// File upload functions
export const uploadImage = async (file: File, bucket: string = 'listing-images') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) return { data: null, error };

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return { data: { ...data, publicUrl: urlData.publicUrl }, error: null };
};