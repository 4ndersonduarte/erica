import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function NovoImovelPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent sm:text-sm">
        Cadastro
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Novo imóvel</h1>
      <p className="mt-2 max-w-xl text-ink-muted">
        Cadastre terrenos, casas, chácaras ou fazendas. Preencha os dados abaixo.
      </p>
      <PropertyForm />
    </div>
  );
}
