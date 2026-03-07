'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

// Erica: (38) 98421-2207 — usar só NEXT_PUBLIC_WHATSAPP_ERICA ou este fallback
const whatsappErica = process.env.NEXT_PUBLIC_WHATSAPP_ERICA ?? '5538984212207';
const whatsappTerraBoa = process.env.NEXT_PUBLIC_WHATSAPP_TERRA_BOA || process.env.NEXT_PUBLIC_WHATSAPP || '5538984212207';

function cleanNumber(n: string) {
  return n.replace(/\D/g, '');
}

const msgErica = encodeURIComponent('Olá! Vim pelo site da Erica Imóveis e gostaria de mais informações.');

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 rounded-2xl bg-white border border-cream-border shadow-elevated p-2 min-w-[200px]">
          <a
            href={`https://wa.me/${cleanNumber(whatsappErica)}?text=${msgErica}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-accent-light transition-colors"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
              <MessageCircle size={18} />
            </span>
            WhatsApp (Erica)
          </a>
          <a
            href={`https://wa.me/${cleanNumber(whatsappTerraBoa)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink hover:bg-accent-light transition-colors"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
              <MessageCircle size={18} />
            </span>
            WhatsApp (Terra Boa)
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] transition-colors"
        aria-label="Abrir opções de WhatsApp"
      >
        <MessageCircle size={28} strokeWidth={1.5} />
      </button>
    </div>
  );
}
