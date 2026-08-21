import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto bg-background transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border border-border/80 bg-white p-0.5 shadow-md">
                <Image
                  src="/logo.png"
                  alt="Vyooh Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-base font-bold text-foreground tracking-tight">
                Vyooh
              </p>
            </div>
            <p className="text-xs text-secondary max-w-sm">
              Exploring agentic software systems, modern engineering craft, and visual storytelling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-secondary font-medium">
            <Link href="/videos" className="hover:text-accent transition-colors">
              Videos
            </Link>
            <Link href="/blog" className="hover:text-accent transition-colors">
              Blog
            </Link>
            <Link href="/pwtw" className="hover:text-accent transition-colors">
              PWTW
            </Link>
            <Link href="/contact" className="hover:text-accent transition-colors">
              Contact
            </Link>
            <a
              href="/api/content"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Public API
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-secondary">
          <p>© {currentYear} Vyooh a Metavyooh company. Built with Next.js & PostgreSQL.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Agent API Ready</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
