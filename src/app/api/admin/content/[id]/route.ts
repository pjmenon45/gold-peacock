import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAdminAuth } from '@/lib/auth';
import { deleteContent, getContentById, updateContent } from '@/lib/content';

const UpdateContentSchema = z.object({
  type: z.enum(['video', 'blog', 'pwtw', 'future'] as const).optional(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  body: z.string().min(1).optional(),
  media_url: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published'] as const).optional(),
  published_at: z.string().datetime().optional().nullable(),
  metadata: z.record(z.any()).optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/admin/content/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = validateAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const { id } = params;
  const item = await getContentById(id);

  if (!item) {
    return NextResponse.json({ success: false, error: 'Content item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: item });
}

/**
 * PATCH /api/admin/content/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = validateAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const { id } = params;

  try {
    const json = await request.json();
    const parsed = UpdateContentSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const updated = await updateContent(id, parsed.data);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Content item not found to update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content/[id]
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = validateAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const { id } = params;
  const success = await deleteContent(id);

  if (!success) {
    return NextResponse.json(
      { success: false, error: 'Content item not found or could not be deleted' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Content item ${id} deleted successfully`,
  });
}
