import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database.types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  // Supports new Supabase Publishable Key (sb_publishable_...) with fallback to legacy anon key
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  // If supabase is not configured yet (e.g. initial setup preview), allow navigation
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return response;
  }

  const path = request.nextUrl.pathname;

  // FAST PATH OPTIMIZATION:
  // Supabase SSR stores auth tokens in cookies with "sb-" prefix and "-auth-token" suffix.
  // If no auth cookie exists, we can immediately handle public & protected routes
  // without paying the 150-400ms external network call penalty to Supabase Auth API.
  const hasAuthCookie = request.cookies.getAll().some(
    (cookie) => cookie.name.includes('-auth-token') || cookie.name.startsWith('sb-')
  );

  if (!hasAuthCookie) {
    // 1. Unauthenticated users trying to access protected routes -> redirect immediately
    if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', path);
      return NextResponse.redirect(url);
    }

    // 2. Public and unauthenticated auth routes -> proceed with 0ms network latency
    return response;
  }

  // User has auth cookies: Initialize SSR client to validate / refresh session
  const supabase = createServerClient(
    supabaseUrl,
    publishableKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  ) as unknown as SupabaseClient<Database>;

  const { data: { user } } = await supabase.auth.getUser();

  // If cookie was expired/invalidated
  if (!user) {
    if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', path);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Protect Admin routes
  if (path.startsWith('/admin')) {
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages
  if (path === '/login' || path === '/register') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = profile?.role === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}
