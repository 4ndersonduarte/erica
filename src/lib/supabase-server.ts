import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

/** Cliente Supabase para uso no servidor (ex: login via RPC). */
export function getSupabaseAdmin() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}
