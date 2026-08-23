// Zero-dependency Google Drive Sync Trigger & Continuous Watcher
// Uses native Node.js fetch to call the protected Admin API

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ADMIN_API_KEY =
  process.env.ADMIN_API_KEY ||
  'test-admin-secret-key-change-me';

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

async function triggerSync(isInitial = false) {
  const timestamp = getTimestamp();
  console.log(`[${timestamp}] 🔄 Checking Google Drive for new/modified/deleted content...`);

  try {
    const res = await fetch(`${SITE_URL}/api/admin/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_API_KEY}`,
        'x-api-key': ADMIN_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log(`[${timestamp}] ✨ ${data.message}`);

    const updatedItems = data.data?.items?.filter(
      (i) => i.action === 'created' || i.action === 'updated'
    ) || [];

    if (updatedItems.length > 0) {
      console.log(`[${timestamp}] 📝 Updated/Created Items (${updatedItems.length}):`);
      updatedItems.forEach((item) => {
        const path = item.type === 'video' ? 'videos' : item.type;
        console.log(
          `  ✓ [${item.type.toUpperCase()}] "${item.title}" (${item.action}) -> /${path}/${item.slug}`
        );
      });
    }

    if (data.data?.deletedItems && data.data.deletedItems.length > 0) {
      console.log(`[${timestamp}] 🗑️ Deleted/Removed Items (${data.data.deletedItems.length}):`);
      data.data.deletedItems.forEach((item) => {
        const path = item.type === 'video' ? 'videos' : item.type;
        console.log(`  🗑️ [${item.type.toUpperCase()}] "${item.title}" -> Removed from /${path}/${item.slug}`);
      });
    }

    if (updatedItems.length === 0 && (!data.data?.deletedItems || data.data.deletedItems.length === 0)) {
      console.log(`[${timestamp}] 💤 No changes detected in Google Drive.`);
    }

    if (data.data?.errors && data.data.errors.length > 0) {
      console.warn(`[${timestamp}] ⚠️ Warnings/Errors:`);
      data.data.errors.forEach((e) => console.warn(`  - ${e.filename}: ${e.error}`));
    }
    return true;
  } catch (error) {
    console.error(`[${timestamp}] ❌ Sync check failed:`, error.message);
    return false;
  }
}

async function startWatcher() {
  // Default to 1 minute for near real-time automatic detection
  const intervalMinutes = parseFloat(process.env.DRIVE_SYNC_INTERVAL_MINUTES || '1');
  const INTERVAL_MS = Math.max(15000, Math.floor(intervalMinutes * 60 * 1000));
  const display = intervalMinutes >= 60 ? `${intervalMinutes / 60} hour(s)` : `${intervalMinutes} minute(s)`;

  console.log(`🚀 Starting 24/7 Google Drive Sync Watcher (Checking every ${display})...`);
  console.log(`🎯 Target Endpoint: ${SITE_URL}/api/admin/sync\n`);

  // Wait for the app container to be ready on initial startup
  let ready = false;
  let attempts = 0;
  while (!ready && attempts < 15) {
    attempts++;
    ready = await triggerSync(true);
    if (!ready) {
      console.log(`⏳ Waiting for app to be ready (attempt ${attempts}/15)...`);
      await new Promise((r) => setTimeout(r, 4000));
    }
  }

  // Periodic Watcher Loop
  setInterval(async () => {
    await triggerSync(false);
  }, INTERVAL_MS);
}

if (process.argv.includes('--watch')) {
  startWatcher();
} else {
  triggerSync();
}
