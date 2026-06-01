'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2, Upload } from 'lucide-react';

type Video = { id: string; url: string; title: string | null; order: number };

export default function VideosManager({ initialVideos }: { initialVideos: Video[] }) {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch('/api/admin/upload/video', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Erro no upload');

      const createRes = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadData.url, title: title.trim() || null, order: videos.length }),
        credentials: 'include',
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || 'Erro ao salvar');

      setVideos((prev) => [...prev, createData]);
      setTitle('');
      toast.success('Vídeo adicionado!');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este vídeo?')) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Erro ao excluir');
      setVideos((prev) => prev.filter((v) => v.id !== id));
      toast.success('Vídeo excluído');
      router.refresh();
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-lg border border-cream-border bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Adicionar vídeo</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          MP4 ou WebM, até 80 MB. O vídeo aparecerá na home em &quot;Vídeos de apresentação&quot;.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto] sm:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-muted">Título (opcional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Tour pelo imóvel"
              className="h-12 w-full rounded-lg border border-cream-border bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </div>
          <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-light">
            <Upload size={18} strokeWidth={1.8} />
            {uploading ? 'Enviando...' : 'Enviar vídeo'}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-cream-border bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Vídeos na home</h2>
        {videos.length === 0 ? (
          <p className="mt-4 text-ink-muted">Nenhum vídeo ainda. Adicione um acima.</p>
        ) : (
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.id} className="overflow-hidden rounded-lg border border-cream-border bg-cream">
                <div className="aspect-video bg-black">
                  <video src={v.url} controls className="h-full w-full object-contain" preload="metadata" />
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="truncate text-sm font-medium text-ink">{v.title || 'Sem título'}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
