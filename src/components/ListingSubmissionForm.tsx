'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import {
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TOPIC_LABELS,
  PROPERTY_TYPE_LABELS,
} from '@/lib/utils';

const types = Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => ({ value, label }));
const topics = Object.entries(PROPERTY_TOPIC_LABELS).filter(([value]) => value !== 'CASAS_XACARAS').map(([value, label]) => ({ value, label }));
const purposes = Object.entries(PROPERTY_PURPOSE_LABELS).map(([value, label]) => ({ value, label }));

export default function ListingSubmissionForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerNotes: '',
    title: '',
    type: 'CASA',
    topic: 'CASAS',
    purpose: 'VENDA',
    value: '',
    city: '',
    neighborhood: '',
    address: '',
    rooms: '0',
    bathrooms: '0',
    parking: '0',
    area: '',
    description: '',
    privacy: false,
  });

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.privacy) {
      toast.error('Aceite a política de privacidade para enviar.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/listing-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar anúncio');
      setSent(true);
      toast.success('Anúncio enviado para aprovação');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'mt-1.5 h-12 w-full rounded-lg border border-cream-border bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10';
  const labelClass = 'block text-sm font-medium text-ink-muted';

  if (sent) {
    return (
      <div className="rounded-lg border border-cream-border bg-white p-6 text-center shadow-card">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Anúncio enviado</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-muted">
          Recebemos as informações do imóvel. Ele ficará pendente até a aprovação do administrador.
        </p>
        <Link href="/" className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-ink px-6 text-sm font-semibold text-white">
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <section className="rounded-lg border border-cream-border bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Seu contato</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Nome *</label><input className={inputClass} value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)} required /></div>
          <div><label className={labelClass}>Telefone *</label><input className={inputClass} value={form.ownerPhone} onChange={(e) => update('ownerPhone', e.target.value)} required inputMode="tel" /></div>
          <div><label className={labelClass}>E-mail *</label><input className={inputClass} type="email" value={form.ownerEmail} onChange={(e) => update('ownerEmail', e.target.value)} required /></div>
          <div><label className={labelClass}>Observações</label><input className={inputClass} value={form.ownerNotes} onChange={(e) => update('ownerNotes', e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-lg border border-cream-border bg-white p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Dados do imóvel</h2>
        <div className="mt-5 grid gap-4">
          <div><label className={labelClass}>Título *</label><input className={inputClass} value={form.title} onChange={(e) => update('title', e.target.value)} required /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className={labelClass}>Tipo</label><select className={inputClass} value={form.type} onChange={(e) => update('type', e.target.value)}>{types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div><label className={labelClass}>Tópico</label><select className={inputClass} value={form.topic} onChange={(e) => update('topic', e.target.value)}>{topics.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div><label className={labelClass}>Finalidade</label><select className={inputClass} value={form.purpose} onChange={(e) => update('purpose', e.target.value)}>{purposes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Valor (R$) *</label><input className={inputClass} type="number" min="0" step="0.01" value={form.value} onChange={(e) => update('value', e.target.value)} required /></div>
            <div><label className={labelClass}>Área (m²) *</label><input className={inputClass} type="number" min="0" step="0.01" value={form.area} onChange={(e) => update('area', e.target.value)} required /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className={labelClass}>Cidade *</label><input className={inputClass} value={form.city} onChange={(e) => update('city', e.target.value)} required /></div>
            <div><label className={labelClass}>Bairro *</label><input className={inputClass} value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} required /></div>
            <div><label className={labelClass}>Endereço *</label><input className={inputClass} value={form.address} onChange={(e) => update('address', e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Quartos</label><input className={inputClass} type="number" min="0" value={form.rooms} onChange={(e) => update('rooms', e.target.value)} /></div>
            <div><label className={labelClass}>Banheiros</label><input className={inputClass} type="number" min="0" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} /></div>
            <div><label className={labelClass}>Vagas</label><input className={inputClass} type="number" min="0" value={form.parking} onChange={(e) => update('parking', e.target.value)} /></div>
          </div>
          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea className="mt-1.5 min-h-[130px] w-full rounded-lg border border-cream-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" value={form.description} onChange={(e) => update('description', e.target.value)} required />
          </div>
        </div>
      </section>

      <label className="flex items-start gap-3 rounded-lg border border-cream-border bg-white p-4 text-sm text-ink-muted shadow-card">
        <input type="checkbox" checked={form.privacy} onChange={(e) => update('privacy', e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-cream-border text-accent" />
        <span>
          Li e aceito a <Link href="/politica-de-privacidade" className="font-semibold text-accent hover:text-accent-hover">política de privacidade</Link> e autorizo o contato sobre este anúncio.
        </span>
      </label>

      <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white shadow-card transition-colors hover:bg-ink-light disabled:opacity-50 sm:w-auto">
        <Send size={18} strokeWidth={1.7} />
        {loading ? 'Enviando...' : 'Enviar para aprovação'}
      </button>
    </form>
  );
}
