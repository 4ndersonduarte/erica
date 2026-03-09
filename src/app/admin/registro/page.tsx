import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/admin/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cream-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/erica.png" alt="Erica Imóveis" width={240} height={77} className="h-16 w-auto object-contain mx-auto" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-ink">Criar conta</h1>
          <p className="mt-2 text-ink-muted">Cadastre-se para acompanhar o site.</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
