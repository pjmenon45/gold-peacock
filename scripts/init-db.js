try { require('dotenv').config(); } catch (e) {}
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initDb() {
  console.log('🚀 Initializing PostgreSQL tables...');

  try {
    // 1. Create content table if not exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "content" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "body" TEXT NOT NULL,
        "media_url" TEXT,
        "thumbnail_url" TEXT,
        "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "status" TEXT NOT NULL DEFAULT 'draft',
        "published_at" TIMESTAMP(3),
        "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Content table ready.');

    // 2. Create contact_submission table if not exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "contact_submission" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ ContactSubmission table ready.');

    // 3. Create indexes if not exist
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "content_type_status_idx" ON "content"("type", "status");
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "content_slug_idx" ON "content"("slug");
    `);

    console.log('✨ PostgreSQL database initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDb();
