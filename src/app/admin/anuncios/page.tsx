import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { listListingSubmissions } from '@/lib/supabase-data';
import { formatPrice, PROPERTY_PURPOSE_LABELS, PROPERTY_TOPIC_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import ListingSubmissionActions from '@/components/admin/ListingSubmissionActions';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
};

export default async function AdminAnunciosPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role === 'user') redirect('/');

  const submissions = await listListingSubmissions();
  const pending = submissions.filter((item) => item.status === 'PENDING');

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
            Aprovacao
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Anuncios enviados</h1>
          <p className="mt-2 text-ink-muted">
            {pending.length} anuncio{pending.length !== 1 ? 's' : ''} aguardando aprovacao.
          </p>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Ha imoveis novos esperando revisao. Aprove para publicar no site ou recuse se precisar ajustar com o anunciante.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {submissions.map((item) => (
          <article key={item.id} className="rounded-lg border border-cream-border bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {statusLabel[item.status]}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">{item.title}</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {PROPERTY_TOPIC_LABELS[item.topic] || item.topic} · {PROPERTY_TYPE_LABELS[item.type] || item.type} · {PROPERTY_PURPOSE_LABELS[item.purpose] || item.purpose}
                </p>
                <p className="mt-2 font-semibold text-ink">{formatPrice(item.value)}</p>
              </div>
              {item.status === 'PENDING' && <ListingSubmissionActions id={item.id} />}
            </div>

            <div className="mt-5 grid gap-4 text-sm text-ink-muted lg:grid-cols-3">
              <div>
                <p className="font-semibold text-ink">Contato</p>
                <p>{item.ownerName}</p>
                <p>{item.ownerPhone}</p>
                <p>{item.ownerEmail}</p>
              </div>
              <div>
                <p className="font-semibold text-ink">Localizacao</p>
                <p>{item.address}</p>
                <p>{item.neighborhood}, {item.city}</p>
              </div>
              <div>
                <p className="font-semibold text-ink">Caracteristicas</p>
                <p>{item.rooms} quartos · {item.bathrooms} banheiros · {item.parking} vagas</p>
                <p>{item.area} m2</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{item.description}</p>
            {item.ownerNotes && (
              <p className="mt-3 rounded-lg bg-cream p-3 text-sm text-ink-muted">
                Observacoes do anunciante: {item.ownerNotes}
              </p>
            )}
          </article>
        ))}
      </div>

      {submissions.length === 0 && (
        <p className="py-12 text-center text-ink-muted">
          Nenhum anuncio enviado ainda.
        </p>
      )}
    </div>
  );
}
