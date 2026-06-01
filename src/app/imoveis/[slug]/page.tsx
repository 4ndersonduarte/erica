import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyGallery from '@/components/PropertyGallery';
import PropertyInquiryForm from '@/components/PropertyInquiryForm';
import {
  formatPrice,
  PROPERTY_TYPE_LABELS,
  PROPERTY_PURPOSE_LABELS,
} from '@/lib/utils';
import { Bed, Bath, Car, Square, MapPin, MessageCircle, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getPropertyBySlug } from '@/lib/supabase-data';

const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const dynamic = 'force-dynamic';

function getAbsoluteUrl(url: string) {
  return new URL(url, base).toString();
}

async function getProperty(slug: string) {
  try {
    return await getPropertyBySlug(slug);
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
  const image = property.images?.[0]?.url ? getAbsoluteUrl(property.images[0].url) : undefined;
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
          <nav className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/imoveis" className="hover:text-accent transition-colors flex items-center gap-1">
              <ArrowLeft size={16} />
              Imóveis
            </Link>
            <span>/</span>
            <span className="text-ink line-clamp-1">{property.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <PropertyGallery images={property.images || []} title={property.title} />
            </div>

            <div className="lg:pl-2">
              <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                {PROPERTY_PURPOSE_LABELS[property.purpose]} · {PROPERTY_TYPE_LABELS[property.type]}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {property.title}
              </h1>
              <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink shadow-sm">
                Codigo {property.code}
              </p>
              <p className="mt-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {formatPrice(property.value)}
                {property.purpose === 'ALUGUEL' && (
                  <span className="text-base font-normal text-ink-muted">/mês</span>
                )}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 text-ink-muted sm:flex sm:flex-wrap sm:gap-6">
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

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrlErica}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-4 font-semibold text-white transition-colors hover:bg-[#20bd5a]"
                >
                  <MessageCircle size={22} strokeWidth={1.5} />
                  WhatsApp (Erica)
                </a>
                <a
                  href={whatsappUrlTerraBoa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink py-4 font-semibold text-white transition-colors hover:bg-ink-light"
                >
                  <MessageCircle size={22} strokeWidth={1.5} />
                  WhatsApp (Terra Boa)
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:max-w-3xl">
            <PropertyInquiryForm
              propertyCode={property.code}
              propertyTitle={property.title}
              whatsappNumber={whatsappErica}
            />
          </div>

          <div className="mt-14 border-t border-cream-border pt-10 sm:mt-16 sm:pt-12">
            <h2 className="text-xl font-bold text-ink tracking-tight">Descrição</h2>
            <div className="mt-4 text-ink-muted leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {property.lat != null && property.lng != null && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-ink tracking-tight mb-4">Localização</h2>
              <div className="aspect-video overflow-hidden rounded-lg border border-cream-border bg-cream-dark">
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
