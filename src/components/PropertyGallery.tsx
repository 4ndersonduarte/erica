'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ImageType = { url: string };

export default function PropertyGallery({
  images,
  title,
}: {
  images: ImageType[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const list = images.length ? images : [{ url: '' }];
  const current = list[index];
  const hasMultiple = list.length > 1;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-cream-border bg-cream-dark aspect-[4/3] property-gallery shadow-card">
      {current?.url ? (
        <Image
          src={current.url}
          alt={`${title} - foto ${index + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-ink-subtle text-sm font-medium">
          Sem foto
        </div>
      )}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i === 0 ? list.length - 1 : i - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 hover:bg-white shadow-card border border-cream-border transition-colors"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i === list.length - 1 ? 0 : i + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/95 hover:bg-white shadow-card border border-cream-border transition-colors"
            aria-label="Próxima foto"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'}`}
                aria-label={`Ir para foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
