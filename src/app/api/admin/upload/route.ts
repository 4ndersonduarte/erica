import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const BUCKET = 'images';
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !file.size) {
      return apiError('Nenhum arquivo enviado', 400);
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return apiError('Tipo de arquivo nao permitido. Use JPEG, PNG ou WebP.', 400);
    }
    if (file.size > 5 * 1024 * 1024) {
      return apiError('Arquivo muito grande. Maximo 5MB.', 400);
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createClient();
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const bytes = await file.arrayBuffer();
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, bytes, { contentType: file.type, upsert: false });

      if (error) {
        console.error('Supabase storage upload:', error);
        return apiError(error.message || 'Erro no upload', 500);
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      return apiSuccess({ url: urlData.publicUrl }, 201);
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    return apiSuccess({ url: `/uploads/${filename}` }, 201);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro no upload', 500);
  }
}
