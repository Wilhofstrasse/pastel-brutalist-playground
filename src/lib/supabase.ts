// Temporary working version without Supabase dependency
export const supabase = null;

// Mock auth functions that work immediately
export const signUp = async (email: string, password: string, fullName: string) => {
  // Store user in localStorage for demo
  const user = {
    id: Math.random().toString(36),
    email,
    user_metadata: { full_name: fullName },
    created_at: new Date().toISOString()
  };
  localStorage.setItem('demo_user', JSON.stringify(user));
  return { data: { user }, error: null };
};

export const signIn = async (email: string, password: string) => {
  // Simple demo login
  const user = {
    id: Math.random().toString(36),
    email,
    user_metadata: { full_name: email.split('@')[0] },
    created_at: new Date().toISOString()
  };
  localStorage.setItem('demo_user', JSON.stringify(user));
  return { data: { user }, error: null };
};

export const signOut = async () => {
  localStorage.removeItem('demo_user');
  return { error: null };
};

export const getCurrentUser = async () => {
  const stored = localStorage.getItem('demo_user');
  return stored ? JSON.parse(stored) : null;
};

// Mock data functions
export const getListings = async () => {
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
  return { data: mockListings, error: null };
};

export const getUserListings = async (userId: string) => {
  return { data: [], error: null };
};

export const getSavedListings = async (userId: string) => {
  return { data: [], error: null };
};

export const createListing = async (listing: any) => {
  return { data: { id: Math.random().toString(36), ...listing }, error: null };
};

// Placeholder functions
export const getListing = async (id: string) => ({ data: null, error: null });
export const updateListing = async (id: string, updates: any) => ({ data: null, error: null });
export const deleteListing = async (id: string) => ({ error: null });
export const saveListing = async (listingId: string) => ({ data: null, error: null });
export const unsaveListing = async (listingId: string) => ({ error: null });
export const getCategories = async () => ({ data: [], error: null });
export const getProfile = async (userId: string) => ({ data: null, error: null });
export const updateProfile = async (userId: string, updates: any) => ({ data: null, error: null });
export const uploadImage = async (file: File) => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop' }, error: null });

// Types for compatibility
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