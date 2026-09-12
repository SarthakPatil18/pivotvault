import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ystnxplbfzihigdeturm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only initialize Supabase if we actually have a key.
// An empty key causes createClient() to throw synchronously, which crashes
// the entire React module graph and renders a blank page.
export const supabase = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Sign in using Google OAuth via Supabase
 */
export async function signInWithGoogle() {
  if (!supabase) {
    console.warn('[Supabase] VITE_SUPABASE_ANON_KEY is not configured. Set it in frontend/.env to enable live auth.');
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_ANON_KEY in frontend/.env');
  }

  const redirectTo = `${window.location.origin}/app`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithEmail(email, password) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_ANON_KEY in frontend/.env');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign up with Email & Password
 */
export async function signUpWithEmail(email, password) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_ANON_KEY in frontend/.env');
  }
  const redirectTo = `${window.location.origin}/app`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}
