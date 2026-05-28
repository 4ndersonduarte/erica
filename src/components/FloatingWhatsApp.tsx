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
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex min-w-[200px] flex-col gap-2 rounded-lg border border-cream-border bg-white p-2 shadow-elevated">
          <a
            href={`https://wa.me/${cleanNumber(whatsappErica)}?text=${msgErica}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent-light"
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
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent-light"
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
