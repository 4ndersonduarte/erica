import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === 'admin') redirect('/');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/erica.png" alt="Erica Imóveis" width={360} height={116} className="h-24 w-auto object-contain mx-auto" />
          </Link>
        </div>
        <LoginForm />
        <p className="mt-6 text-center">
          <Link href="/admin/registro" className="text-accent hover:underline text-sm font-medium">
            Cadastrar nova conta
          </Link>
        </p>
      </div>
    </div>
  );
}
