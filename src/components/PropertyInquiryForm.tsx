'use client';

import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

type Props = {
  propertyCode: string;
  propertyTitle: string;
  whatsappNumber: string;
};

const clean = (value: string) => value.replace(/\D/g, '');

export default function PropertyInquiryForm({ propertyCode, propertyTitle, whatsappNumber }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', questions: '' });

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const message = encodeURIComponent(
    `Ola! Tenho interesse no imovel ${propertyCode} - ${propertyTitle}.\n\nNome: ${form.name}\nE-mail: ${form.email}\nTelefone: ${form.phone}\nDuvidas: ${form.questions || 'Nao informado'}`
  );

  const href = `https://wa.me/${clean(whatsappNumber)}?text=${message}`;
  const inputClass = 'mt-1.5 h-12 w-full rounded-lg border border-cream-border bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10';
  const labelClass = 'block text-sm font-medium text-ink-muted';

  return (
    <form className="rounded-lg border border-cream-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2 text-ink">
        <MessageCircle size={20} strokeWidth={1.7} />
        <h2 className="text-lg font-semibold tracking-tight">Enviar proposta pelo WhatsApp</h2>
      </div>
      <div className="mt-5 grid gap-4">
        <div>
          <label className={labelClass}>Nome</label>
          <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>E-mail</label>
            <input className={inputClass} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} required inputMode="tel" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Duvidas</label>
          <textarea
            className="mt-1.5 min-h-[110px] w-full rounded-lg border border-cream-border bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
            value={form.questions}
            onChange={(e) => update('questions', e.target.value)}
          />
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
      >
        <Send size={18} strokeWidth={1.7} />
        Enviar via WhatsApp
      </a>
    </form>
  );
}
