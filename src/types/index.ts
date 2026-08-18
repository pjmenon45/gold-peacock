export type ContentType = 'video' | 'blog' | 'pwtw' | 'future';
export type ContentStatus = 'draft' | 'published';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  body: string;
  media_url?: string | null;
  thumbnail_url?: string | null;
  tags: string[];
  status: ContentStatus;
  published_at?: Date | string | null;
  metadata?: Record<string, any> | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  created_at?: Date | string;
}

export interface ContentFilterOptions {
  type?: ContentType;
  status?: ContentStatus;
  tag?: string;
  limit?: number;
  featuredOnly?: boolean;
}

export interface CreateContentInput {
  type: ContentType;
  title: string;
  slug: string;
  body: string;
  media_url?: string | null;
  thumbnail_url?: string | null;
  tags?: string[];
  status?: ContentStatus;
  published_at?: string | Date | null;
  metadata?: Record<string, any>;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  id?: string;
}
