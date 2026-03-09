import { NextRequest } from 'next/server';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
const BUCKET = 'home-videos';

// Crie o bucket "home-videos" no Supabase (Storage → New bucket, público) se ainda não existir.

function getSupabaseStorage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || !file.size) {
      return apiError('Nenhum arquivo enviado', 400);
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return apiError('Use vídeo MP4 ou WebM.', 400);
    }
    const maxSize = 80 * 1024 * 1024; // 80MB
    if (file.size > maxSize) {
      return apiError('Vídeo muito grande. Máximo 80MB.', 400);
    }

    const supabase = getSupabaseStorage();
    if (!supabase) return apiError('Storage não configurado', 500);

    const ext = path.extname(file.name) || '.mp4';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const bytes = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, bytes, { contentType: file.type, upsert: false });

    if (error) {
      console.error('Supabase video upload:', error);
      if (error.message?.includes('Bucket') || error.message?.includes('not found')) {
        return apiError('Crie o bucket "home-videos" no Supabase (Storage → New bucket, público).', 500);
      }
      return apiError(error.message || 'Erro no upload do vídeo', 500);
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return apiSuccess({ url: urlData.publicUrl }, 201);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro no upload', 500);
  }
}
