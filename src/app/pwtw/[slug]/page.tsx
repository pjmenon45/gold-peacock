import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react';
import { getContentBySlug, getRelatedContent, getContentItems } from '@/lib/content';
import { PhotoHero } from '@/components/content/PhotoHero';
import { MarkdownViewer } from '@/components/content/MarkdownViewer';
import { ContentCard } from '@/components/content/ContentCard';
import { Badge } from '@/components/ui/Badge';

interface PwtwDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PwtwDetailPageProps): Promise<Metadata> {
  const item = await getContentBySlug(params.slug, 'pwtw');
  if (!item) {
    return { title: 'Photo Story Not Found' };
  }
  return {
    title: `${item.title} — PWTW`,
    description: item.body.slice(0, 160).replace(/[#*`]/g, ''),
    openGraph: {
      title: item.title,
      images: item.media_url || item.thumbnail_url ? [item.media_url || item.thumbnail_url!] : [],
    },
  };
}

export async function generateStaticParams() {
  const items = await getContentItems({ type: 'pwtw', status: 'published' });
  return items.map((item) => ({ slug: item.slug }));
}

export const revalidate = 60;

export default async function PwtwDetailPage({ params }: PwtwDetailPageProps) {
  const item = await getContentBySlug(params.slug, 'pwtw');

  if (!item) {
    notFound();
  }

  const related = await getRelatedContent(item.slug, 'pwtw', 3);

  const formattedDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const photoUrl = item.media_url || item.thumbnail_url || '';

  return (
    <div className="mx-auto max-w-5xl px-6 sm:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary">
        <Link
          href="/pwtw"
          className="hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>PWTW Gallery</span>
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-foreground truncate max-w-[280px] sm:max-w-md">
          {item.title}
        </span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pt-1">
          {formattedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main High-Res Photography Presentation */}
      <PhotoHero
        imageUrl={photoUrl}
        title={item.title}
        metadata={item.metadata}
      />

      {/* Written Story / Essay in Markdown */}
      <div className="border-t border-border pt-8 mt-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-10">
          <MarkdownViewer content={item.body} />
        </div>
      </div>

      {/* More Visual Stories */}
      {related.length > 0 && (
        <div className="border-t border-border pt-12 mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              More Visual Stories
            </h2>
            <Link
              href="/pwtw"
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              View all stories →
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
