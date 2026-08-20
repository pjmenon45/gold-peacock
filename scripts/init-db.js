// Zero-dependency Database Health Check & Initializer
// Pings the Next.js server, which automatically executes ensureDatabaseTables()

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function init() {
  console.log(`🚀 Checking database connectivity via ${SITE_URL}/api/content ...`);
  try {
    const res = await fetch(`${SITE_URL}/api/content`);
    const data = await res.json();

    if (res.ok && data.success) {
      console.log(`✨ Database tables ready! Found ${data.count || 0} published item(s).`);
    } else {
      console.log(`✓ Database ping completed:`, data);
    }
  } catch (error) {
    console.error(`❌ Health check failed:`, error.message);
  }
}

init();
