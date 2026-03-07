import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyGallery from '@/components/PropertyGallery';
import {
  formatPrice,
  PROPERTY_TYPE_LABELS,
  PROPERTY_PURPOSE_LABELS,
} from '@/lib/utils';
import { Bed, Bath, Car, Square, MapPin, MessageCircle, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const dynamic = 'force-dynamic';

async function getProperty(slug: string) {
  try {
    return await prisma.property.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: 'Imóvel não encontrado' };
  const title = `${property.title} | ${property.code}`;
  const description = property.description?.slice(0, 160) || `${property.type} em ${property.neighborhood}, ${property.city}. ${formatPrice(property.value)}`;
  const image = property.images?.[0]?.url ? `${base}${property.images[0].url}` : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const whatsappErica = process.env.NEXT_PUBLIC_WHATSAPP_ERICA ?? '5538984212207';
  const whatsappTerraBoa = process.env.NEXT_PUBLIC_WHATSAPP_TERRA_BOA || process.env.NEXT_PUBLIC_WHATSAPP || '5538984212207';
  const msg = encodeURIComponent(
    `Olá! Tenho interesse no imóvel ${property.code} - ${property.title}`
  );
  const clean = (n: string) => n.replace(/\D/g, '');
  const whatsappUrlErica = `https://wa.me/${clean(whatsappErica)}?text=${msg}`;
  const whatsappUrlTerraBoa = `https://wa.me/${clean(whatsappTerraBoa)}?text=${msg}`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="container-custom py-8 sm:py-12">
          <nav className="flex items-center gap-2 text-sm text-ink-muted mb-8">
            <Link href="/imoveis" className="hover:text-accent transition-colors flex items-center gap-1">
              <ArrowLeft size={16} />
              Imóveis
            </Link>
            <span>/</span>
            <span className="text-ink line-clamp-1">{property.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-2">
              <PropertyGallery images={property.images || []} title={property.title} />
            </div>

            <div className="lg:pl-2">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                {PROPERTY_PURPOSE_LABELS[property.purpose]} · {PROPERTY_TYPE_LABELS[property.type]}
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                {property.title}
              </h1>
              <p className="mt-2 text-sm text-ink-muted font-mono">{property.code}</p>
              <p className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                {formatPrice(property.value)}
                {property.purpose === 'ALUGUEL' && (
                  <span className="text-base font-normal text-ink-muted">/mês</span>
                )}
              </p>

              <div className="mt-8 flex flex-wrap gap-6 text-ink-muted">
                <span className="flex items-center gap-2"><Bed size={20} strokeWidth={1.5} /> {property.rooms} quartos</span>
                <span className="flex items-center gap-2"><Bath size={20} strokeWidth={1.5} /> {property.bathrooms} banheiros</span>
                <span className="flex items-center gap-2"><Car size={20} strokeWidth={1.5} /> {property.parking} vagas</span>
                <span className="flex items-center gap-2"><Square size={20} strokeWidth={1.5} /> {property.area} m²</span>
              </div>

              <div className="mt-8 flex items-start gap-3 text-ink-muted">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-sm leading-relaxed">
                  {property.address}, {property.neighborhood}, {property.city}
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrlErica}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-[#25D366] text-white py-4 font-semibold hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle size={22} strokeWidth={1.5} />
                  WhatsApp (Erica)
                </a>
                <a
                  href={whatsappUrlTerraBoa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 rounded-xl bg-ink text-white py-4 font-semibold hover:bg-ink-light transition-colors"
                >
                  <MessageCircle size={22} strokeWidth={1.5} />
                  WhatsApp (Terra Boa)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-cream-border">
            <h2 className="text-xl font-bold text-ink tracking-tight">Descrição</h2>
            <div className="mt-4 text-ink-muted leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {property.lat != null && property.lng != null && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-ink tracking-tight mb-4">Localização</h2>
              <div className="rounded-2xl overflow-hidden border border-cream-border aspect-video bg-cream-dark">
                <iframe
                  title="Mapa"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.02}%2C${property.lat - 0.02}%2C${property.lng + 0.02}%2C${property.lat + 0.02}&layer=mapnik&marker=${property.lat}%2C${property.lng}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
