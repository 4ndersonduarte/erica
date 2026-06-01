import { requireAuth } from '@/lib/auth';
import { listListingSubmissions } from '@/lib/supabase-data';
import { apiError, apiSuccess, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    return apiSuccess(await listListingSubmissions());
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao listar anúncios', 500);
  }
}
