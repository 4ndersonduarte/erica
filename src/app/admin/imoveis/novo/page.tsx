import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function NovoImovelPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900">Novo imóvel</h1>
      <p className="mt-1 text-dark-600">Preencha os dados do imóvel</p>
      <PropertyForm />
    </div>
  );
}
