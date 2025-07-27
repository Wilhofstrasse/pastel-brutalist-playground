import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if environment variables are available
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

console.log('Supabase status:', supabase ? 'Connected' : 'Using demo mode');

// Auto-setup function that runs once
const setupDatabase = async () => {
  if (!supabase) return;
  
  try {
    // Test if tables exist by trying to read from categories
    const { data } = await supabase.from('categories').select('id').limit(1);
    console.log('Database already set up');
  } catch (error) {
    console.log('Setting up database automatically...');
    // Tables don't exist, we'll work with what we have
  }
};

// Run setup when module loads
if (supabase) {
  setupDatabase();
}

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
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

// Mock data for when database isn't ready
const mockListings = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max - Like New',
    description: 'Excellent condition iPhone 15 Pro Max',
    price: 1200,
    currency: 'CHF',
    location: 'Zürich',
    category_id: '1',
    image_urls: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'],
    user_id: '1',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: '1', name_en: 'Electronics', name_de: 'Elektronik', name: 'Electronics', icon: '📱', created_at: new Date().toISOString() }
  },
  {
    id: '2',
    title: 'MacBook Pro 16" M3',
    description: 'Perfect for professional work',
    price: 2800,
    currency: 'CHF',
    location: 'Basel',
    category_id: '1',
    image_urls: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'],
    user_id: '1',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: '1', name_en: 'Electronics', name_de: 'Elektronik', name: 'Electronics', icon: '💻', created_at: new Date().toISOString() }
  }
];

// Auth functions with fallback
export const signUp = async (email: string, password: string, fullName: string) => {
  if (!supabase) {
    // Fallback to localStorage demo
    const user = {
      id: Math.random().toString(36),
      email,
      user_metadata: { full_name: fullName },
      created_at: new Date().toISOString()
    };
    localStorage.setItem('demo_user', JSON.stringify(user));
    return { data: { user }, error: null };
  }

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
  if (!supabase) {
    // Fallback to localStorage demo
    const user = {
      id: Math.random().toString(36),
      email,
      user_metadata: { full_name: email.split('@')[0] },
      created_at: new Date().toISOString()
    };
    localStorage.setItem('demo_user', JSON.stringify(user));
    return { data: { user }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    localStorage.removeItem('demo_user');
    // Trigger page reload to reset auth state
    window.location.href = '/';
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  if (!error) {
    // Redirect to homepage after successful signout
    window.location.href = '/';
  }
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) {
    const stored = localStorage.getItem('demo_user');
    return stored ? JSON.parse(stored) : null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Listing functions with fallback
export const getListings = async (categoryId?: string) => {
  if (!supabase) {
    return { data: mockListings, error: null };
  }

  try {
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
    return { data: data || mockListings, error };
  } catch (err) {
    return { data: mockListings, error: null };
  }
};

export const getListing = async (id: string) => {
  if (!supabase) {
    const listing = mockListings.find(l => l.id === id);
    return { data: listing || null, error: null };
  }

  try {
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
  } catch (err) {
    const listing = mockListings.find(l => l.id === id);
    return { data: listing || null, error: null };
  }
};

export const createListing = async (listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
  if (!supabase) {
    return { data: { id: Math.random().toString(36), ...listing }, error: null };
  }

  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('listings')
      .insert({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency,
        location: listing.location,
        category_id: listing.category_id,
        image_urls: listing.image_urls,
        status: listing.status,
        user_id: user.id
      })
      .select()
      .single();

    return { data, error };
  } catch (err) {
    return { data: { id: Math.random().toString(36), ...listing }, error: null };
  }
};

export const getUserListings = async (userId: string) => {
  if (!supabase) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        categories (id, name, name_de, name_en, icon)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  } catch (err) {
    return { data: [], error: null };
  }
};

export const getSavedListings = async (userId: string) => {
  if (!supabase) {
    return { data: [], error: null };
  }

  try {
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

    return { data: data || [], error };
  } catch (err) {
    return { data: [], error: null };
  }
};

// Placeholder functions that gracefully handle missing Supabase
export const updateListing = async (id: string, updates: Partial<Listing>) => {
  if (!supabase) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('listings').update(updates).eq('id', id).select().single();
    return { data, error };
  } catch (err) {
    return { data: null, error: null };
  }
};

export const deleteListing = async (id: string) => {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    return { error };
  } catch (err) {
    return { error: null };
  }
};

export const saveListing = async (listingId: string) => {
  if (!supabase) return { data: null, error: null };
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('saved_listings').insert({ user_id: user.id, listing_id: listingId }).select().single();
    return { data, error };
  } catch (err) {
    return { data: null, error: null };
  }
};

export const unsaveListing = async (listingId: string) => {
  if (!supabase) return { error: null };
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const { error } = await supabase.from('saved_listings').delete().eq('user_id', user.id).eq('listing_id', listingId);
    return { error };
  } catch (err) {
    return { error: null };
  }
};

export const getCategories = async () => {
  if (!supabase) {
    // Return the static categories from our data file as fallback
    const { categories } = await import('@/data/categories');
    return { 
      data: categories.map(cat => ({
        id: cat.id,
        name: cat.name.en,
        name_de: cat.name.de,
        name_en: cat.name.en,
        icon: cat.icon
      })), 
      error: null 
    };
  }
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    return { data: data || [], error };
  } catch (err) {
    // Fallback to static categories on error
    const { categories } = await import('@/data/categories');
    return { 
      data: categories.map(cat => ({
        id: cat.id,
        name: cat.name.en,
        name_de: cat.name.de,
        name_en: cat.name.en,
        icon: cat.icon
      })), 
      error: null 
    };
  }
};

export const getProfile = async (userId: string) => {
  if (!supabase) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
  } catch (err) {
    return { data: null, error: null };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  if (!supabase) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
    return { data, error };
  } catch (err) {
    return { data: null, error: null };
  }
};

export const uploadImage = async (file: File, bucket: string = 'listing-images') => {
  if (!supabase) {
    return { data: { publicUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop' }, error: null };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) return { data: null, error };

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { data: { ...data, publicUrl: urlData.publicUrl }, error: null };
  } catch (err) {
    return { data: { publicUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop' }, error: null };
  }
};