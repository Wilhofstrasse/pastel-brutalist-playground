import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  totalCategories: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: 'user' | 'admin' | 'moderator';
}

export interface AdminListing {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  status: string;
  moderation_status: string;
  created_at: string;
  user_id: string;
  category_id: string | null;
  user: {
    full_name: string | null;
    email: string;
  };
  category: {
    name: string;
  } | null;
}

// Admin functions
export const getAdminStats = async (): Promise<AdminStats> => {
  const [usersCount, listingsCount, activeListingsCount, pendingListingsCount, categoriesCount] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('id', { count: 'exact', head: true }),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('moderation_status', 'pending'),
    supabase.from('categories').select('id', { count: 'exact', head: true })
  ]);

  return {
    totalUsers: usersCount.count || 0,
    totalListings: listingsCount.count || 0,
    activeListings: activeListingsCount.count || 0,
    pendingListings: pendingListingsCount.count || 0,
    totalCategories: categoriesCount.count || 0
  };
};

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles (role)
    `)
    .order('created_at', { ascending: false });

  if (profilesError) throw profilesError;

  return profiles?.map(profile => ({
    id: profile.user_id,
    email: profile.user_id, // We'll need to get this from auth.users via edge function
    full_name: profile.full_name,
    phone: profile.phone,
    created_at: profile.created_at,
    role: (profile.user_roles as any)?.[0]?.role || 'user'
  })) || [];
};

export const getAllListings = async (): Promise<AdminListing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles (full_name, user_id),
      categories (name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data?.map(listing => ({
    ...listing,
    user: {
      full_name: (listing as any).profiles?.full_name || null,
      email: (listing as any).profiles?.user_id || '' // We'll need actual email from edge function
    },
    category: (listing as any).categories
  })) || [];
};

export const updateListingModerationStatus = async (
  listingId: string, 
  status: 'approved' | 'rejected' | 'pending',
  moderatorId: string
) => {
  const { error } = await supabase
    .from('listings')
    .update({
      moderation_status: status,
      moderated_by: moderatorId,
      moderated_at: new Date().toISOString()
    })
    .eq('id', listingId);

  if (error) throw error;
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
  // First, delete existing role
  await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  // Then insert new role
  const { error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role
    });

  if (error) throw error;
};

export const deleteUser = async (userId: string) => {
  // This should be handled by an edge function for proper cleanup
  // For now, we'll just delete the profile
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

export const deleteListing = async (listingId: string) => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId);

  if (error) throw error;
};