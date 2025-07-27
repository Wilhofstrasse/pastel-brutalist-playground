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
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('status', 'active').eq('moderation_status', 'approved'),
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
  const { data, error } = await supabase.rpc('get_users_with_email');
  if (error) throw error;
  return (data as AdminUser[]) || [];
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
  // Input validation
  if (!listingId || !status || !moderatorId) {
    throw new Error('Listing ID, status, and moderator ID are required');
  }

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    throw new Error('Invalid moderation status');
  }

  // Validate listing exists
  const { data: listingExists, error: validateError } = await supabase
    .rpc('validate_listing_id', { listing_id_input: listingId });

  if (validateError || !listingExists) {
    throw new Error('Listing not found');
  }

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
  // Input validation
  if (!userId || !role) {
    throw new Error('User ID and role are required');
  }

  if (!['user', 'admin', 'moderator'].includes(role)) {
    throw new Error('Invalid role specified');
  }

  // Validate user exists
  const { data: userExists, error: validateError } = await supabase
    .rpc('validate_user_id', { user_id_input: userId });

  if (validateError || !userExists) {
    throw new Error('User not found');
  }

  // Use upsert to avoid race condition
  const { error } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role
    }, {
      onConflict: 'user_id'
    });

  if (error) throw error;
};

export const deleteUser = async (userId: string) => {
  // Input validation
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Validate user exists
  const { data: userExists, error: validateError } = await supabase
    .rpc('validate_user_id', { user_id_input: userId });

  if (validateError || !userExists) {
    throw new Error('User not found');
  }

  // Use edge function for secure user deletion
  const { data, error } = await supabase.functions.invoke('delete-user', {
    body: { userId }
  });

  if (error) {
    throw new Error(error.message || 'Failed to delete user');
  }

  if (data?.error) {
    throw new Error(data.error);
  }
};

export const deleteListing = async (listingId: string) => {
  // Input validation
  if (!listingId) {
    throw new Error('Listing ID is required');
  }

  // Validate listing exists
  const { data: listingExists, error: validateError } = await supabase
    .rpc('validate_listing_id', { listing_id_input: listingId });

  if (validateError || !listingExists) {
    throw new Error('Listing not found');
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId);

  if (error) throw error;
};