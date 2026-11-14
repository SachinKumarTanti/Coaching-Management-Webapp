import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

let client: SupabaseClient<Database> | undefined;

export function createClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Supports new Supabase Publishable Key (sb_publishable_...) with fallback to legacy anon key
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  client = createBrowserClient(supabaseUrl, publishableKey) as unknown as SupabaseClient<Database>;
  return client;
}
