'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const inputClass =
  'mt-1.5 h-12 w-full rounded-lg border border-cream-border bg-white px-4 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10';
const labelClass = 'block text-sm font-medium text-ink-muted';

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
    <form onSubmit={handleSubmit} className="rounded-lg border border-cream-border bg-white p-6 shadow-card sm:p-8">
      <label className={labelClass}>Nome (opcional)</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
        placeholder="Seu nome"
      />
      <label className="mt-4 block text-sm font-medium text-ink-muted">E-mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
        placeholder="seu@email.com"
      />
      <label className="mt-4 block text-sm font-medium text-ink-muted">Senha (mín. 6 caracteres)</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-light disabled:opacity-50"
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      <p className="mt-4 text-center text-sm text-ink-muted">
        Já tem conta?{' '}
        <Link href="/admin/login" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
