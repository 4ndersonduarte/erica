'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
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

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/imoveis/${id}/editar`}
        className="p-2 rounded-lg text-dark-600 hover:bg-primary-100 hover:text-primary-800"
        title="Editar"
      >
        <Pencil size={18} />
      </Link>
      <a
        href={`/imoveis/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg text-dark-600 hover:bg-dark-100"
        title="Ver no site"
      >
        <ExternalLink size={18} />
      </a>
      <button
        type="button"
        onClick={handleDelete}
        className="p-2 rounded-lg text-dark-600 hover:bg-red-100 hover:text-red-700"
        title="Excluir"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
