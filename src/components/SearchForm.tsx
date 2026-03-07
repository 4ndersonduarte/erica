'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-cream-border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-shadow';

export default function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') || '');
  const [minValue, setMinValue] = useState(searchParams.get('minValue') || '');
  const [maxValue, setMaxValue] = useState(searchParams.get('maxValue') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (neighborhood) params.set('neighborhood', neighborhood);
    if (minValue) params.set('minValue', minValue);
    if (maxValue) params.set('maxValue', maxValue);
    router.push(`/imoveis?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Bairro"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={`${inputClass} sm:w-36`}
          />
          <input
            type="number"
            placeholder="Mín. R$"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            min={0}
            className={`${inputClass} sm:w-28`}
          />
          <input
            type="number"
            placeholder="Máx. R$"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            min={0}
            className={`${inputClass} sm:w-28`}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-ink text-white px-6 py-3 text-sm font-semibold hover:bg-ink-light transition-colors"
          >
            <Search size={18} strokeWidth={2} />
            Buscar
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Bairro"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Valor mín. (R$)"
          value={minValue}
          onChange={(e) => setMinValue(e.target.value)}
          min={0}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Valor máx. (R$)"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          min={0}
          className={inputClass}
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-ink text-white px-6 py-3 text-sm font-semibold hover:bg-ink-light transition-colors sm:col-span-2"
        >
          <Search size={18} strokeWidth={2} />
          Buscar
        </button>
      </div>
    </form>
  );
}
