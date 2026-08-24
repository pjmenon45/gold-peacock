import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { syncContentFromDrive } from '@/lib/drive-sync';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return true; // If not set, allow in dev

  const authHeader = request.headers.get('Authorization');
  const xApiKey = request.headers.get('x-api-key');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === adminKey) return true;
  }

  if (xApiKey === adminKey) return true;

  // Also check query param ?key=... for easy browser testing
  const url = new URL(request.url);
  if (url.searchParams.get('key') === adminKey) return true;

  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing admin API key' },
      { status: 401 }
    );
  }

  try {
    const result = await syncContentFromDrive();

    // Invalidate Next.js cache so newly synced items are immediately rendered live
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/blog');
      revalidatePath('/videos');
      revalidatePath('/pwtw');
    } catch (cacheErr: any) {
      console.warn('Revalidate cache note:', cacheErr.message);
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed. Processed ${result.totalProcessed} item(s), Deleted ${result.totalDeleted} item(s).`,
      data: result,
    });
  } catch (error: any) {
    console.error('Drive sync failed:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Drive sync failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
