import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/admin/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/logo-aritana.png"
              alt="Aritana Terra Boa"
              width={1200}
              height={1046}
              className="mx-auto h-40 w-auto object-contain"
            />
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-accent">
            Área administrativa
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Criar conta</h1>
          <p className="mt-2 text-ink-muted">Cadastre-se para acompanhar o site.</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
