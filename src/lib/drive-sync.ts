import { google } from 'googleapis';
import { prisma, ensureDatabaseTables } from './db';

// Helper to generate a clean URL slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/[\s_]+/g, '-') // spaces and underscores to hyphens
    .replace(/[^\w\-]+/g, '') // remove non-word chars
    .replace(/\-\-+/g, '-'); // replace multiple - with single -
}

// Clean title from filename
function cleanTitle(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  return nameWithoutExt
    .replace(/^[0-9]+[_\-\s]*/, '') // remove leading numbers
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface SyncResult {
  totalProcessed: number;
  items: Array<{
    id: string;
    type: string;
    title: string;
    slug: string;
    status: string;
    folder: string;
  }>;
  errors: Array<{ filename: string; error: string }>;
}

/**
 * Main Google Drive Sync Function
 */
export async function syncContentFromDrive(): Promise<SyncResult> {
  await ensureDatabaseTables();

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN) not configured.');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  // 1. Get folders
  const foldersRes = await drive.files.list({
    q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name, parents)',
  });

  const targetFolders = (foldersRes.data.files || []).filter(
    (f) =>
      f.name &&
      (f.name.includes('01_Videos') ||
        f.name.includes('02_Blog') ||
        f.name.includes('03_PWTW') ||
        f.name.includes('04_Future'))
  );

  const result: SyncResult = {
    totalProcessed: 0,
    items: [],
    errors: [],
  };

  for (const folder of targetFolders) {
    const folderName = folder.name || 'Unknown';
    const filesRes = await drive.files.list({
      q: `'${folder.id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name, mimeType, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink)',
    });

    const files = filesRes.data.files || [];
    for (const file of files) {
      if (!file.id || !file.name) continue;

      try {
        const filename = file.name;
        const mimeType = file.mimeType || '';

        // 1. Classifier Step
        let type: 'video' | 'blog' | 'pwtw' | 'future' = 'pwtw';
        if (folderName.includes('Videos') || mimeType.includes('video')) {
          type = 'video';
        } else if (
          folderName.includes('Blog') ||
          mimeType.includes('document') ||
          filename.endsWith('.md')
        ) {
          type = 'blog';
        } else if (folderName.includes('PWTW') || mimeType.includes('image')) {
          type = 'pwtw';
        } else if (folderName.includes('Future')) {
          type = 'future';
        }

        const slug = slugify(filename);
        const title = cleanTitle(filename);

        // Fetch existing entry if present
        const existing = await prisma.content.findUnique({ where: { slug } });
        const finalStatus = existing ? existing.status : 'draft';

        // 2. Specialist Processing
        let mediaUrl = `/api/drive-image/${file.id}`;
        let thumbnailUrl = `/api/drive-image/${file.id}`;
        let body = `### ${title}\n\nContent synced from Google Drive (${folderName}).`;
        let tags: string[] = ['Draft'];
        let extraMetadata: Record<string, any> = {};

        if (type === 'pwtw') {
          body = `### ${title}\n\nVisual story from ${folderName}. Stored as draft for review.\n\n> "Every image tells a thousand words."`;
          tags = ['AI', 'Enterprise', 'Visual Essay', 'Infographic'];
          extraMetadata.alt_text = title;
        } else if (type === 'blog') {
          body = `### ${title}\n\nDraft article content synced from Google Drive file: \`${filename}\`.\n\n*Review and edit before publishing.*`;
          tags = ['Blog', 'Draft'];
        } else if (type === 'video') {
          const existingMeta =
            existing?.metadata && typeof existing.metadata === 'object'
              ? (existing.metadata as Record<string, any>)
              : {};
          let youtubeId = existingMeta.youtubeId;

          // If not yet uploaded to YouTube, stream and upload via YouTube Data API
          if (!youtubeId && (mimeType.includes('video') || filename.match(/\.(mp4|mov|avi|mkv|webm)$/i))) {
            try {
              console.log(`[Video-Agent] Streaming "${filename}" from Google Drive to YouTube...`);
              const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
              const fileStream = await drive.files.get(
                { fileId: file.id, alt: 'media' },
                { responseType: 'stream' }
              );

              const uploadRes = await youtube.videos.insert({
                part: ['snippet', 'status'],
                requestBody: {
                  snippet: {
                    title: title,
                    description: `Video walkthrough for ${title}.\n\nProcessed automatically via Personal Content Website.`,
                    tags: ['Software Engineering', 'AI', 'Tutorial'],
                  },
                  status: {
                    privacyStatus: 'unlisted', // unlisted for safety during draft stage
                  },
                },
                media: {
                  body: fileStream.data,
                },
              });

              youtubeId = uploadRes.data.id;
              console.log(`[Video-Agent] ✓ Uploaded to YouTube with ID: ${youtubeId}`);
            } catch (ytErr: any) {
              console.warn(`[Video-Agent] YouTube upload notice: ${ytErr.message}`);
            }
          }

          if (youtubeId) {
            mediaUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
            thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
            extraMetadata.youtubeId = youtubeId;
          } else {
            mediaUrl = existing?.media_url || `/api/drive-image/${file.id}`;
            thumbnailUrl = existing?.thumbnail_url || `/api/drive-image/${file.id}`;
          }

          body =
            existing?.body ||
            `### ${title}\n\nVideo presentation and show notes.\n\n#### Overview\nThis video walkthrough covers key architectural concepts and engineering practices.`;
          tags = existing?.tags && existing.tags.length > 0 ? existing.tags : ['Video', 'Architecture', 'AI'];
        }

        // 3. Publisher: Upsert to database
        const saved = await prisma.content.upsert({
          where: { slug },
          update: {
            type,
            title,
            body: existing?.body || body,
            media_url: mediaUrl,
            thumbnail_url: thumbnailUrl,
            tags: existing?.tags && existing.tags.length > 0 ? existing.tags : tags,
            metadata: {
              ...(typeof existing?.metadata === 'object' && existing?.metadata !== null ? existing.metadata : {}),
              ...extraMetadata,
              driveFileId: file.id,
              originalFilename: filename,
              folderName,
              modifiedTime: file.modifiedTime,
            },
          },
          create: {
            type,
            title,
            slug,
            body,
            media_url: mediaUrl,
            thumbnail_url: thumbnailUrl,
            tags,
            status: finalStatus,
            metadata: {
              ...extraMetadata,
              driveFileId: file.id,
              originalFilename: filename,
              folderName,
              createdTime: file.createdTime,
              modifiedTime: file.modifiedTime,
            },
          },
        });

        result.totalProcessed++;
        result.items.push({
          id: saved.id,
          type: saved.type,
          title: saved.title,
          slug: saved.slug,
          status: saved.status,
          folder: folderName,
        });
      } catch (err: any) {
        result.errors.push({
          filename: file.name,
          error: err.message || 'Unknown error',
        });
      }
    }
  }

  return result;
}
