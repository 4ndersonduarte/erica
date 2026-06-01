import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

const INSTAGRAM_USER = 'ericaviana.imoveis_';
const instagramUrl = `https://instagram.com/${INSTAGRAM_USER}`;

export default function Footer() {
  return (
    <footer className="border-t border-cream-border bg-ink text-cream">
      <div className="container-custom py-16">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <Link href="/" className="inline-block">
              <Image src="/erica.png" alt="Erica Imóveis" width={324} height={103} className="h-[97px] w-auto object-contain brightness-0 invert opacity-95" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-400">
              Parceria Erica Imóveis e Terra Boa — atendimento personalizado para encontrar o imóvel ideal.
            </p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-stone-600 p-2.5 text-stone-400 transition-colors hover:border-stone-500 hover:text-white"
            aria-label="Instagram"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm text-stone-400">
          <Link href="/anunciar-imovel" className="transition-colors hover:text-white">
            Anunciar imóvel
          </Link>
          <Link href="/politica-de-privacidade" className="transition-colors hover:text-white">
            Política de privacidade
          </Link>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
          © {new Date().getFullYear()} Erica Imóveis em parceria com Terra Boa. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
