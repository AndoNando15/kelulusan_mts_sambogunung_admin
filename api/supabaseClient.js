// supabaseClient.js – initialize Supabase client for server-side functions
// supabaseClient.js – initialize Supabase client for front‑end usage with Vite env variables
import { createClient } from '@supabase/supabase-js';

// Vite exposes env variables prefixed with VITE_ at build time
const SUPABASE_URL = import.meta.env.VITE_SUPERBASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPERBASE_ANON_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Supabase URL or Anon Key not set in environment variables (VITE_SUPERBASE_URL / VITE_SUPERBASE_ANON_KEY)');
}

// Create a Supabase client instance for client‑side operations
export const supabase = createClient(SUPABASE_URL, ANON_KEY);
