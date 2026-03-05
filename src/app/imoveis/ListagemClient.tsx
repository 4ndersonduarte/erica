'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import SearchForm from '@/components/SearchForm';

const sortOptions = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
];

type Props = {
  initialData: { total: number; page: number; totalPages: number };
};

export default function ListagemClient({ initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'recent';
  const { page, totalPages, total } = initialData;

  const setSort = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('sort', value);
    next.set('page', '1');
    router.push(`/imoveis?${next.toString()}`);
  };

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('page', String(p));
    router.push(`/imoveis?${next.toString()}`);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-cream-border bg-white p-5 shadow-card">
        <SearchForm />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-ink-muted">
          {total} imóvel{total !== 1 ? 'eis' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-ink-muted">Ordenar:</label>
          <select
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-cream-border bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="rounded-xl border border-cream-border bg-white px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-40 hover:bg-cream-dark transition-colors"
          >
            Anterior
          </button>
          <span className="px-4 text-sm text-ink-muted">
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-xl border border-cream-border bg-white px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-40 hover:bg-cream-dark transition-colors"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
