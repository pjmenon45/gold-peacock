import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Vyooh — Autonomous AI Systems & Engineering',
    template: '%s | Vyooh',
  },
  description:
    'Vyooh — Exploring autonomous AI systems, modern software engineering, and visual stories.',
  keywords: ['Vyooh', 'AI Agents', 'Software Engineering', 'Next.js', 'Photography', 'Technology', 'Blog'],
  authors: [{ name: 'Vyooh' }],
  creator: 'Vyooh',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-accent selection:text-white font-sans transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
