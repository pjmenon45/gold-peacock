import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  if (!fileId) {
    return new NextResponse('File ID is required', { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return new NextResponse('Google OAuth credentials not configured', { status: 500 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 1. Get file metadata (MIME type)
    const fileMeta = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType',
    });

    const mimeType = fileMeta.data.mimeType || 'image/jpeg';

    // 2. Fetch image content as buffer
    const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );

    const buffer = Buffer.from(res.data as ArrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error streaming Google Drive image:', error.message);
    return new NextResponse('Failed to load image from Google Drive', { status: 502 });
  }
}
