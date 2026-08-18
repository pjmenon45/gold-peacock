const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SEED_CONTENT = [
  // VIDEOS
  {
    id: 'vid-1',
    type: 'video',
    title: 'Building Agentic AI Systems from Scratch: Architecture & Workflows',
    slug: 'building-agentic-ai-systems-architecture',
    body: `### Overview\n\nIn this comprehensive deep dive, we explore how autonomous AI agent architectures have evolved beyond simple prompt chains into robust, deterministic state machines with self-correcting feedback loops.\n\n#### Key Topics Covered:\n1. **Perception & Context Windows**: Optimizing prompt tokens and caching mechanisms.\n2. **Tool Calling & Sandboxed Execution**: Secure terminal and filesystem interaction patterns.\n3. **Multi-Agent Orchestration**: Hierarchical task division vs. collaborative consensus.\n4. **Resilient Recovery**: Handling timeouts, rate limits, and model hallucination.`,
    media_url: 'https://www.youtube.com/watch?v=sal78ACtGTc',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Agents', 'Architecture', 'TypeScript', 'System Design'],
    status: 'published',
    published_at: new Date('2026-07-28T14:00:00.000Z'),
    metadata: {
      duration: '42:15',
      youtubeId: 'sal78ACtGTc',
      featured: true,
      difficulty: 'Advanced',
    },
  },
  {
    id: 'vid-2',
    type: 'video',
    title: 'Modern Web Engineering: Next.js App Router, Postgres & Tailwind',
    slug: 'modern-web-engineering-nextjs-postgres-tailwind',
    body: `### Building for the Long Term\n\nA pragmatic guide to architecting modern web apps that prioritize maintainability, minimal dependencies, and rapid developer iteration.\n\n#### What We Cover:\n- Server Components vs. Client Components: When to use each without over-engineering.\n- Database optimization: Connection pooling, indexing strategies, and schema migrations.\n- Minimalist design systems: Crafting clean typography and purposeful color palettes.`,
    media_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js', 'Web Development', 'Postgres', 'Tailwind'],
    status: 'published',
    published_at: new Date('2026-06-15T11:30:00.000Z'),
    metadata: {
      duration: '31:40',
      youtubeId: 'wm5gMKuwSYk',
      featured: false,
      difficulty: 'Intermediate',
    },
  },
  {
    id: 'vid-3',
    type: 'video',
    title: 'The Philosophy of Minimalist Software: Cutting the Noise',
    slug: 'philosophy-of-minimalist-software',
    body: `### Less, But Better\n\nWhy the best software is often what you choose *not* to build. In this video essay, we explore the design principles behind Dieter Rams, Unix philosophy, and modern software craft.\n\n#### Core Principles:\n- Single responsibility modules.\n- Zero unnecessary dependencies.\n- Calming, high-contrast user interfaces that respect human focus.`,
    media_url: 'https://www.youtube.com/watch?v=VqCgcpAypFQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Philosophy', 'Design', 'Minimalism', 'Productivity'],
    status: 'published',
    published_at: new Date('2026-05-10T09:00:00.000Z'),
    metadata: {
      duration: '18:22',
      youtubeId: 'VqCgcpAypFQ',
      featured: true,
      difficulty: 'General',
    },
  },

  // BLOG
  {
    id: 'blog-1',
    type: 'blog',
    title: 'Designing for Calm: The Aesthetics of Minimalist Web Applications',
    slug: 'designing-for-calm-aesthetics-minimalist-web',
    body: `Modern digital products suffer from an epidemic of distraction. Flashing badges, auto-playing banners, and visual clutter compete relentlessly for human attention.\n\nIn this essay, we explore how embracing restraint, generous whitespace, and a disciplined color palette creates interfaces that feel restorative, trustworthy, and undeniably premium.\n\n### The Power of Generous Whitespace\n\nWhitespace is not empty space; it is structural punctuation. When you increase the breathing room around a headline or card, the reader's cognitive load drops immediately.\n\n### A Disciplined Palette\n\nA strict palette of warm neutrals accented by a single thoughtful tone—such as Burnt Orange (\`#D97757\`)—conveys confidence.`,
    media_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design', 'Philosophy', 'UI/UX', 'Typography'],
    status: 'published',
    published_at: new Date('2026-08-01T10:00:00.000Z'),
    metadata: {
      readTime: '6 min read',
      featured: true,
      author: 'Poorni Menon',
    },
  },
  {
    id: 'blog-2',
    type: 'blog',
    title: 'Deterministic State Machines in Agentic Workflows',
    slug: 'deterministic-state-machines-in-agentic-workflows',
    body: `As Large Language Models become more capable, the challenge in software engineering shifts from raw generation to reliability and predictability.\n\nWhen deploying autonomous agents in production environments, leaving control flow purely to stochastic prompting leads to brittle edge cases.\n\n### Why State Machines Matter\n\nBy defining discrete, typed states for your agentic pipeline, you achieve guaranteed transitions, explicit fallbacks, and auditable trails.`,
    media_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Agents', 'TypeScript', 'Engineering', 'State Machines'],
    status: 'published',
    published_at: new Date('2026-07-12T16:00:00.000Z'),
    metadata: {
      readTime: '8 min read',
      featured: true,
      author: 'Poorni Menon',
    },
  },
  {
    id: 'blog-3',
    type: 'blog',
    title: 'The Art of Writing Concise Technical Specifications',
    slug: 'art-of-writing-concise-technical-specifications',
    body: `A specification document should not be a sprawling novel. It should be a crisp, actionable blueprint that aligns engineers, designers, and AI tools around a singular vision.\n\n### Key Sections of a High-Impact Spec:\n- Problem Statement: What problem are we solving and for whom?\n- Non-Goals: Explicitly what we are not building.\n- Data Model: The schema and relationships.\n- Verification Plan: How we test and validate success.`,
    media_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    tags: ['Writing', 'Engineering Management', 'Best Practices'],
    status: 'published',
    published_at: new Date('2026-06-20T08:15:00.000Z'),
    metadata: {
      readTime: '4 min read',
      featured: false,
      author: 'Poorni Menon',
    },
  },

  // PWTW
  {
    id: 'pwtw-1',
    type: 'pwtw',
    title: 'Solitude at Dawn: The Geometry of Kyoto Mist',
    slug: 'solitude-at-dawn-kyoto-mist',
    body: `### The Moment\n\nStanding at the edge of the bamboo groves in Arashiyama at 5:30 AM before the city awakes. The morning fog softens the harsh contrasts of the world, reducing towering stalks to gradients of muted emerald and charcoal.\n\nPhotography is less about capturing the object and more about preserving the feeling of silence in that specific fraction of a second.`,
    media_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Photography', 'Kyoto', 'Visual Essay', 'Landscape'],
    status: 'published',
    published_at: new Date('2026-08-05T06:00:00.000Z'),
    metadata: {
      camera: 'Leica Q2',
      lens: 'Summilux 28mm f/1.7',
      settings: '28mm • f/2.8 • 1/125s • ISO 400',
      location: 'Kyoto, Japan',
      featured: true,
    },
  },
  {
    id: 'pwtw-2',
    type: 'pwtw',
    title: 'Urban Monolith: Concrete & Shadows in Modern Architecture',
    slug: 'urban-monolith-concrete-shadows',
    body: `### Architectural Rhythm\n\nBrutalist concrete structures possess an unapologetic honesty. The sharp diagonal shadows cast across the facade reveal the deliberate rhythm conceived by the architect decades ago.`,
    media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'Brutalism', 'Black & White', 'Street'],
    status: 'published',
    published_at: new Date('2026-07-18T14:30:00.000Z'),
    metadata: {
      camera: 'Sony A7R V',
      lens: 'FE 24-70mm f/2.8 GM II',
      settings: '35mm • f/5.6 • 1/500s • ISO 100',
      location: 'London, UK',
      featured: true,
    },
  },
  {
    id: 'pwtw-3',
    type: 'pwtw',
    title: 'Golden Hour Reflections on the Atlantic Coast',
    slug: 'golden-hour-reflections-atlantic-coast',
    body: `### Light as a Medium\n\nAs the sun dips below the horizon, the wet tidal sand transforms into a mirror. The boundary between earth and sky blurs, and for twenty minutes, the entire world is bathed in warm burnt ochre and slate blue.`,
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Coast', 'Golden Hour', 'Ocean', 'Serenity'],
    status: 'published',
    published_at: new Date('2026-06-25T19:45:00.000Z'),
    metadata: {
      camera: 'Fujifilm X-T5',
      lens: 'XF 16-55mm f/2.8 R LM WR',
      settings: '23mm • f/4.0 • 1/250s • ISO 160',
      location: 'Big Sur, California',
      featured: false,
    },
  },
];

async function main() {
  console.log('Seeding PostgreSQL database with initial content...');

  for (const item of SEED_CONTENT) {
    await prisma.content.upsert({
      where: { slug: item.slug },
      update: {
        type: item.type,
        title: item.title,
        body: item.body,
        media_url: item.media_url,
        thumbnail_url: item.thumbnail_url,
        tags: item.tags,
        status: item.status,
        published_at: item.published_at,
        metadata: item.metadata,
      },
      create: {
        id: item.id,
        type: item.type,
        title: item.title,
        slug: item.slug,
        body: item.body,
        media_url: item.media_url,
        thumbnail_url: item.thumbnail_url,
        tags: item.tags,
        status: item.status,
        published_at: item.published_at,
        metadata: item.metadata,
      },
    });
    console.log(`✓ Upserted: [${item.type.toUpperCase()}] ${item.title}`);
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
