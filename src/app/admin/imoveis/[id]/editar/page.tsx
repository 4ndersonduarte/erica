import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function EditarImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!property) notFound();

  const initial = {
    ...property,
    imageUrls: property.images.map((i) => i.url),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900">Editar imóvel</h1>
      <p className="mt-1 text-dark-600">{property.code}</p>
      <PropertyForm initial={initial} />
    </div>
  );
}
