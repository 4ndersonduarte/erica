import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth';
import { listAllAdminProperties } from '@/lib/supabase-data';
import {
  formatPrice,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TOPIC_LABELS,
} from '@/lib/utils';
import { Plus } from 'lucide-react';
import AdminPropertyActions from '@/components/admin/AdminPropertyActions';

export default async function AdminImoveisPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const properties = await listAllAdminProperties();

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
            Catálogo
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Imóveis</h1>
          <p className="mt-2 text-ink-muted">
            {properties.length} imóvel{properties.length !== 1 ? 'eis' : ''} cadastrado
            {properties.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-ink-light"
        >
          <Plus size={20} strokeWidth={1.8} />
          Novo imóvel
        </Link>
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-lg border border-cream-border bg-white shadow-card md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-cream text-left">
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Foto</th>
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Código / Título</th>
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Tópico / Finalidade</th>
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Valor</th>
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Status</th>
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Destaque</th>
              <th className="p-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-t border-cream-border hover:bg-cream/50">
                <td className="p-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-cream-dark">
                    {p.images[0] ? (
                      <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-subtle">-</div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-xs font-medium text-ink-subtle">{p.code}</span>
                  <p className="line-clamp-1 font-medium text-ink">{p.title}</p>
                </td>
                <td className="p-3 text-sm text-ink-muted">
                  {PROPERTY_TOPIC_LABELS[p.topic] || p.topic} · {PROPERTY_PURPOSE_LABELS[p.purpose]}
                </td>
                <td className="p-3 font-medium text-ink">{formatPrice(p.value)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
                    {PROPERTY_STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="p-3 text-sm text-ink-muted">{p.featured ? 'Sim' : 'Não'}</td>
                <td className="p-3">
                  <AdminPropertyActions id={p.id} slug={p.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4 md:hidden">
        {properties.map((p) => (
          <div
            key={p.id}
            className="flex items-start gap-4 rounded-lg border border-cream-border bg-white p-4 shadow-card"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
              {p.images[0] ? (
                <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="80px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-ink-subtle">-</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-subtle">{p.code}</p>
              <p className="line-clamp-2 font-semibold text-ink">{p.title}</p>
              <p className="mt-0.5 text-sm text-ink-muted">
                {PROPERTY_TOPIC_LABELS[p.topic] || p.topic} · {formatPrice(p.value)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
                  {PROPERTY_STATUS_LABELS[p.status]}
                </span>
                <AdminPropertyActions id={p.id} slug={p.slug} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <p className="py-12 text-center text-ink-muted">
          Nenhum imóvel cadastrado. Cadastre terrenos, casas, chácaras ou fazendas.
        </p>
      )}
    </div>
  );
}
