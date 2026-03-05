import slugify from 'slugify';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function generateSlug(title: string, code: string): string {
  return `${slugify(title, { lower: true, strict: true })}-${code}`.slice(0, 100);
}

export function generatePropertyCode(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IM-${t}-${r}`;
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  CASA: 'Casa',
  APARTAMENTO: 'Apartamento',
  TERRENO: 'Terreno',
  COMERCIAL: 'Comercial',
};

export const PROPERTY_PURPOSE_LABELS: Record<string, string> = {
  VENDA: 'Venda',
  ALUGUEL: 'Aluguel',
};

export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponível',
  SOLD: 'Vendido',
  RENTED: 'Alugado',
  RESERVED: 'Reservado',
};
