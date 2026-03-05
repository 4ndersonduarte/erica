import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { MOCK_PROPERTIES } from '@/lib/mock-properties';

export const dynamic = 'force-dynamic';

async function getFeaturedProperties() {
  try {
    const items = await Promise.race([
      prisma.property.findMany({
        where: { featured: true, status: 'AVAILABLE' },
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      ),
    ]);
    return { items };
  } catch {
    return { items: [] };
  }
}

export default async function HomePage() {
  const { items: featured } = await getFeaturedProperties();
  const displayItems = featured.length > 0 ? featured : MOCK_PROPERTIES;
  const isMock = featured.length === 0;

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || '5511999999999';

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[85vh] flex flex-col justify-end pb-20 pt-24 sm:pt-32">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-ink/50" />
          </div>
          <div className="container-custom relative z-10">
            <p className="text-sm font-semibold tracking-wide text-white/80 uppercase mb-4">
              Imobiliária de confiança
            </p>
            <h1 className="text-hero sm:text-display font-bold text-white tracking-tight max-w-3xl text-balance">
              Encontre o imóvel ideal para você
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl leading-relaxed">
              Casas, apartamentos e terrenos para venda e aluguel. Atendimento personalizado e transparência.
            </p>
            <div className="mt-10 max-w-4xl">
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 sm:p-5 shadow-elevated border border-white/20">
                <Suspense fallback={<div className="h-12 rounded-xl bg-white/50 animate-pulse" />}>
                  <SearchForm compact />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Destaques / Exemplos */}
        <section className="py-20 sm:py-28 bg-cream">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <p className="text-sm font-semibold tracking-wide text-accent uppercase">
                  {isMock ? 'Exemplos' : 'Destaques'}
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                  {isMock ? 'Imóveis de exemplo' : 'Imóveis em destaque'}
                </h2>
                <p className="mt-2 text-ink-muted max-w-lg">
                  {isMock
                    ? 'Confira nossa seleção de imóveis para ter uma ideia do que oferecemos.'
                    : 'Confira nossa seleção especial de imóveis.'}
                </p>
              </div>
              <Link
                href="/imoveis"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors group"
              >
                Ver todos
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayItems.slice(0, 6).map((p: Record<string, unknown>) => (
                <PropertyCard
                  key={String(p.id)}
                  property={p as Parameters<typeof PropertyCard>[0]['property']}
                  hrefOverride={isMock ? '/imoveis' : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Sobre */}
        <section id="sobre" className="py-20 sm:py-28 bg-white border-y border-cream-border">
          <div className="container-custom">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-wide text-accent uppercase">Sobre</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Atendimento personalizado
              </h2>
              <p className="mt-6 text-ink-muted leading-relaxed text-lg">
                Com anos de experiência no mercado imobiliário, ofereço um atendimento focado em você
                para encontrar o imóvel ideal, seja para venda ou aluguel. Trabalho com transparência
                e dedicação para realizar o seu objetivo.
              </p>
            </div>
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="py-20 sm:py-28 bg-ink">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Fale conosco
            </h2>
            <p className="mt-4 text-stone-400 max-w-md mx-auto">
              Tire dúvidas ou agende uma visita pelo WhatsApp.
            </p>
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white text-ink px-8 py-4 text-sm font-semibold hover:bg-cream transition-colors"
            >
              <MessageCircle size={22} strokeWidth={1.5} />
              Chamar no WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
