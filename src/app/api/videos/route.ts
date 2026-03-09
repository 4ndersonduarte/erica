import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const videos = await prisma.homeVideo.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return apiSuccess(videos);
  } catch {
    return apiError('Erro ao carregar vídeos', 500);
  }
}
