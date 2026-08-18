import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Poorni Menon — Personal Content & Engineering',
    template: '%s | Poorni Menon',
  },
  description:
    'Personal content website exploring autonomous AI systems, modern software engineering, and visual stories.',
  keywords: ['AI Agents', 'Software Engineering', 'Next.js', 'Photography', 'Technology', 'Blog'],
  authors: [{ name: 'Poorni Menon' }],
  creator: 'Poorni Menon',
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
