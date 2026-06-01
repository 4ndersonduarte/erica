'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

export default function ListingSubmissionActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const send = async (action: 'approve' | 'reject') => {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/listing-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao analisar anúncio');
      toast.success(action === 'approve' ? 'Anúncio aprovado' : 'Anúncio recusado');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao analisar anúncio');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => send('approve')}
        disabled={loading != null}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
      >
        <Check size={16} strokeWidth={1.7} />
        Aprovar
      </button>
      <button
        type="button"
        onClick={() => send('reject')}
        disabled={loading != null}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        <X size={16} strokeWidth={1.7} />
        Recusar
      </button>
    </div>
  );
}
