import React from 'react';
import Link from 'next/link';
import { ArrowRight, Video, BookOpen, Camera, Sparkles, Mail, Terminal } from 'lucide-react';
import { getContentItems } from '@/lib/content';
import { SectionHeader } from '@/components/content/SectionHeader';
import { ContentCard } from '@/components/content/ContentCard';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch published items
  const [featuredItems, recentVideos, recentBlogs, recentPwtw] = await Promise.all([
    getContentItems({ status: 'published', limit: 3, featuredOnly: true }),
    getContentItems({ type: 'video', status: 'published', limit: 3 }),
    getContentItems({ type: 'blog', status: 'published', limit: 3 }),
    getContentItems({ type: 'pwtw', status: 'published', limit: 3 }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      {/* -------------------------------------------------------------
          1. HERO SECTION
         ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background-soft px-3.5 py-1.5 text-xs text-secondary">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>Engineer • Builder • Visual Storyteller</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Engineering agentic systems, craft & stories.
          </h1>

          <p className="text-lg sm:text-xl text-secondary leading-relaxed max-w-2xl">
            Hi, we are <span className="font-semibold text-foreground">Vyooh a Metavyooh company</span>. We build autonomous AI workflows, provide AI Training, and capture moments worth a thousand words.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button href="/blog" variant="primary" size="md">
              <span>Read the Blog</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/videos" variant="secondary" size="md">
              <Video className="h-4 w-4 text-accent" />
              <span>Watch Videos</span>
            </Button>
            <Button href="/contact" variant="ghost" size="md">
              <span>Get in touch</span>
            </Button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. FEATURED CONTENT (HIGHLIGHTS)
         ------------------------------------------------------------- */}
      {featuredItems.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="border-t border-border/80 pt-12 sm:pt-16">
            <SectionHeader
              title="Featured Work"
              subtitle="Curated highlights spanning architecture, writing, and photography."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item, idx) => (
                <ContentCard key={item.id} item={item} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------
          3. LATEST VIDEOS
         ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="border-t border-border/80 pt-12 sm:pt-16">
          <SectionHeader
            title="Latest Videos"
            subtitle="Deep-dive tutorials, system design breakdowns, and technical talks."
            viewAllHref="/videos"
            viewAllText="View all videos"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <ContentCard key={video.id} item={video} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. LATEST FROM THE BLOG
         ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="border-t border-border/80 pt-12 sm:pt-16">
          <SectionHeader
            title="Latest from the Blog"
            subtitle="Essays on minimalism, agentic architectures, and engineering craft."
            viewAllHref="/blog"
            viewAllText="View all posts"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((post) => (
              <ContentCard key={post.id} item={post} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          5. PWTW (PICTURE WORTH THOUSAND WORDS) PREVIEW
         ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="border-t border-border/80 pt-12 sm:pt-16">
          <SectionHeader
            title="PWTW — Visual Stories"
            subtitle="Picture Worth Thousand Words: Photography paired with contemplative essays."
            viewAllHref="/pwtw"
            viewAllText="Explore gallery"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPwtw.map((photo) => (
              <ContentCard key={photo.id} item={photo} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. SHORT ABOUT / PERSONAL NOTE
         ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="rounded-3xl border border-border bg-background-soft/80 p-8 sm:p-12 transition-colors">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
              <Terminal className="h-4 w-4" />
              <span>About this site</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built from first principles for the agentic web.
            </h2>
            <p className="text-sm sm:text-base text-secondary leading-relaxed">
              This space serves as a central library for my research, videos, and photography. Designed with a strict minimal aesthetic inspired by Linear and Anthropic, it is powered by Next.js and PostgreSQL—structured with dedicated agent API keys so autonomous AI agents can maintain and publish new content programmatically.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                <span>Have a project or collaboration in mind? Let’s talk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          7. CONTACT CTA STRIP
         ------------------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-3xl border border-border bg-card shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Let’s build something extraordinary.
            </h3>
            <p className="text-xs sm:text-sm text-secondary">
              Reach out for consulting, technical speaking, or collaborative engineering.
            </p>
          </div>

          <Button href="/contact" variant="primary" size="md" className="shrink-0">
            <Mail className="h-4 w-4" />
            <span>Send a message</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
