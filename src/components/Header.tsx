'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navMain = [
  { href: '/', label: 'Início' },
  { href: '/imoveis', label: 'Imóveis' },
  { href: '/#porque-terra-boa', label: 'Por que Terra Boa' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#contato', label: 'Contato' },
];

const topicos = [
  { href: '/imoveis?tipo=TERRENOS', label: 'Terrenos' },
  { href: '/imoveis?tipo=CASAS', label: 'Casas' },
  { href: '/imoveis?tipo=FAZENDAS', label: 'Fazendas' },
  { href: '/imoveis?tipo=CHACARAS', label: 'Chácaras' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [topicosOpen, setTopicosOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-border">
      <div className="container-custom flex min-h-[96px] items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink hover:opacity-90 transition-opacity"
        >
          <Image src="/erica.png" alt="Erica Imóveis" width={315} height={99} className="h-[90px] w-auto object-contain" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navMain.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors relative after:absolute after:left-0 after:bottom-[-2px] after:h-px after:w-0 after:bg-accent after:transition-[width] hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setTopicosOpen(!topicosOpen)}
              className="flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              Tópicos
              <ChevronDown size={16} className={topicosOpen ? 'rotate-180' : ''} />
            </button>
            {topicosOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setTopicosOpen(false)} />
                <div className="absolute top-full left-0 mt-1 py-2 w-48 rounded-xl bg-white border border-cream-border shadow-elevated z-20">
                  {topicos.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block px-4 py-2.5 text-sm text-ink hover:bg-accent-light hover:text-accent"
                      onClick={() => setTopicosOpen(false)}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-ink-muted hover:text-accent transition-colors"
          >
            Entrar
          </Link>
        </nav>
        <button
          type="button"
          className="md:hidden p-2.5 -mr-2.5 text-ink-muted hover:text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-cream-border bg-cream py-5 px-5">
          <nav className="flex flex-col gap-1">
            {navMain.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-sm font-medium text-ink-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <p className="pt-2 pb-1 text-xs font-semibold text-ink uppercase tracking-wide">Tópicos</p>
            {topicos.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="py-2 pl-3 text-sm text-ink-muted hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {t.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="pt-4 text-sm font-medium text-ink-muted hover:text-accent"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
