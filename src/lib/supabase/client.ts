import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export function createClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Supports new Supabase Publishable Key (sb_publishable_...) with fallback to legacy anon key
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createBrowserClient(supabaseUrl, publishableKey) as unknown as SupabaseClient<Database>;
}
