import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    await prisma.homeVideo.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    return apiError('Erro ao excluir vídeo', 500);
  }
}
