import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { listHomeVideos } from '@/lib/supabase-data';
import VideosManager from '@/components/admin/VideosManager';

export default async function AdminVideosPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role === 'user') redirect('/');

  const videos = await listHomeVideos();

  return (
    <div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
          Conteúdo
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Vídeos da home</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Vídeos de apresentação exibidos na página inicial.
        </p>
      </div>
      <VideosManager initialVideos={videos} />
    </div>
  );
}
