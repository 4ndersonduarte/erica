'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

const inputClass =
  'h-12 w-full rounded-lg border border-cream-border bg-white/95 px-4 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10';

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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1.15fr_0.85fr_0.85fr_auto] sm:gap-3">
          <input
            type="text"
            placeholder="Bairro"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Mín. R$"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            min={0}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="Máx. R$"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            min={0}
            className={inputClass}
          />
          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-ink-light"
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-ink-light sm:col-span-2"
        >
          <Search size={18} strokeWidth={2} />
          Buscar
        </button>
      </div>
    </form>
  );
}
