import { listProperties } from '@/lib/supabase-data';

const base = process.env.NEXT_PUBLIC_APP_URL || 'https://ericaimoveis.com.br';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  let propertyPages: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = [];

  try {
    const { items: properties } = await listProperties({
      status: 'AVAILABLE',
      pageSize: 1000,
    });
    propertyPages = properties.map((p) => ({
      url: `${base}/imoveis/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // Supabase pode estar indisponível no build.
  }

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${base}/imoveis`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
  ];

  return [...staticPages, ...propertyPages];
}
