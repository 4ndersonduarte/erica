'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Video = { id: string; url: string; title: string | null; order: number };

export default function HomeVideoCarousel({ videos }: { videos: Video[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [videos.length]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (videos.length === 0) return null;

  return (
    <div className="relative mt-8">
      <div
        ref={scrollRef}
        className="video-carousel-scroll flex gap-4 sm:gap-6 overflow-x-scroll overflow-y-hidden pb-4 scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {videos.map((v) => (
          <div
            key={v.id}
            className="relative flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-cream-border bg-black shadow-card snap-center"
          >
            <div className="aspect-[9/16] w-full bg-black">
              <video
                src={v.url}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
                playsInline
                title={v.title ?? 'Vídeo'}
              />
            </div>
            {v.title && (
              <p className="absolute bottom-0 left-0 right-0 p-3 text-sm font-medium text-white bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                {v.title}
              </p>
            )}
          </div>
        ))}
      </div>

      {videos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Vídeos anteriores"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:translate-x-0 z-10 w-12 h-12 rounded-full bg-white/95 shadow-lg border border-cream-border flex items-center justify-center transition opacity hover:bg-white ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={24} className="text-ink" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Próximos vídeos"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-0 z-10 w-12 h-12 rounded-full bg-white/95 shadow-lg border border-cream-border flex items-center justify-center transition opacity hover:bg-white ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={24} className="text-ink" />
          </button>
        </>
      )}

      {videos.length > 1 && (
        <p className="mt-3 text-center text-sm text-ink-subtle">
          Arraste para os lados ou use as setas para ver mais vídeos
        </p>
      )}
    </div>
  );
}
