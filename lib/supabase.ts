import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  // Next.js standard environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase URL or Key is missing from environment variables.');
    }
  }

  supabaseInstance = createClient(url, key, {
    auth: { persistSession: typeof window !== 'undefined' },
  });

  return supabaseInstance;
};
