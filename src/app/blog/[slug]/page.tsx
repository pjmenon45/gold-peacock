import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ChevronRight, Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import { getContentBySlug, getRelatedContent, getContentItems } from '@/lib/content';
import { MarkdownViewer } from '@/components/content/MarkdownViewer';
import { ContentCard } from '@/components/content/ContentCard';
import { Badge } from '@/components/ui/Badge';

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const item = await getContentBySlug(params.slug, 'blog');
  if (!item) {
    return { title: 'Post Not Found' };
  }
  return {
    title: item.title,
    description: item.body.slice(0, 160).replace(/[#*`]/g, ''),
    openGraph: {
      title: item.title,
      images: item.thumbnail_url ? [item.thumbnail_url] : [],
    },
  };
}

export async function generateStaticParams() {
  const items = await getContentItems({ type: 'blog', status: 'published' });
  return items.map((item) => ({ slug: item.slug }));
}

export const revalidate = 60;

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const item = await getContentBySlug(params.slug, 'blog');

  if (!item) {
    notFound();
  }

  const related = await getRelatedContent(item.slug, 'blog', 3);

  const formattedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const readTime = item.metadata?.readTime;
  const author = item.metadata?.author || 'Poorni Menon';

  return (
    <div className="mx-auto max-w-4xl px-6 sm:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link
          href="/blog"
          className="hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Blog</span>
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-foreground truncate max-w-[280px] sm:max-w-md">
          {item.title}
        </span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} size="sm" variant="accent">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pt-2 border-b border-border/80 pb-6">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <User className="h-3.5 w-3.5 text-accent" />
            <span>{author}</span>
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}

          {readTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Featured Cover Image (if available) */}
      {item.thumbnail_url && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-background-soft shadow-sm">
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <div className="mx-auto max-w-3xl pt-2">
        <MarkdownViewer content={item.body} />
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="border-t border-border pt-12 mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Related Essays
            </h2>
            <Link
              href="/blog"
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              View all posts →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ContentCard key={p.id} item={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
