import { prisma } from './db';
import { INITIAL_CONTENT } from './seed-data';
import {
  ContentFilterOptions,
  ContentItem,
  ContentType,
  CreateContentInput,
  UpdateContentInput,
  ContactSubmission,
} from '@/types';

// In-memory memory store as fallback when PostgreSQL is not yet connected/migrated
let inMemoryContent: ContentItem[] = [...INITIAL_CONTENT];
let inMemorySubmissions: ContactSubmission[] = [];

let lastDbCheckTime = 0;
let lastDbAvailableStatus = false;
const DB_CHECK_COOLDOWN_MS = 10000; // Check at most once every 10s if failing

/**
 * Check if the Prisma database connection is live and the table exists.
 */
async function isDatabaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  
  const now = Date.now();
  if (now - lastDbCheckTime < DB_CHECK_COOLDOWN_MS) {
    return lastDbAvailableStatus;
  }

  try {
    lastDbCheckTime = now;
    await prisma.content.count();
    lastDbAvailableStatus = true;
    return true;
  } catch (error) {
    lastDbAvailableStatus = false;
    return false;
  }
}

/**
 * Fetch published or all content items with filtering, sorting, and pagination
 */
export async function getContentItems(options: ContentFilterOptions = {}): Promise<ContentItem[]> {
  const { type, status = 'published', tag, limit, featuredOnly } = options;

  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const where: any = {};

      if (type) {
        where.type = type;
      }
      if (status) {
        where.status = status;
      }
      if (tag) {
        where.tags = { has: tag };
      }

      let items = await prisma.content.findMany({
        where,
        orderBy: [{ published_at: 'desc' }, { created_at: 'desc' }],
        take: limit,
      });

      let mapped: ContentItem[] = items.map((item) => ({
        id: item.id,
        type: item.type as ContentType,
        title: item.title,
        slug: item.slug,
        body: item.body,
        media_url: item.media_url,
        thumbnail_url: item.thumbnail_url,
        tags: item.tags,
        status: item.status as any,
        published_at: item.published_at,
        metadata: (item.metadata as Record<string, any>) || {},
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      if (featuredOnly) {
        mapped = mapped.filter((item) => item.metadata?.featured === true);
      }

      return mapped;
    } catch (err) {
      console.warn('Prisma query failed, falling back to local store:', err);
    }
  }

  // Fallback to in-memory seed dataset
  let results = [...inMemoryContent];

  if (type) {
    results = results.filter((item) => item.type === type);
  }
  if (status) {
    results = results.filter((item) => item.status === status);
  }
  if (tag) {
    results = results.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }
  if (featuredOnly) {
    results = results.filter((item) => item.metadata?.featured === true);
  }

  // Sort by published_at desc
  results.sort((a, b) => {
    const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return timeB - timeA;
  });

  if (limit && limit > 0) {
    results = results.slice(0, limit);
  }

  return results;
}

/**
 * Fetch a single content item by slug
 */
export async function getContentBySlug(
  slug: string,
  type?: ContentType
): Promise<ContentItem | null> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const item = await prisma.content.findUnique({
        where: { slug },
      });
      if (item) {
        if (type && item.type !== type) return null;
        return {
          id: item.id,
          type: item.type as ContentType,
          title: item.title,
          slug: item.slug,
          body: item.body,
          media_url: item.media_url,
          thumbnail_url: item.thumbnail_url,
          tags: item.tags,
          status: item.status as any,
          published_at: item.published_at,
          metadata: (item.metadata as Record<string, any>) || {},
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }
    } catch (err) {
      console.warn('Prisma query by slug failed, falling back:', err);
    }
  }

  const found = inMemoryContent.find(
    (item) => item.slug === slug && (!type || item.type === type)
  );
  return found || null;
}

/**
 * Fetch a single content item by ID (used by admin routes)
 */
export async function getContentById(id: string): Promise<ContentItem | null> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      const item = await prisma.content.findUnique({ where: { id } });
      if (item) {
        return {
          id: item.id,
          type: item.type as ContentType,
          title: item.title,
          slug: item.slug,
          body: item.body,
          media_url: item.media_url,
          thumbnail_url: item.thumbnail_url,
          tags: item.tags,
          status: item.status as any,
          published_at: item.published_at,
          metadata: (item.metadata as Record<string, any>) || {},
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }
    } catch (err) {
      console.warn('Prisma query by id failed, falling back:', err);
    }
  }

  return inMemoryContent.find((item) => item.id === id) || null;
}

/**
 * Create a new content item (used by Admin API)
 */
export async function createContent(input: CreateContentInput): Promise<ContentItem> {
  const dbAvailable = await isDatabaseAvailable();

  const publishedAt = input.status === 'published'
    ? (input.published_at ? new Date(input.published_at) : new Date())
    : (input.published_at ? new Date(input.published_at) : null);

  if (dbAvailable) {
    const created = await prisma.content.create({
      data: {
        type: input.type,
        title: input.title,
        slug: input.slug,
        body: input.body,
        media_url: input.media_url || null,
        thumbnail_url: input.thumbnail_url || null,
        tags: input.tags || [],
        status: input.status || 'draft',
        published_at: publishedAt,
        metadata: input.metadata || {},
      },
    });

    return {
      id: created.id,
      type: created.type as ContentType,
      title: created.title,
      slug: created.slug,
      body: created.body,
      media_url: created.media_url,
      thumbnail_url: created.thumbnail_url,
      tags: created.tags,
      status: created.status as any,
      published_at: created.published_at,
      metadata: (created.metadata as Record<string, any>) || {},
      created_at: created.created_at,
      updated_at: created.updated_at,
    };
  }

  const newItem: ContentItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: input.type,
    title: input.title,
    slug: input.slug,
    body: input.body,
    media_url: input.media_url || null,
    thumbnail_url: input.thumbnail_url || null,
    tags: input.tags || [],
    status: input.status || 'draft',
    published_at: publishedAt,
    metadata: input.metadata || {},
    created_at: new Date(),
    updated_at: new Date(),
  };

  inMemoryContent.unshift(newItem);
  return newItem;
}

/**
 * Update an existing content item
 */
export async function updateContent(
  id: string,
  input: UpdateContentInput
): Promise<ContentItem | null> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    const data: any = {};
    if (input.type !== undefined) data.type = input.type;
    if (input.title !== undefined) data.title = input.title;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.body !== undefined) data.body = input.body;
    if (input.media_url !== undefined) data.media_url = input.media_url;
    if (input.thumbnail_url !== undefined) data.thumbnail_url = input.thumbnail_url;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.status !== undefined) {
      data.status = input.status;
      if (input.status === 'published' && !input.published_at) {
        data.published_at = new Date();
      }
    }
    if (input.published_at !== undefined) {
      data.published_at = input.published_at ? new Date(input.published_at) : null;
    }
    if (input.metadata !== undefined) data.metadata = input.metadata;

    const updated = await prisma.content.update({
      where: { id },
      data,
    });

    return {
      id: updated.id,
      type: updated.type as ContentType,
      title: updated.title,
      slug: updated.slug,
      body: updated.body,
      media_url: updated.media_url,
      thumbnail_url: updated.thumbnail_url,
      tags: updated.tags,
      status: updated.status as any,
      published_at: updated.published_at,
      metadata: (updated.metadata as Record<string, any>) || {},
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  const index = inMemoryContent.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const existing = inMemoryContent[index];
  const updatedItem: ContentItem = {
    ...existing,
    ...input,
    id: existing.id,
    updated_at: new Date(),
  };

  if (input.status === 'published' && !existing.published_at && !input.published_at) {
    updatedItem.published_at = new Date();
  }

  inMemoryContent[index] = updatedItem;
  return updatedItem;
}

/**
 * Delete a content item
 */
export async function deleteContent(id: string): Promise<boolean> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    try {
      await prisma.content.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  const initialLength = inMemoryContent.length;
  inMemoryContent = inMemoryContent.filter((item) => item.id !== id);
  return inMemoryContent.length < initialLength;
}

/**
 * Save contact submission
 */
export async function createContactSubmission(data: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<ContactSubmission> {
  const dbAvailable = await isDatabaseAvailable();

  if (dbAvailable) {
    const saved = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
      },
    });

    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      subject: saved.subject,
      message: saved.message,
      created_at: saved.created_at,
    };
  }

  const newSub: ContactSubmission = {
    id: `sub-${Date.now()}`,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    created_at: new Date(),
  };

  inMemorySubmissions.push(newSub);
  return newSub;
}

/**
 * Fetch related items for a given content item
 */
export async function getRelatedContent(
  currentSlug: string,
  type: ContentType,
  limit = 3
): Promise<ContentItem[]> {
  const allItems = await getContentItems({ type, status: 'published' });
  return allItems.filter((item) => item.slug !== currentSlug).slice(0, limit);
}
