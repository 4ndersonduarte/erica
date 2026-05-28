import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/admin/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/erica.png"
              alt="Erica Imóveis"
              width={288}
              height={92}
              className="mx-auto h-[77px] w-auto object-contain"
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
