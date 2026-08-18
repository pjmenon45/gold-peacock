import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAdminAuth } from '@/lib/auth';
import { createContent, getContentItems } from '@/lib/content';
import { ContentType, ContentStatus } from '@/types';

const CreateContentSchema = z.object({
  type: z.enum(['video', 'blog', 'pwtw', 'future'] as const),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase alphanumeric characters and hyphens'),
  body: z.string().min(1, 'Body markdown is required'),
  media_url: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['draft', 'published'] as const).optional().default('draft'),
  published_at: z.string().datetime().optional().nullable(),
  metadata: z.record(z.any()).optional().default({}),
});

/**
 * GET /api/admin/content
 * Protected route to list all content items (drafts + published)
 */
export async function GET(request: NextRequest) {
  const auth = validateAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as ContentType | null;
  const status = searchParams.get('status') as ContentStatus | null;
  const tag = searchParams.get('tag') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  try {
    const items = await getContentItems({
      type: type || undefined,
      status: status || undefined,
      tag,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch content items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Protected route to create new content (for AI agents & admin tools)
 */
export async function POST(request: NextRequest) {
  const auth = validateAdminAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = CreateContentSchema.safeParse(json);

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

    const created = await createContent(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Content created successfully',
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create content' },
      { status: 500 }
    );
  }
}
