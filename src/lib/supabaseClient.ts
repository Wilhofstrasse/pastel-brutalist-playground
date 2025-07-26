import { createClient } from '@supabase/supabase-js';

// These would typically come from environment variables
// For development, you can replace these with your actual Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);