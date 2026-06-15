import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: { default: 'Aritana Terra Boa | Soluções Imobiliárias', template: '%s | Aritana Terra Boa' },
  description: 'Casas, terrenos, chácaras e fazendas para venda e aluguel.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <body className="font-sans antialiased text-ink bg-cream">
        {children}
        <FloatingWhatsApp />
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
