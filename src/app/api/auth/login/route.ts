export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message ?? 'Dados inválidos',
        400
      );
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return apiError('E-mail ou senha incorretos', 401);
    }

    const session = await getSession();
    return apiSuccess({
      email: session?.email ?? email,
      role: session?.role ?? 'user',
    });
  } catch (error) {
    console.error('Login error:', error);
    return apiError('Erro ao fazer login', 500);
  }
}
