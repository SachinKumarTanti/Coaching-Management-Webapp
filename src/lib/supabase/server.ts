import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient, SupabaseClient, User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Database } from '@/types/database.types';
import { Profile } from '@/types';

export function createClient(): SupabaseClient<Database> {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Supports new Supabase Publishable Key (sb_publishable_...) with fallback to legacy anon key
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createServerClient(
    supabaseUrl,
    publishableKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Can occur in Server Components where cookies cannot be set directly
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Can occur in Server Components
          }
        },
      },
    }
  ) as unknown as SupabaseClient<Database>;
}

/**
 * Creates a public client that does NOT read cookies.
 * This allows Server Components rendering public content (e.g. homepage, courses, announcements)
 * to be statically prerendered and cached with ISR rather than forced into dynamic SSR.
 */
export function createPublicClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return createSupabaseClient<Database>(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Request-cached retrieval of current user.
 * Deduplicates multiple getUser() calls across layout and pages in a single request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
});

/**
 * Request-cached retrieval of a user's profile.
 * Deduplicates profile queries across layouts and child components.
 */
export const getCurrentProfile = cache(async (userId: string): Promise<Profile | null> => {
  try {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return profile;
  } catch {
    return null;
  }
});
