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
 * Automatically ensures PostgreSQL ENUM types and tables exist
 */
export async function ensureDatabaseTables(): Promise<void> {
  if (!process.env.DATABASE_URL) return;

  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      try {
        // 1. Create ContentType ENUM
        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
            CREATE TYPE "ContentType" AS ENUM ('video', 'blog', 'pwtw', 'future');
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `);

        // 2. Create ContentStatus ENUM
        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
            CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published');
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `);

        // 3. Create Content table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "content" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "type" "ContentType" NOT NULL,
            "title" TEXT NOT NULL,
            "slug" TEXT NOT NULL UNIQUE,
            "body" TEXT NOT NULL,
            "media_url" TEXT,
            "thumbnail_url" TEXT,
            "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
            "status" "ContentStatus" NOT NULL DEFAULT 'draft',
            "published_at" TIMESTAMP(3),
            "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // 4. Ensure column types match enums if table was created previously with text
        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
            ALTER TABLE "content" ALTER COLUMN "type" TYPE "ContentType" USING "type"::"ContentType";
          EXCEPTION
            WHEN others THEN null;
          END $$;
        `);

        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
            ALTER TABLE "content" ALTER COLUMN "status" TYPE "ContentStatus" USING "status"::"ContentStatus";
          EXCEPTION
            WHEN others THEN null;
          END $$;
        `);

        // 5. Create ContactSubmission table
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

        // 6. Create indexes
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "content_type_status_idx" ON "content"("type", "status");
        `);
        await prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS "content_slug_idx" ON "content"("slug");
        `);
      } catch (err: any) {
        console.warn('Auto database table check warning:', err.message);
      }
    })();
  }

  return dbInitPromise;
}

export default prisma;
