import { getSession } from '@/lib/auth';
import { apiSuccess, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return apiSuccess(null);
    return apiSuccess({ id: session.sub, email: session.email, role: session.role });
  } catch {
    return apiSuccess(null);
  }
}
