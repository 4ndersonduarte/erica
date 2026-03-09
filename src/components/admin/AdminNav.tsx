'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  const linkClass = "text-sm font-medium text-dark-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg px-3 py-2.5 min-h-[44px] inline-flex items-center";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-dark-200 shadow-sm">
      <div className="container-custom flex h-14 sm:h-16 items-center justify-between gap-2 flex-wrap">
        <Link href="/admin/dashboard" className="font-bold text-primary-800 text-lg shrink-0">
          Erica Imóveis
        </Link>
        <nav className="flex items-center gap-1 flex-wrap">
          <Link href="/admin/dashboard" className={linkClass}>
            Dashboard
          </Link>
          <Link href="/admin/imoveis" className={linkClass}>
            Imóveis
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dark-500 hover:text-primary-600 rounded-lg px-3 py-2.5 min-h-[44px] inline-flex items-center"
          >
            Ver site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className={`${linkClass} text-red-600 hover:bg-red-50`}
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
