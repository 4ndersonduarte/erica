import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getDashboardStats } from '@/lib/supabase-data';
import { CheckCircle, Home, Inbox, Key, Plus, TrendingUp, Video } from 'lucide-react';

async function getStats(): Promise<{
  total: number;
  forSale: number;
  forRent: number;
  sold: number;
  rented: number;
  pendingSubmissions?: number;
}> {
  try {
    return await getDashboardStats();
  } catch {
    return { total: 0, forSale: 0, forRent: 0, sold: 0, rented: 0, pendingSubmissions: 0 };
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role === 'user') redirect('/');

  const stats = await getStats();

  const cards = [
    { label: 'Total de imóveis', value: stats.total, icon: Home, color: 'bg-accent-light text-accent' },
    { label: 'Para venda', value: stats.forSale, icon: TrendingUp, color: 'bg-blue-100 text-blue-800' },
    { label: 'Para aluguel', value: stats.forRent, icon: Key, color: 'bg-amber-100 text-amber-800' },
    { label: 'Aprovar anúncios', value: stats.pendingSubmissions || 0, icon: Inbox, color: 'bg-red-100 text-red-800' },
    { label: 'Vendidos', value: stats.sold, icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { label: 'Alugados', value: stats.rented, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-2 max-w-xl text-ink-muted">
            Visão geral dos imóveis e atalhos rápidos.
          </p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Link
            href="/admin/videos"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-cream-border bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
          >
            <Video size={18} strokeWidth={1.7} />
            Vídeos da home
          </Link>
          <Link
            href="/admin/imoveis/novo"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-ink-light"
          >
            <Plus size={20} strokeWidth={1.8} />
            Novo imóvel
          </Link>
        </div>
      </div>

      {!!stats.pendingSubmissions && (
        <Link
          href="/admin/anuncios"
          className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 transition-colors hover:bg-red-100"
        >
          <span className="font-semibold">
            {stats.pendingSubmissions} imóvel{stats.pendingSubmissions !== 1 ? 'eis' : ''} aguardando aprovação
          </span>
          <span className="text-sm font-semibold">Ver anúncios</span>
        </Link>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border border-cream-border bg-white p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-ink">{value}</p>
                <p className="mt-1 text-sm text-ink-muted">{label}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon size={20} strokeWidth={1.7} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
