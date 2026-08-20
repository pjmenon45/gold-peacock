import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

let dbInitPromise: Promise<void> | null = null;

/**
 * Automatically ensures PostgreSQL tables exist without manual migrations
 */
export async function ensureDatabaseTables(): Promise<void> {
  if (!process.env.DATABASE_URL) return;

  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
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

        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "content_type_status_idx" ON "content"("type", "status");
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "content_slug_idx" ON "content"("slug");
        `);
      } catch (err: any) {
        console.warn('Auto database table check:', err.message);
      }
    })();
  }

  return dbInitPromise;
}

export default prisma;
