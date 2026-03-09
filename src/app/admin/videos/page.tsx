import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import VideosManager from '@/components/admin/VideosManager';

export default async function AdminVideosPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role === 'user') redirect('/');

  const videos = await prisma.homeVideo.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Vídeos da home</h1>
          <p className="mt-1 text-dark-600">Vídeos de apresentação exibidos na página inicial</p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            ← Ir para a home do site
          </Link>
        </div>
      </div>
      <VideosManager initialVideos={videos} />
    </div>
  );
}
