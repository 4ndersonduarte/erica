import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const social = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-cream-border bg-ink text-cream">
      <div className="container-custom py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white hover:text-cream-dark transition-colors"
            >
              Erica Imóveis
            </Link>
            <p className="mt-3 text-sm text-stone-400 max-w-xs leading-relaxed">
              Encontre o imóvel dos seus sonhos com atendimento personalizado.
            </p>
          </div>
          <div className="flex gap-3">
            {social.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-stone-600 text-stone-400 hover:text-white hover:border-stone-500 transition-colors"
                aria-label={label}
              >
                <Icon size={18} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-stone-500 text-sm">
          © {new Date().getFullYear()} Erica Imóveis. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
