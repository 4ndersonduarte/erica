export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/validations';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message ?? 'Dados invalidos',
        400
      );
    }

    const { name, email, password } = parsed.data;
    const supabase = await createClient();
    const trimmedName = name?.trim();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: trimmedName ? { name: trimmedName } : undefined,
      },
    });

    if (error?.message.toLowerCase().includes('already registered')) {
      return apiError('Este e-mail ja esta cadastrado', 400);
    }
    if (error) return apiError(error.message, 400);

    return apiSuccess({ message: 'Conta criada. Faca login para continuar.' }, 201);
  } catch (error: unknown) {
    console.error('Register error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const devMsg =
      process.env.NODE_ENV === 'development'
        ? msg
        : 'Erro ao cadastrar. Tente novamente.';
    return apiError(devMsg, 500);
  }
}
