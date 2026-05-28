import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getPropertyById } from '@/lib/supabase-data';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (session.role === 'user') redirect('/');

  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  const initial = {
    ...property,
    topic: property.topic === 'CASAS_XACARAS' ? 'CHACARAS' : property.topic,
    imageUrls: property.images.map((i) => i.url),
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
        Edição
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Editar imóvel</h1>
      <p className="mt-2 text-ink-muted">{property.code}</p>
      <PropertyForm initial={initial} />
    </div>
  );
}
