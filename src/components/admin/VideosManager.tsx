'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';

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
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl bg-white border border-dark-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900 mb-4">Adicionar vídeo</h2>
        <p className="text-sm text-dark-600 mb-4">MP4 ou WebM, até 80MB. O vídeo aparecerá na home em &quot;Vídeos de apresentação&quot;.</p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-dark-700 mb-1">Título (opcional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Tour pelo imóvel"
              className="w-full rounded-xl border border-dark-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <label className="inline-flex items-center gap-2 rounded-xl bg-primary-500 text-white px-5 py-3 font-semibold hover:bg-primary-600 transition cursor-pointer disabled:opacity-50">
            <Upload size={20} />
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

      <div className="rounded-2xl bg-white border border-dark-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900 mb-4">Vídeos na home</h2>
        {videos.length === 0 ? (
          <p className="text-dark-500">Nenhum vídeo ainda. Adicione um acima.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <li key={v.id} className="rounded-xl border border-dark-200 overflow-hidden bg-dark-50">
                <div className="aspect-video bg-black">
                  <video src={v.url} controls className="w-full h-full object-contain" preload="metadata" />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-dark-800 truncate">{v.title || 'Sem título'}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
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
