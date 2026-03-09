import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { prisma } from '@/lib/prisma';
import { Home, TrendingUp, Key, CheckCircle, Plus } from 'lucide-react';

async function getStats(): Promise<{ total: number; forSale: number; forRent: number; sold: number; rented: number }> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    if (!error && data) return data as { total: number; forSale: number; forRent: number; sold: number; rented: number };
  }
  try {
    const [total, forSale, forRent, sold, rented] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { purpose: 'VENDA', status: 'AVAILABLE' } }),
      prisma.property.count({ where: { purpose: 'ALUGUEL', status: 'AVAILABLE' } }),
      prisma.property.count({ where: { status: 'SOLD' } }),
      prisma.property.count({ where: { status: 'RENTED' } }),
    ]);
    return { total, forSale, forRent, sold, rented };
  } catch {
    return { total: 0, forSale: 0, forRent: 0, sold: 0, rented: 0 };
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role === 'user') redirect('/');

  const stats = await getStats();

  const cards = [
    { label: 'Total de imóveis', value: stats.total, icon: Home, color: 'bg-primary-100 text-primary-800' },
    { label: 'Para venda', value: stats.forSale, icon: TrendingUp, color: 'bg-blue-100 text-blue-800' },
    { label: 'Para aluguel', value: stats.forRent, icon: Key, color: 'bg-amber-100 text-amber-800' },
    { label: 'Vendidos', value: stats.sold, icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { label: 'Alugados', value: stats.rented, icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Dashboard</h1>
          <p className="mt-1 text-dark-600">Visão geral dos imóveis</p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            ← Ir para a home do site
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/videos"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dark-200 px-5 py-3.5 font-semibold text-dark-700 hover:bg-dark-50 transition min-h-[48px]"
          >
            Vídeos da home
          </Link>
          <Link
            href="/admin/imoveis/novo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 text-white px-5 py-3.5 font-semibold hover:bg-primary-600 transition min-h-[48px] shadow-md"
          >
            <Plus size={22} />
            Cadastrar novo imóvel
          </Link>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl bg-white border border-dark-200 p-6 flex items-start gap-4"
          >
            <div className={`rounded-lg p-2 ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-900">{value}</p>
              <p className="text-sm text-dark-600">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
