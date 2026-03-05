'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Home, LogOut } from 'lucide-react';

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-dark-200">
      <div className="container-custom flex h-14 items-center justify-between">
        <Link href="/admin/dashboard" className="font-semibold text-primary-800">
          Erica · Admin
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-sm text-dark-600 hover:text-primary-700"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/admin/imoveis"
            className="flex items-center gap-2 text-sm text-dark-600 hover:text-primary-700"
          >
            <Home size={18} />
            Imóveis
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dark-500 hover:text-primary-600"
          >
            Ver site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-dark-500 hover:text-red-600"
          >
            <LogOut size={18} />
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
