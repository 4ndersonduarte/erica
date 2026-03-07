import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { propertySchema } from '@/lib/validations';
import { generatePropertyCode, generateSlug } from '@/lib/utils';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    return apiSuccess(properties);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao listar imóveis', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const code = body.code || generatePropertyCode();
    const slug = body.slug || generateSlug(body.title, code);

    const parsed = propertySchema.safeParse({
      ...body,
      code,
      slug,
      imageUrls: body.imageUrls || [],
      value: typeof body.value === 'number' ? body.value : Number(body.value) || 0,
      rooms: typeof body.rooms === 'number' ? body.rooms : Number(body.rooms) || 0,
      bathrooms: typeof body.bathrooms === 'number' ? body.bathrooms : Number(body.bathrooms) || 0,
      parking: typeof body.parking === 'number' ? body.parking : Number(body.parking) || 0,
      area: typeof body.area === 'number' ? body.area : Number(body.area) || 0,
    });
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      const msg = first?.message ?? 'Dados inválidos';
      return apiError(msg, 400);
    }

    const data = parsed.data;
    const property = await prisma.property.create({
      data: {
        code,
        slug,
        title: data.title,
        type: data.type,
        topic: data.topic,
        purpose: data.purpose,
        value: data.value,
        city: data.city,
        neighborhood: data.neighborhood,
        address: data.address,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        parking: data.parking,
        area: data.area,
        description: data.description,
        status: data.status,
        featured: data.featured,
        lat: data.lat ?? undefined,
        lng: data.lng ?? undefined,
        images: {
          create: data.imageUrls.map((url, i) => ({ url, order: i })),
        },
      },
      include: { images: true },
    });
    return apiSuccess(property, 201);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    const err = e as Error & { code?: string; meta?: unknown };
    let message = 'Erro ao cadastrar imóvel';
    if (err.message?.includes('topic') || err.code === 'P2010') {
      message = 'Banco sem a coluna "topic". Rode: npx prisma db push';
    } else if (err.code === 'P2002') {
      message = 'Já existe um imóvel com este código ou slug. Altere o título.';
    } else if (err.message) {
      message = err.message;
    }
    return apiError(message, 500);
  }
}
