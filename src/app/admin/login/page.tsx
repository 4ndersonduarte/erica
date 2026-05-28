import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === 'admin') redirect('/admin/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/erica.png"
              alt="Erica Imóveis"
              width={432}
              height={139}
              className="mx-auto h-24 w-auto object-contain"
              priority
            />
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-accent">
            Área administrativa
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Entrar</h1>
        </div>
        <LoginForm />
        <p className="mt-6 text-center">
          <Link href="/admin/registro" className="text-sm font-medium text-accent hover:underline">
            Cadastrar nova conta
          </Link>
        </p>
      </div>
    </div>
  );
}
