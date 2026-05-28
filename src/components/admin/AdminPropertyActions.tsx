'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPropertyActions({
  id,
  slug,
}: {
  id: string;
  slug: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Excluir este imóvel? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Erro ao excluir');
        return;
      }
      toast.success('Imóvel excluído');
      router.refresh();
    } catch {
      toast.error('Erro de conexão');
    }
  };

  const btnClass =
    'flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors touch-manipulation';

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/imoveis/${id}/editar`}
        className={`${btnClass} hover:bg-accent-light hover:text-accent`}
        title="Editar"
      >
        <Pencil size={18} />
      </Link>
      <a
        href={`/imoveis/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnClass} hover:bg-cream-dark hover:text-ink`}
        title="Ver no site"
      >
        <ExternalLink size={18} />
      </a>
      <button
        type="button"
        onClick={handleDelete}
        className={`${btnClass} hover:bg-red-100 hover:text-red-700`}
        title="Excluir"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
