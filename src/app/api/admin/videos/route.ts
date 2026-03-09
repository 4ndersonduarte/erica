import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    const videos = await prisma.homeVideo.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return apiSuccess(videos);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    return apiError('Erro ao listar vídeos', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const url = body?.url;
    const title = body?.title?.trim() || null;
    const order = typeof body?.order === 'number' ? body.order : 0;

    if (!url || typeof url !== 'string') {
      return apiError('URL do vídeo é obrigatória', 400);
    }

    const video = await prisma.homeVideo.create({
      data: { url, title, order },
    });
    return apiSuccess(video, 201);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao cadastrar vídeo', 500);
  }
}
