import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret';

export type AuthRole = 'admin' | 'user';

export interface JWTPayload {
  sub: string;
  email: string;
  role?: AuthRole;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'> & { role?: AuthRole }): string {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Exige login; se adminOnly, só administradores acessam (role === 'user' bloqueado). */
export async function requireAuth(adminOnly = true): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  if (adminOnly && session.role === 'user') throw new Error('Unauthorized');
  return session;
}
