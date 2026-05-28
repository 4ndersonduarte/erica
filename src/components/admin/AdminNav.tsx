'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, ExternalLink, Inbox, LayoutDashboard, LogOut, Video } from 'lucide-react';

const items = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/imoveis', label: 'Imoveis', icon: Building2 },
  { href: '/admin/anuncios', label: 'Anuncios', icon: Inbox },
  { href: '/admin/videos', label: 'Videos', icon: Video },
];

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-cream-border/80 bg-white/90 backdrop-blur-xl">
      <div className="container-custom flex min-h-[72px] flex-col gap-3 py-3 sm:min-h-[78px] sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white">
            EI
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold tracking-tight text-ink">Erica Imoveis</span>
            <span className="block text-xs text-ink-subtle">Painel administrativo</span>
          </span>
        </Link>

        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto pb-1 sm:mx-0 sm:pb-0">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-ink text-white'
                    : 'text-ink-muted hover:bg-cream-dark hover:text-ink'
                }`}
              >
                <Icon size={16} strokeWidth={1.7} />
                {label}
              </Link>
            );
          })}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-cream-dark hover:text-ink"
          >
            <ExternalLink size={16} strokeWidth={1.7} />
            Site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={16} strokeWidth={1.7} />
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
