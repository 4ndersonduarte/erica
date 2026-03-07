import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice, PROPERTY_STATUS_LABELS, PROPERTY_PURPOSE_LABELS, PROPERTY_TOPIC_LABELS } from '@/lib/utils';
import { Plus } from 'lucide-react';
import AdminPropertyActions from '@/components/admin/AdminPropertyActions';

export default async function AdminImoveisPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-dark-900">Imóveis</h1>
        <Link
          href="/admin/imoveis/novo"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 text-white px-5 py-3.5 font-semibold hover:bg-primary-600 transition min-h-[48px] shadow-md"
        >
          <Plus size={22} />
          Novo imóvel
        </Link>
      </div>

      {/* Desktop: tabela */}
      <div className="mt-6 hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl border border-dark-200 overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-dark-50 text-left">
              <th className="p-3 text-sm font-semibold text-dark-700">Foto</th>
              <th className="p-3 text-sm font-semibold text-dark-700">Código / Título</th>
              <th className="p-3 text-sm font-semibold text-dark-700">Tópico / Finalidade</th>
              <th className="p-3 text-sm font-semibold text-dark-700">Valor</th>
              <th className="p-3 text-sm font-semibold text-dark-700">Status</th>
              <th className="p-3 text-sm font-semibold text-dark-700">Destaque</th>
              <th className="p-3 text-sm font-semibold text-dark-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-t border-dark-200 hover:bg-dark-50/50">
                <td className="p-3">
                  <div className="relative w-14 h-14 rounded-lg bg-dark-100 overflow-hidden">
                    {p.images[0] ? (
                      <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-400 text-xs">—</div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span className="font-mono text-sm text-dark-600">{p.code}</span>
                  <p className="font-medium text-dark-900 line-clamp-1">{p.title}</p>
                </td>
                <td className="p-3 text-sm text-dark-600">
                  {PROPERTY_TOPIC_LABELS[p.topic] || p.topic} · {PROPERTY_PURPOSE_LABELS[p.purpose]}
                </td>
                <td className="p-3 font-medium text-dark-900">{formatPrice(p.value)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-dark-100 px-2 py-1 text-xs">{PROPERTY_STATUS_LABELS[p.status]}</span>
                </td>
                <td className="p-3">{p.featured ? 'Sim' : 'Não'}</td>
                <td className="p-3">
                  <AdminPropertyActions id={p.id} slug={p.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="mt-6 md:hidden space-y-4">
        {properties.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-dark-200 p-4 shadow-sm flex gap-4 items-start"
          >
            <div className="relative w-20 h-20 shrink-0 rounded-lg bg-dark-100 overflow-hidden">
              {p.images[0] ? (
                <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="80px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-400 text-xs">—</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs text-dark-500">{p.code}</p>
              <p className="font-semibold text-dark-900 line-clamp-2">{p.title}</p>
              <p className="text-sm text-dark-600 mt-0.5">
                {PROPERTY_TOPIC_LABELS[p.topic] || p.topic} · {formatPrice(p.value)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="rounded-full bg-dark-100 px-2 py-1 text-xs">{PROPERTY_STATUS_LABELS[p.status]}</span>
                <AdminPropertyActions id={p.id} slug={p.slug} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <p className="text-center py-12 text-dark-500">Nenhum imóvel cadastrado. Cadastre terrenos, casas, chácaras ou fazendas.</p>
      )}
    </div>
  );
}
