// Zero-dependency Google Drive Sync Trigger CLI
// Uses native Node.js fetch to call the protected Admin API

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_API_KEY =
  process.env.ADMIN_API_KEY ||
  '7fc139e439cfb833a1bd07ff3929ebf2583429be15d335e4d114b42e5f2ef1ab';

async function triggerSync() {
  console.log(`🔄 Triggering Google Drive Sync via ${SITE_URL}/api/admin/sync ...`);

  try {
    const res = await fetch(`${SITE_URL}/api/admin/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    console.log(`✨ ${data.message}`);
    if (data.data?.items && data.data.items.length > 0) {
      console.log('\nProcessed Items:');
      data.data.items.forEach((item) => {
        const path = item.type === 'video' ? 'videos' : item.type;
        console.log(`✓ [${item.type.toUpperCase()}] "${item.title}" (${item.status}) -> /${path}/${item.slug}`);
      });
    } else {
      console.log('No new files to process.');
    }

    if (data.data?.deletedItems && data.data.deletedItems.length > 0) {
      console.log('\nDeleted / Removed Items:');
      data.data.deletedItems.forEach((item) => {
        const path = item.type === 'video' ? 'videos' : item.type;
        console.log(`🗑️  [${item.type.toUpperCase()}] "${item.title}" -> Removed from /${path}/${item.slug}`);
      });
    }

    if (data.data?.errors && data.data.errors.length > 0) {
      console.warn('\nWarnings/Errors:');
      data.data.errors.forEach((e) => console.warn(`- ${e.filename}: ${e.error}`));
    }
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

// Watcher mode support
if (process.argv.includes('--watch')) {
  const intervalMinutes = parseInt(process.env.DRIVE_SYNC_INTERVAL_MINUTES || '60', 10);
  const INTERVAL_MS = intervalMinutes * 60 * 1000;
  const display = intervalMinutes >= 60 ? `${intervalMinutes / 60} hour(s)` : `${intervalMinutes} minute(s)`;

  console.log(`🚀 Starting Google Drive sync watcher (polling every ${display})...`);
  triggerSync();
  setInterval(triggerSync, INTERVAL_MS);
} else {
  triggerSync();
}
