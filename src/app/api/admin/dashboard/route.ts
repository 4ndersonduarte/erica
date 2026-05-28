import { requireAuth } from '@/lib/auth';
import { getDashboardStats } from '@/lib/supabase-data';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();

    return apiSuccess(await getDashboardStats());
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao carregar dashboard', 500);
  }
}
