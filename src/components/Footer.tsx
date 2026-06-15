import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

const INSTAGRAM_USER = 'ericaviana.imoveis_';
const instagramUrl = `https://instagram.com/${INSTAGRAM_USER}`;

export default function Footer() {
  return (
    <footer className="border-t border-cream-border">
      <div className="bg-white py-12">
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">Em parceria com</p>
          <div className="mt-5 flex flex-wrap items-center gap-8 sm:gap-12">
            <Image src="/logo-erica-viana.png" alt="Erica Viana Corretora de Imóveis" width={900} height={521} className="h-16 w-auto object-contain sm:h-20" />
            <Image src="/logo-terra-boa.png" alt="Terra Boa Soluções Imobiliárias" width={1000} height={868} className="h-20 w-auto object-contain sm:h-24" />
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream-border p-2.5 text-ink-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="Instagram"
            >
              <Instagram size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-ink text-cream">
        <div className="container-custom py-10">
          <div className="flex flex-wrap gap-4 text-sm text-stone-400">
            <Link href="/anunciar-imovel" className="transition-colors hover:text-white">
              Anunciar imóvel
            </Link>
            <Link href="/politica-de-privacidade" className="transition-colors hover:text-white">
              Política de privacidade
            </Link>
          </div>
          <div className="mt-8 border-t border-stone-800 pt-8 text-center text-sm text-stone-500">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
