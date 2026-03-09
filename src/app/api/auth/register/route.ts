export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        parsed.error.errors[0]?.message ?? 'Dados inválidos',
        400
      );
    }

    const { name, email, password } = parsed.data;
    const nameTrim = name?.trim() || null;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return apiError('Este e-mail já está cadastrado', 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: nameTrim,
      },
    });

    return apiSuccess({ message: 'Conta criada. Faça login para continuar.' }, 201);
  } catch (error: unknown) {
    console.error('Register error:', error);
    const err = error as Error & { code?: string };
    const msg = err?.message ?? String(error);
    if (msg.includes('Unique constraint') || msg.includes('unique') || msg?.code === 'P2002' || msg.includes('duplicate')) {
      return apiError('Este e-mail já está cadastrado', 400);
    }
    if (msg.includes('permission') || msg.includes('Policy') || msg.includes('row-level') || msg.includes('violates row-level security')) {
      return apiError('Sem permissão para criar conta. Tente novamente mais tarde.', 403);
    }
    // Em desenvolvimento, retorna a mensagem real para debug
    const devMsg = process.env.NODE_ENV === 'development'
      ? msg
      : 'Erro ao cadastrar. Tente novamente.';
    return apiError(devMsg, 500);
  }
}
