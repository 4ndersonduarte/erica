import { apiSuccess } from '@/lib/api-response';

export async function POST() {
  const response = apiSuccess({ ok: true });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
