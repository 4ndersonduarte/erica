import { listHomeVideos } from '@/lib/supabase-data';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const videos = await listHomeVideos();
    return apiSuccess(videos);
  } catch {
    return apiError('Erro ao carregar vídeos', 500);
  }
}
