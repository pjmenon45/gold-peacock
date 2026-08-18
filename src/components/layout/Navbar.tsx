'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '/videos', label: 'Videos' },
  { href: '/blog', label: 'Blog' },
  { href: '/pwtw', label: 'PWTW' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-nav transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white font-bold text-xs tracking-wider">
            GP
          </span>
          <span className="text-sm font-medium tracking-tight">Poorni Menon</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-lg ${
                  isActive
                    ? 'text-accent font-semibold bg-accent/5'
                    : 'text-secondary hover:text-foreground hover:bg-background-soft'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background hover:bg-background-soft text-secondary hover:text-foreground transition-colors"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Contact quick CTA on desktop */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-foreground text-background dark:bg-foreground dark:text-background rounded-xl hover:opacity-90 transition-all"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="flex h-9 w-9 md:hidden items-center justify-center rounded-xl border border-border bg-background text-secondary hover:text-foreground transition-colors"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-6 py-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-accent font-semibold bg-accent/5'
                  : 'text-secondary hover:text-foreground hover:bg-background-soft'
              }`}
            >
              Home
            </Link>
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-accent font-semibold bg-accent/5'
                      : 'text-secondary hover:text-foreground hover:bg-background-soft'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
