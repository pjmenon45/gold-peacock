require('dotenv').config();
const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Helper to generate a clean URL slug
function slugify(text) {
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
function cleanTitle(filename) {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  // Format CamelCase or hyphenated or number prefixed names
  return nameWithoutExt
    .replace(/^[0-9]+[_\-\s]*/, '') // remove leading numbers if any
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Process a single file from Google Drive through the pipeline
 */
async function processDriveFile(file, folderName) {
  console.log(`\n--------------------------------------------------`);
  console.log(`[Content-Orchestrator] Processing: "${file.name}" in folder "${folderName}"`);

  // 1. Classifier step
  let type = 'unknown';
  if (folderName.includes('Videos') || file.mimeType.includes('video')) {
    type = 'video';
  } else if (folderName.includes('Blog') || file.mimeType.includes('document') || file.name.endsWith('.md')) {
    type = 'blog';
  } else if (folderName.includes('PWTW') || file.mimeType.includes('image')) {
    type = 'pwtw';
  } else if (folderName.includes('Future')) {
    type = 'future';
  }

  const slug = slugify(file.name);
  const title = cleanTitle(file.name);

  console.log(`[Classifier] Type: "${type}" | Suggested Title: "${title}" | Slug: "${slug}"`);

  // 2. Specialist Processing
  let contentPayload = {
    type,
    title,
    slug,
    body: '',
    media_url: null,
    thumbnail_url: null,
    tags: [],
    status: 'draft',
    metadata: {
      driveFileId: file.id,
      originalFilename: file.name,
      folderName,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
    },
  };

  if (type === 'pwtw') {
    // PWTW Specialist
    const mediaUrl = `/api/drive-image/${file.id}`;
    const thumbnailUrl = `/api/drive-image/${file.id}`;

    contentPayload.body = `### ${title}\n\nVisual story from ${folderName}. Stored as draft for review.\n\n> "Every image tells a thousand words."`;
    contentPayload.media_url = mediaUrl;
    contentPayload.thumbnail_url = thumbnailUrl;
    contentPayload.tags = ['AI', 'Enterprise', 'Visual Essay', 'Infographic'];
    contentPayload.metadata.alt_text = title;
  } else if (type === 'blog') {
    // Blog Specialist
    contentPayload.body = `### ${title}\n\nDraft article content synced from Google Drive file: \`${file.name}\`.\n\n*Review and edit before publishing.*`;
    contentPayload.tags = ['Blog', 'Draft'];
  } else if (type === 'video') {
    // Video Specialist
    contentPayload.body = `### ${title}\n\nVideo notes and overview. Awaiting YouTube link attachment.`;
    contentPayload.tags = ['Video', 'Draft'];
  }

  // 3. Publisher Step: Save to PostgreSQL strictly as draft
  const saved = await prisma.content.upsert({
    where: { slug: contentPayload.slug },
    update: {
      type: contentPayload.type,
      title: contentPayload.title,
      body: contentPayload.body,
      media_url: contentPayload.media_url,
      thumbnail_url: contentPayload.thumbnail_url,
      tags: contentPayload.tags,
      status: 'draft', // STRICTLY ENFORCE DRAFT
      metadata: contentPayload.metadata,
    },
    create: {
      type: contentPayload.type,
      title: contentPayload.title,
      slug: contentPayload.slug,
      body: contentPayload.body,
      media_url: contentPayload.media_url,
      thumbnail_url: contentPayload.thumbnail_url,
      tags: contentPayload.tags,
      status: 'draft', // STRICTLY ENFORCE DRAFT
      metadata: contentPayload.metadata,
    },
  });

  console.log(`[Publisher] ✓ Stored draft in PostgreSQL database: ID "${saved.id}" (Status: ${saved.status})`);
  return saved;
}

/**
 * Scan all subfolders of "My Agentic Website" in Google Drive
 */
async function syncGoogleDrive() {
  console.log('🔄 Scanning Google Drive for new/updated files...');

  // 1. Get the subfolders inside My Agentic Website
  const foldersRes = await drive.files.list({
    q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name, parents)',
  });

  const targetFolders = foldersRes.data.files.filter(
    (f) =>
      f.name.includes('01_Videos') ||
      f.name.includes('02_Blog') ||
      f.name.includes('03_PWTW') ||
      f.name.includes('04_Future')
  );

  console.log(`Found ${targetFolders.length} content folders in Drive.`);

  let totalProcessed = 0;

  for (const folder of targetFolders) {
    const filesRes = await drive.files.list({
      q: `'${folder.id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name, mimeType, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink)',
    });

    const files = filesRes.data.files || [];
    if (files.length > 0) {
      console.log(`\n📁 Folder: "${folder.name}" (${files.length} file(s) found)`);
      for (const file of files) {
        try {
          await processDriveFile(file, folder.name);
          totalProcessed++;
        } catch (err) {
          console.error(`[Error-Handler] Failed processing file "${file.name}":`, err.message);
        }
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`✨ Sync Complete! Total items processed: ${totalProcessed}`);
}

// Allow running standalone or as a continuous watcher
if (process.argv.includes('--watch')) {
  // Read interval from env var DRIVE_SYNC_INTERVAL_MINUTES, default to 60 minutes (1 hour)
  const intervalMinutes = parseInt(process.env.DRIVE_SYNC_INTERVAL_MINUTES || '60', 10);
  const INTERVAL_MS = intervalMinutes * 60 * 1000;

  const displayTime =
    intervalMinutes >= 60
      ? `${intervalMinutes / 60} hour(s)`
      : `${intervalMinutes} minute(s)`;

  console.log(`🚀 Starting continuous Google Drive Watcher (polling every ${displayTime})...`);

  // Run initial sync immediately on startup, then every interval
  syncGoogleDrive();
  setInterval(syncGoogleDrive, INTERVAL_MS);
} else {
  syncGoogleDrive()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
