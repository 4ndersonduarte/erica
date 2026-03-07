import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, PROPERTY_PURPOSE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { Bed, Bath, Car, Square, ArrowUpRight } from 'lucide-react';

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

  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl overflow-hidden border border-cream-border shadow-card hover:shadow-card-hover hover:border-stone-200 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-cream-dark overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-subtle text-sm font-medium">
            Sem foto
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-wide text-ink uppercase shadow-sm">
          {PROPERTY_PURPOSE_LABELS[property.purpose] || property.purpose}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-ink/90 text-white px-3 py-1.5 text-[11px] font-mono tracking-tight whitespace-nowrap">
          Cód. {property.code}
        </span>
        <span className="absolute bottom-4 right-4 p-2 rounded-full bg-white/90 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight size={18} strokeWidth={2} />
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-accent uppercase">
          {PROPERTY_TYPE_LABELS[property.type] || property.type}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {property.neighborhood}, {property.city}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-ink leading-snug tracking-tight line-clamp-2 group-hover:text-accent transition-colors" title={property.title}>
          {property.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-subtle">
          <span className="flex items-center gap-1.5"><Bed size={15} strokeWidth={1.5} /> {property.rooms}</span>
          <span className="flex items-center gap-1.5"><Bath size={15} strokeWidth={1.5} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1.5"><Car size={15} strokeWidth={1.5} /> {property.parking}</span>
          <span className="flex items-center gap-1.5"><Square size={15} strokeWidth={1.5} /> {property.area} m²</span>
        </div>
        <p className="mt-4 pt-4 border-t border-cream-border text-xl font-semibold tracking-tight text-ink">
          {formatPrice(property.value)}
          {property.purpose === 'ALUGUEL' && (
            <span className="text-sm font-normal text-ink-muted">/mês</span>
          )}
        </p>
      </div>
    </Link>
  );
}
