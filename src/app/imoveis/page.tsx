import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import ListagemClient from './ListagemClient';
import { getPublicPropertiesList } from '@/lib/property-queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imóveis',
  description: 'Lista de imóveis para venda e aluguel. Filtre por cidade, bairro, valor e mais.',
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function ImoveisPage({ searchParams }: Props) {
  const params = await searchParams;
  let data: Awaited<ReturnType<typeof getPublicPropertiesList>>;
  try {
    data = await getPublicPropertiesList({
      purpose: params.purpose,
      city: params.city,
      neighborhood: params.neighborhood,
      minValue: params.minValue,
      maxValue: params.maxValue,
      rooms: params.rooms,
      bathrooms: params.bathrooms,
      parking: params.parking,
      sort: params.sort,
      page: params.page,
    });
  } catch {
    data = { items: [], total: 0, page: 1, totalPages: 0 };
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="container-custom py-12 sm:py-16">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">Catálogo</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Imóveis
          </h1>
          <p className="mt-2 text-ink-muted max-w-lg">
            Encontre o imóvel ideal com nossos filtros.
          </p>

          <Suspense fallback={<div className="mt-8 h-20 bg-cream-dark rounded-2xl animate-pulse" />}>
            <ListagemClient initialData={data} />
          </Suspense>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.items.map((p: Record<string, unknown>) => (
              <PropertyCard
                key={String(p.id)}
                property={p as Parameters<typeof PropertyCard>[0]['property']}
              />
            ))}
          </div>

          {data.items.length === 0 && (
            <p className="mt-16 text-center text-ink-muted">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
