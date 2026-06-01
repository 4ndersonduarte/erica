import { NextRequest } from 'next/server';
import { createListingSubmission } from '@/lib/supabase-data';
import { listingSubmissionSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = listingSubmissionSchema.safeParse({
      ...body,
      value: Number(body.value) || 0,
      rooms: Number(body.rooms) || 0,
      bathrooms: Number(body.bathrooms) || 0,
      parking: Number(body.parking) || 0,
      area: Number(body.area) || 0,
      ownerNotes: body.ownerNotes || null,
    });

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return apiError(first?.message ?? 'Dados inválidos', 400);
    }

    const submission = await createListingSubmission({
      ...parsed.data,
      ownerNotes: parsed.data.ownerNotes ?? null,
    });
    return apiSuccess({ status: submission.status }, 201);
  } catch (e) {
    console.error(e);
    const message = (e as Error).message?.includes('ListingSubmission')
      ? 'Ainda falta criar a tabela de anúncios no Supabase.'
      : 'Erro ao enviar anúncio';
    return apiError(message, 500);
  }
}
