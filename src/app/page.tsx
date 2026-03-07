import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import { MessageCircle, ArrowRight, User, Megaphone } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { MOCK_PROPERTIES } from '@/lib/mock-properties';

export const dynamic = 'force-dynamic';

// Erica: (38) 98421-2207 → 5538984212207 (não usar NEXT_PUBLIC_WHATSAPP genérico para não cair em 11 99999...)
const whatsappErica = process.env.NEXT_PUBLIC_WHATSAPP_ERICA ?? '5538984212207';
const whatsappTerraBoa = process.env.NEXT_PUBLIC_WHATSAPP_TERRA_BOA || process.env.NEXT_PUBLIC_WHATSAPP || '5538984212207';

function cleanWa(n: string) {
  return n.replace(/\D/g, '');
}
const msgErica = encodeURIComponent('Olá! Vim pelo site da Erica Imóveis e gostaria de mais informações.');

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
              Parceria Erica Imóveis e Terra Boa
            </p>
            <h1 className="text-hero sm:text-display font-bold text-white tracking-tight max-w-3xl text-balance">
              Encontre o imóvel ideal para você
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl leading-relaxed">
              Terrenos, casas, fazendas e chácaras. Atendimento personalizado e transparência.
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

        {/* Por que escolher a Imobiliária Terra Boa? */}
        <section id="porque-terra-boa" className="py-20 sm:py-28 bg-white border-y border-cream-border">
          <div className="container-custom">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">Por que nos escolher</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Por que escolher a Imobiliária Terra Boa?
            </h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl list-none">
              <li className="flex items-start gap-3 text-ink-muted leading-relaxed">
                <span className="text-accent font-bold">•</span>
                Atendimento personalizado
              </li>
              <li className="flex items-start gap-3 text-ink-muted leading-relaxed">
                <span className="text-accent font-bold">•</span>
                Oportunidades selecionadas
              </li>
              <li className="flex items-start gap-3 text-ink-muted leading-relaxed">
                <span className="text-accent font-bold">•</span>
                Segurança na negociação
              </li>
              <li className="flex items-start gap-3 text-ink-muted leading-relaxed">
                <span className="text-accent font-bold">•</span>
                Conhecimento do mercado local
              </li>
            </ul>
          </div>
        </section>

        {/* Não encontrou o imóvel + CTAs */}
        <section className="py-20 sm:py-28 bg-cream">
          <div className="container-custom text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Não encontrou o imóvel que procura?
            </h2>
            <p className="mt-4 text-ink-muted max-w-xl mx-auto">
              Nossa equipe pode te ajudar a encontrar a melhor oportunidade.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/${cleanWa(whatsappErica)}?text=${msgErica}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-6 py-4 text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                WhatsApp
              </a>
              <a
                href={`https://wa.me/${cleanWa(whatsappTerraBoa)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-ink text-white px-6 py-4 text-sm font-semibold hover:bg-ink-light transition-colors"
              >
                <User size={22} strokeWidth={1.5} />
                Falar com corretor
              </a>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-accent text-accent px-6 py-4 text-sm font-semibold hover:bg-accent-light transition-colors"
              >
                <Megaphone size={22} strokeWidth={1.5} />
                Anunciar meu imóvel
              </Link>
            </div>
          </div>
        </section>

        {/* Sobre Terra Boa */}
        <section id="sobre" className="py-20 sm:py-28 bg-white border-y border-cream-border">
          <div className="container-custom">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">Sobre</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Sobre a Imobiliária Terra Boa
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-ink-muted leading-relaxed text-lg">
              <p>
                A Imobiliária Terra Boa nasceu com o propósito de conectar pessoas às melhores oportunidades do mercado imobiliário.
              </p>
              <p>
                Trabalhamos com dedicação para oferecer imóveis que atendam às necessidades de quem deseja comprar, vender, alugar ou investir com segurança e tranquilidade.
              </p>
              <p>
                Nosso compromisso é proporcionar um atendimento transparente, responsável e próximo, ajudando cada cliente a encontrar o imóvel ideal ou realizar um bom negócio.
              </p>
              <p>
                Com conhecimento do mercado e atenção aos detalhes, buscamos sempre apresentar oportunidades reais e imóveis selecionados, garantindo mais confiança em cada negociação.
              </p>
              <p>
                Seja para morar, investir ou vender seu imóvel, a Imobiliária Terra Boa está pronta para ajudar você a dar o próximo passo com segurança.
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
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/${cleanWa(whatsappErica)}?text=${msgErica}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-ink px-6 py-4 text-sm font-semibold hover:bg-cream transition-colors"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                WhatsApp (Erica)
              </a>
              <a
                href={`https://wa.me/${cleanWa(whatsappTerraBoa)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent text-white px-6 py-4 text-sm font-semibold hover:bg-accent-hover transition-colors"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                WhatsApp (Terra Boa)
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
