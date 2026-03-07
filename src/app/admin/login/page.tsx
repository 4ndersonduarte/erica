import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect('/admin/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Erica Imóveis</h1>
          <p className="mt-2 text-dark-300">Entre com sua conta</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-dark-400 text-sm">
          Corretor ou administrador: use seu e-mail e senha para acessar o painel.
        </p>
      </div>
    </div>
  );
}
