import { createClient } from '@supabase/supabase-js';

// Load Supabase project URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);