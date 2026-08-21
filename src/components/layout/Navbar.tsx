'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';

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
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3.5 font-semibold text-foreground tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full border border-border/80 bg-white p-1 shadow-md transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Vyooh Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Vyooh</span>
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

        {/* Right action icons (Theme Toggle & Mobile Menu) */}
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-secondary hover:text-foreground hover:bg-background-soft transition-all duration-150"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4 text-accent" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-secondary hover:text-foreground hover:bg-background-soft transition-colors"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-6 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent font-semibold bg-accent/10'
                    : 'text-secondary hover:text-foreground hover:bg-background-soft'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
