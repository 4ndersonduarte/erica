import { createClient } from '@/lib/supabase/server';
import { apiSuccess } from '@/lib/api-response';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = apiSuccess({ ok: true });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
