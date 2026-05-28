import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  createProperty,
  getListingSubmissionById,
  updateListingSubmissionStatus,
} from '@/lib/supabase-data';
import { apiError, apiSuccess, apiUnauthorized } from '@/lib/api-response';
import { generatePropertyCode, generateSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const action = body?.action;
    const adminNotes = typeof body?.adminNotes === 'string' ? body.adminNotes : null;
    const submission = await getListingSubmissionById(id);

    if (!submission) return apiError('Anuncio nao encontrado', 404);
    if (submission.status !== 'PENDING') {
      return apiError('Este anuncio ja foi analisado', 400);
    }

    if (action === 'reject') {
      const updated = await updateListingSubmissionStatus(id, 'REJECTED', { adminNotes });
      return apiSuccess(updated);
    }

    if (action !== 'approve') return apiError('Acao invalida', 400);

    const code = generatePropertyCode();
    const property = await createProperty(
      {
        code,
        slug: generateSlug(submission.title, code),
        title: submission.title,
        type: submission.type,
        topic: submission.topic,
        purpose: submission.purpose,
        value: submission.value,
        city: submission.city,
        neighborhood: submission.neighborhood,
        address: submission.address,
        rooms: submission.rooms,
        bathrooms: submission.bathrooms,
        parking: submission.parking,
        area: submission.area,
        description: `${submission.description}\n\nContato do anunciante: ${submission.ownerName} - ${submission.ownerPhone} - ${submission.ownerEmail}${
          submission.ownerNotes ? `\nObservacoes do anunciante: ${submission.ownerNotes}` : ''
        }`,
        status: 'AVAILABLE',
        featured: false,
        lat: null,
        lng: null,
      },
      []
    );

    const updated = await updateListingSubmissionStatus(id, 'APPROVED', {
      adminNotes,
      propertyId: property?.id ?? null,
    });
    return apiSuccess({ submission: updated, property });
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao analisar anuncio', 500);
  }
}
