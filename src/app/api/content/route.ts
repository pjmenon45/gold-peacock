import { NextRequest, NextResponse } from 'next/server';
import { getContentItems } from '@/lib/content';
import { ContentType } from '@/types';

/**
 * GET /api/content
 * Public read-only endpoint for published content
 * Supports ?type=video|blog|pwtw&tag=...&limit=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as ContentType | null;
  const tag = searchParams.get('tag') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
  const featuredOnly = searchParams.get('featured') === 'true';

  try {
    const items = await getContentItems({
      type: type || undefined,
      status: 'published',
      tag,
      limit,
      featuredOnly,
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
