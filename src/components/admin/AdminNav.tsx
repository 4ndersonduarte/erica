'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Home, LogOut, Menu, X, ExternalLink } from 'lucide-react';

export default function AdminNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  const navLinks = (
    <>
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-dark-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg px-3 py-2.5 min-h-[44px]"
        onClick={() => setOpen(false)}
      >
        <LayoutDashboard size={20} />
        Dashboard
      </Link>
      <Link
        href="/admin/imoveis"
        className="flex items-center gap-2 text-sm font-medium text-dark-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg px-3 py-2.5 min-h-[44px]"
        onClick={() => setOpen(false)}
      >
        <Home size={20} />
        Imóveis
      </Link>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-dark-500 hover:text-primary-600 rounded-lg px-3 py-2.5 min-h-[44px]"
      >
        <ExternalLink size={20} />
        Ver site
      </a>
      <button
        type="button"
        onClick={() => { handleLogout(); setOpen(false); }}
        className="flex w-full items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg px-3 py-2.5 min-h-[44px] text-left"
      >
        <LogOut size={20} />
        Sair
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-dark-200 shadow-sm">
      <div className="container-custom flex h-14 sm:h-16 items-center justify-between gap-4">
        <Link href="/admin/dashboard" className="font-bold text-primary-800 text-lg shrink-0">
          Erica · Admin
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks}
        </nav>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-3 -mr-2 rounded-lg text-dark-600 hover:bg-dark-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-dark-200 bg-white py-3 px-4 flex flex-col gap-1">
          {navLinks}
        </div>
      )}
    </header>
  );
}
