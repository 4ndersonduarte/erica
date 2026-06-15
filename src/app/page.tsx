import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import HomeVideoCarousel from '@/components/HomeVideoCarousel';
import { ArrowRight, Megaphone, MessageCircle, User } from 'lucide-react';
import { listHomeVideos, listProperties } from '@/lib/supabase-data';

export const dynamic = 'force-dynamic';

const whatsappErica = process.env.NEXT_PUBLIC_WHATSAPP_ERICA ?? '5538984212207';
const whatsappTerraBoa =
  process.env.NEXT_PUBLIC_WHATSAPP_TERRA_BOA ||
  process.env.NEXT_PUBLIC_WHATSAPP ||
  '5538984212207';

function cleanWa(n: string) {
  return n.replace(/\D/g, '');
}

const msgErica = encodeURIComponent(
  'Olá! Vim pelo site da Aritana e gostaria de mais informações.'
);

async function getHomeProperties() {
  try {
    const items = await Promise.race([
      listProperties({
        status: 'AVAILABLE',
        pageSize: 1000,
        sort: 'recent',
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      ),
    ]);
    return { items: items.items };
  } catch {
    return { items: [] };
  }
}

async function getHomeVideos() {
  try {
    return await listHomeVideos();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [{ items: properties }, videos] = await Promise.all([
    getHomeProperties(),
    getHomeVideos(),
  ]);

  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-[78vh] flex-col justify-end overflow-hidden pb-8 pt-24 sm:min-h-[82vh] sm:pb-16 sm:pt-32">
          <div className="absolute inset-0">
            <Image
              src="/hero-chacara.jpg"
              alt="Chácara com lago, casa e ampla área verde"
              fill
              className="object-cover object-[center_58%]"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/15" />
          </div>
          <div className="container-custom relative z-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/75 sm:text-sm">
              Aritana Terra Boa · Soluções Imobiliárias
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white text-balance sm:text-display">
              Encontre o imóvel ideal para cada momento
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Casas, terrenos, chácaras e fazendas selecionadas para morar,
              investir ou realizar novos projetos.
            </p>
            <div className="mt-8 max-w-4xl sm:mt-10">
              <div className="rounded-lg border border-white/25 bg-white/95 p-3 shadow-elevated backdrop-blur-md sm:p-4">
                <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-white/50" />}>
                  <SearchForm compact />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {videos.length > 0 && (
          <section className="border-y border-cream-border bg-white py-14 sm:py-20">
            <div className="container-custom">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
                Vídeos
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Conheça nossos imóveis
              </h2>
              <p className="mt-2 max-w-lg text-ink-muted">
                Vídeos de apresentação com detalhes dos imóveis e da região.
              </p>
              <HomeVideoCarousel videos={videos} />
            </div>
          </section>
        )}

        <section className="bg-cream py-16 sm:py-24">
          <div className="container-custom">
            <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
                  Imóveis
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Todos os imóveis disponíveis
                </h2>
                <p className="mt-2 max-w-lg text-ink-muted">
                  Confira as oportunidades cadastradas no site.
                </p>
              </div>
              <Link
                href="/imoveis"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                Ver página de imóveis
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {properties.map((p: Record<string, unknown>) => (
                <PropertyCard
                  key={String(p.id)}
                  property={p as Parameters<typeof PropertyCard>[0]['property']}
                />
              ))}
            </div>
            {properties.length === 0 && (
              <p className="py-8 text-center text-ink-muted">
                Nenhum imóvel disponível no momento.{' '}
                <Link href="/imoveis" className="font-medium text-accent hover:underline">
                  Ver página de imóveis
                </Link>{' '}
                ou cadastre no painel admin.
              </p>
            )}
          </div>
        </section>

        <section id="porque-terra-boa" className="border-y border-cream-border bg-white py-16 sm:py-24">
          <div className="container-custom">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
              Por que nos escolher
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Por que escolher a Aritana?
            </h2>
            <ul className="mt-8 grid max-w-3xl list-none gap-3 sm:grid-cols-2">
              {[
                'Atendimento personalizado',
                'Oportunidades selecionadas',
                'Segurança na negociação',
                'Conhecimento do mercado local',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-cream-border bg-cream/40 p-4 leading-relaxed text-ink-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-cream py-16 sm:py-24">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Não encontrou o imóvel que procura?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">
              Nossa equipe pode te ajudar a encontrar a melhor oportunidade.
            </p>
            <div className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-wrap sm:justify-center">
              <a
                href={`https://wa.me/${cleanWa(whatsappErica)}?text=${msgErica}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                WhatsApp
              </a>
              <a
                href={`https://wa.me/${cleanWa(whatsappTerraBoa)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink-light"
              >
                <User size={22} strokeWidth={1.5} />
                Falar com corretor
              </a>
              <Link
                href="/anunciar-imovel"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-accent px-6 py-4 text-sm font-semibold text-accent transition-colors hover:bg-accent-light"
              >
                <Megaphone size={22} strokeWidth={1.5} />
                Anunciar meu imóvel
              </Link>
            </div>
          </div>
        </section>

        <section id="sobre" className="border-y border-cream-border bg-white py-16 sm:py-24">
          <div className="container-custom">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
              Sobre
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Sobre a Aritana
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              <p>
                A Aritana conecta pessoas às melhores oportunidades do mercado
                imobiliário, reunindo opções urbanas e rurais para diferentes objetivos.
              </p>
              <p>
                Trabalhamos com dedicação para oferecer imóveis que atendam às
                necessidades de quem deseja comprar, vender, alugar ou investir
                com segurança e tranquilidade.
              </p>
              <p>
                Nosso compromisso é proporcionar um atendimento transparente,
                responsável e próximo, ajudando cada cliente a encontrar o
                imóvel ideal ou realizar um bom negócio.
              </p>
              <p>
                Com conhecimento do mercado e atenção aos detalhes, buscamos
                sempre apresentar oportunidades reais e imóveis selecionados,
                garantindo mais confiança em cada negociação.
              </p>
            </div>
          </div>
        </section>

        <section id="contato" className="bg-ink py-16 sm:py-24">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Fale conosco
            </h2>
            <p className="mx-auto mt-4 max-w-md text-stone-400">
              Tire dúvidas ou agende uma visita pelo WhatsApp.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:justify-center">
              <a
                href={`https://wa.me/${cleanWa(whatsappErica)}?text=${msgErica}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                WhatsApp (Erica)
              </a>
              <a
                href={`https://wa.me/${cleanWa(whatsappTerraBoa)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
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
