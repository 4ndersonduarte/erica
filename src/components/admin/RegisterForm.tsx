'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao cadastrar');
        return;
      }
      toast.success('Conta criada! Faça login.');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-8 shadow-xl"
    >
      <label className="block text-sm font-medium text-dark-700">Nome (opcional)</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 w-full rounded-lg border border-dark-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        placeholder="Seu nome"
      />
      <label className="mt-4 block text-sm font-medium text-dark-700">E-mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 w-full rounded-lg border border-dark-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        placeholder="seu@email.com"
      />
      <label className="mt-4 block text-sm font-medium text-dark-700">Senha (mín. 6 caracteres)</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className="mt-1 w-full rounded-lg border border-dark-200 px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-primary-800 text-white py-3 font-medium hover:bg-primary-900 transition disabled:opacity-50"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      <p className="mt-4 text-center text-dark-500 text-sm">
        Já tem conta?{' '}
        <Link href="/admin/login" className="text-accent font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
