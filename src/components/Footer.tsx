import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

const INSTAGRAM_USER = 'ericaviana.imoveis_';
const instagramUrl = `https://instagram.com/${INSTAGRAM_USER}`;

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-cream-border bg-ink text-cream">
      <div className="container-custom py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <Link href="/" className="inline-block">
              <Image src="/erica.png" alt="Erica Imóveis" width={270} height={86} className="h-[81px] w-auto object-contain brightness-0 invert opacity-95" />
            </Link>
            <p className="mt-3 text-sm text-stone-400 max-w-xs leading-relaxed">
              Parceria Erica Imóveis e Terra Boa — atendimento personalizado para encontrar o imóvel ideal.
            </p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full border border-stone-600 text-stone-400 hover:text-white hover:border-stone-500 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
          © {new Date().getFullYear()} Erica Imóveis em parceria com Terra Boa. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
