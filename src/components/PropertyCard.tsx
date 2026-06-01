'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatPrice, PROPERTY_PURPOSE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { Bed, Bath, Car, Square, ArrowUpRight, Heart, Share2 } from 'lucide-react';

type Property = {
  id: string;
  code: string;
  slug: string;
  title: string;
  type: string;
  topic?: string;
  purpose: string;
  value: number;
  city: string;
  neighborhood: string;
  rooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  images: { url: string }[];
};

type Props = { property: Property; hrefOverride?: string };

export default function PropertyCard({ property, hrefOverride }: Props) {
  const imageUrl = property.images?.[0]?.url;
  const href = hrefOverride ?? `/imoveis/${property.slug}`;
  const favoriteKey = `favorite-property-${property.id}`;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(localStorage.getItem(favoriteKey) === '1');
  }, [favoriteKey]);

  const toggleFavorite = () => {
    const next = !favorite;
    setFavorite(next);
    if (next) localStorage.setItem(favoriteKey, '1');
    else localStorage.removeItem(favoriteKey);
  };

  const shareProperty = async () => {
    const url = `${window.location.origin}${href}`;
    const title = `${property.code} - ${property.title}`;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <article className="group overflow-hidden rounded-lg border border-cream-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-card-hover">
      <div className="flex items-center justify-between gap-2 border-b border-cream-border bg-white px-3 py-2">
        <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
          Cód. {property.code}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={shareProperty}
            className="rounded-full p-2 text-ink-muted transition-colors hover:bg-cream-dark hover:text-ink"
            aria-label="Compartilhar imóvel"
            title="Compartilhar"
          >
            <Share2 size={17} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={toggleFavorite}
            className={`rounded-full p-2 transition-colors hover:bg-cream-dark ${
              favorite ? 'text-red-600' : 'text-ink-muted hover:text-ink'
            }`}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            title="Favorito"
          >
            <Heart size={18} strokeWidth={1.7} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-ink-subtle">
              Sem foto
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-sm backdrop-blur">
            {PROPERTY_PURPOSE_LABELS[property.purpose] || property.purpose}
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-ink opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight size={18} strokeWidth={2} />
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
            {PROPERTY_TYPE_LABELS[property.type] || property.type}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {property.neighborhood}, {property.city}
          </p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent" title={property.title}>
            {property.title}
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink-subtle">
            <span className="flex items-center gap-1.5"><Bed size={15} strokeWidth={1.5} /> {property.rooms}</span>
            <span className="flex items-center gap-1.5"><Bath size={15} strokeWidth={1.5} /> {property.bathrooms}</span>
            <span className="flex items-center gap-1.5"><Car size={15} strokeWidth={1.5} /> {property.parking}</span>
            <span className="flex items-center gap-1.5"><Square size={15} strokeWidth={1.5} /> {property.area} m²</span>
          </div>
          <p className="mt-4 border-t border-cream-border pt-4 text-xl font-semibold tracking-tight text-ink">
            {formatPrice(property.value)}
            {property.purpose === 'ALUGUEL' && (
              <span className="text-sm font-normal text-ink-muted">/mês</span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
