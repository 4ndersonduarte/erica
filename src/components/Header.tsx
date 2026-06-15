'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const navMain = [
  { href: '/', label: 'Início' },
  { href: '/imoveis', label: 'Imóveis' },
  { href: '/#porque-terra-boa', label: 'Por que Aritana' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/anunciar-imovel', label: 'Anunciar' },
  { href: '/#contato', label: 'Contato' },
];

const topicos = [
  { href: '/imoveis?tipo=TERRENOS', label: 'Terrenos' },
  { href: '/imoveis?tipo=CASAS', label: 'Casas' },
  { href: '/imoveis?tipo=FAZENDAS', label: 'Fazendas' },
  { href: '/imoveis?tipo=CHACARAS', label: 'Chácaras' },
];

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [topicosOpen, setTopicosOpen] = useState(false);
  const [session, setSession] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSession(data ?? null))
      .catch(() => setSession(null));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setSession(null);
    setOpen(false);
    router.refresh();
  };

  const hasSession = session != null;
  const isAdmin = session?.role === 'admin';

  const authLink = hasSession ? (
    <>
      {isAdmin && (
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Painel
        </Link>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
      >
        Sair
      </button>
    </>
  ) : (
    <Link
      href="/admin/login"
      className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
    >
      Entrar
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-cream-border bg-white">
      <div className="container-custom flex min-h-[84px] items-center justify-between py-2 sm:min-h-[98px]">
        <Link
          href="/"
          className="flex items-center gap-2 text-ink transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo-aritana.png"
            alt="Aritana Terra Boa - Soluções Imobiliárias"
            width={1200}
            height={1046}
            className="h-[72px] w-auto object-contain sm:h-[88px]"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {navMain.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-ink-muted transition-colors hover:text-ink after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setTopicosOpen(!topicosOpen)}
              className="flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Tópicos
              <ChevronDown
                size={16}
                className={`transition-transform ${topicosOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {topicosOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setTopicosOpen(false)}
                />
                <div className="absolute left-0 top-full z-20 mt-4 w-48 rounded-lg border border-cream-border bg-white p-1.5 shadow-elevated">
                  {topicos.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block rounded-md px-3 py-2.5 text-sm text-ink transition-colors hover:bg-accent-light hover:text-accent"
                      onClick={() => setTopicosOpen(false)}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          {authLink}
        </nav>
        <button
          type="button"
          className="-mr-2.5 rounded-lg p-2.5 text-ink-muted transition-colors hover:bg-cream-dark hover:text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-cream-border bg-white px-4 py-3 shadow-elevated md:hidden">
          <nav className="flex flex-col gap-1 rounded-lg bg-cream/70 p-2">
            {navMain.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-medium text-ink-muted hover:bg-white hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink">
              Tópicos
            </p>
            {topicos.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-white hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {t.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="rounded-md px-3 pt-4 text-sm font-medium text-accent hover:text-accent-hover"
                onClick={() => setOpen(false)}
              >
                Painel
              </Link>
            )}
            {hasSession ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="rounded-md px-3 pt-4 text-left text-sm font-medium text-ink-muted hover:text-accent"
              >
                Sair
              </button>
            ) : (
              <Link
                href="/admin/login"
                className="rounded-md px-3 pt-4 text-sm font-medium text-ink-muted hover:text-accent"
                onClick={() => setOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
