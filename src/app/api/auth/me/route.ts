import { getSession } from '@/lib/auth';
import { apiSuccess, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return apiUnauthorized();
  return apiSuccess({ email: session.email });
}
