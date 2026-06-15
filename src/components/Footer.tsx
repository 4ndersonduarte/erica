import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

const INSTAGRAM_USER = 'ericaviana.imoveis_';
const instagramUrl = `https://instagram.com/${INSTAGRAM_USER}`;

export default function Footer() {
  return (
    <footer className="border-t border-cream-border bg-ink text-cream">
      <div className="container-custom py-16">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Em parceria com</p>
          <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-white p-3 shadow-card">
                <Image src="/logo-erica-viana.png" alt="Erica Viana Corretora de Imóveis" width={900} height={521} className="h-16 w-auto object-contain sm:h-20" />
              </div>
              <div className="rounded-xl bg-white p-3 shadow-card">
                <Image src="/logo-terra-boa.png" alt="Terra Boa Soluções Imobiliárias" width={1000} height={868} className="h-20 w-auto object-contain" />
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
          © {new Date().getFullYear()} Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
