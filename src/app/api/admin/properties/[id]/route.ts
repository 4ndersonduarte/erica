import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { deleteProperty, getPropertyById, updateProperty } from '@/lib/supabase-data';
import { propertySchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) return apiError('Imóvel não encontrado', 404);
    return apiSuccess(property);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    return apiError('Erro ao buscar imóvel', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const existing = await getPropertyById(id);
    if (!existing) return apiError('Imóvel não encontrado', 404);

    const body = await request.json();
    const code = typeof body.code === 'string' && body.code.trim()
      ? body.code.trim().toUpperCase()
      : existing.code;
    const slug = body.slug || generateSlug(body.title, code);

    const parsed = propertySchema.safeParse({
      ...body,
      slug,
      imageUrls: body.imageUrls || [],
    });
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return apiError(first?.message ?? 'Dados inválidos', 400);
    }

    const data = parsed.data;
    const property = await updateProperty(id, {
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
      lat: data.lat ?? null,
      lng: data.lng ?? null,
    }, data.imageUrls);
    return apiSuccess(property);
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao atualizar imóvel', 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    await deleteProperty(id);
    return apiSuccess({ deleted: true });
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    return apiError('Erro ao excluir imóvel', 500);
  }
}
