'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const nav = [
  { href: '/', label: 'Início' },
  { href: '/imoveis', label: 'Imóveis' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#contato', label: 'Contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-cream-border">
      <div className="container-custom flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-ink hover:text-accent transition-colors"
        >
          Erica Imóveis
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors relative after:absolute after:left-0 after:bottom-[-2px] after:h-px after:w-0 after:bg-accent after:transition-[width] hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="text-sm text-ink-subtle hover:text-accent transition-colors"
          >
            Área do corretor
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
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-sm font-medium text-ink-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="py-3 text-sm text-ink-subtle"
              onClick={() => setOpen(false)}
            >
              Área do corretor
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
