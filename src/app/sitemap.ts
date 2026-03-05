import { prisma } from '@/lib/prisma';
const base = process.env.NEXT_PUBLIC_APP_URL || 'https://ericaimoveis.com.br';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  let propertyPages: { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }[] = [];
  if (process.env.DATABASE_URL) {
    try {
      const properties = await prisma.property.findMany({
        where: { status: 'AVAILABLE' },
        select: { slug: true, updatedAt: true },
      });
      propertyPages = properties.map((p) => ({
        url: `${base}/imoveis/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch {
      // DB não disponível no build
    }
  }

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${base}/imoveis`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
  ];

  return [...staticPages, ...propertyPages];
}
