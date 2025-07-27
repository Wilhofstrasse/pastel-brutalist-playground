import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeleteUserRequest {
  userId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the request is from an authenticated admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Verify user is admin using the regular client first
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabaseClient
      .rpc('is_admin', { _user_id: user.id })

    if (adminError || !adminCheck) {
      throw new Error('Insufficient privileges')
    }

    const { userId } = await req.json() as DeleteUserRequest

    if (!userId) {
      throw new Error('User ID is required')
    }

    // Validate the user exists
    const { data: userExists, error: validateError } = await supabaseClient
      .rpc('validate_user_id', { user_id_input: userId })

    if (validateError || !userExists) {
      throw new Error('User not found')
    }

    console.log(`Admin ${user.id} is deleting user ${userId}`)

    // Start a transaction-like cleanup process
    // 1. Delete user's saved listings
    const { error: savedListingsError } = await supabaseAdmin
      .from('saved_listings')
      .delete()
      .eq('user_id', userId)

    if (savedListingsError) {
      console.error('Error deleting saved listings:', savedListingsError)
    }

    // 2. Delete user's listings
    const { error: listingsError } = await supabaseAdmin
      .from('listings')
      .delete()
      .eq('user_id', userId)

    if (listingsError) {
      console.error('Error deleting listings:', listingsError)
    }

    // 3. Delete user roles
    const { error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (rolesError) {
      console.error('Error deleting user roles:', rolesError)
    }

    // 4. Delete user profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
    }

    // 5. Finally, delete from auth.users using admin client
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError)
      throw new Error('Failed to delete user from authentication system')
    }

    // Log the admin activity
    await supabaseClient
      .from('admin_activities')
      .insert({
        admin_id: user.id,
        action: 'user_deleted',
        target_type: 'user',
        target_id: userId,
        details: { deleted_at: new Date().toISOString() }
      })

    console.log(`Successfully deleted user ${userId}`)

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in delete-user function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})