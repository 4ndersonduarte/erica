import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export type AuthRole = 'admin' | 'user';

export interface AuthSession {
  sub: string;
  email: string;
  role: AuthRole;
  user: User;
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getRole(user: User): AuthRole {
  const metadataRole = user.app_metadata?.role;
  const isMetadataAdmin =
    metadataRole === 'admin' || user.app_metadata?.is_admin === true;
  const isAllowlistedAdmin =
    !!user.email && getAdminEmails().includes(user.email.toLowerCase());

  return isMetadataAdmin || isAllowlistedAdmin ? 'admin' : 'user';
}

export async function getSession(): Promise<AuthSession | null> {
  let user: User | null = null;
  let error: unknown = null;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
    error = result.error;
  } catch (err) {
    error = err;
  }

  if (error || !user || !user.email) return null;

  return {
    sub: user.id,
    email: user.email,
    role: getRole(user),
    user,
  };
}

/** Exige login; se adminOnly, so administradores acessam. */
export async function requireAuth(adminOnly = true): Promise<AuthSession> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  if (adminOnly && session.role !== 'admin') throw new Error('Unauthorized');
  return session;
}
