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
    });
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return apiError(first?.message ?? 'Dados inválidos', 400);
    }

    const data = parsed.data;
    const property = await prisma.property.create({
      data: {
        code,
        slug,
        title: data.title,
        type: data.type,
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
    return apiError('Erro ao cadastrar imóvel', 500);
  }
}
