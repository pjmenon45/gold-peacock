import { ContentItem } from '@/types';

export const INITIAL_CONTENT: ContentItem[] = [
  // -------------------------------------------------------------
  // VIDEOS
  // -------------------------------------------------------------
  {
    id: 'vid-1',
    type: 'video',
    title: 'Building Agentic AI Systems from Scratch: Architecture & Workflows',
    slug: 'building-agentic-ai-systems-architecture',
    body: `### Overview

In this comprehensive deep dive, we explore how autonomous AI agent architectures have evolved beyond simple prompt chains into robust, deterministic state machines with self-correcting feedback loops.

#### Key Topics Covered:
1. **Perception & Context Windows**: Optimizing prompt tokens and caching mechanisms.
2. **Tool Calling & Sandboxed Execution**: Secure terminal and filesystem interaction patterns.
3. **Multi-Agent Orchestration**: Hierarchical task division vs. collaborative consensus.
4. **Resilient Recovery**: Handling timeouts, rate limits, and model hallucination.

\`\`\`typescript
interface AgentAction {
  tool: string;
  parameters: Record<string, any>;
  rationale: string;
}
\`\`\`

> "The true measure of an agentic workflow is not how fast it completes easy steps, but how gracefully it recovers from unexpected failures."

#### Resources & Links
- GitHub Repository with source examples
- Full slides and architectural diagrams
- Benchmark comparisons between single-agent and swarm paradigms`,
    media_url: 'https://www.youtube.com/watch?v=sal78ACtGTc',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Agents', 'Architecture', 'TypeScript', 'System Design'],
    status: 'published',
    published_at: '2026-07-28T14:00:00.000Z',
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
    body: `### Building for the Long Term

A pragmatic guide to architecting modern web apps that prioritize maintainability, minimal dependencies, and rapid developer iteration.

#### What We Cover:
- Server Components vs. Client Components: When to use each without over-engineering.
- Database optimization: Connection pooling, indexing strategies, and schema migrations.
- Minimalist design systems: Crafting clean typography and purposeful color palettes.

Watch the full walkthrough above, and check out the accompanying code samples on GitHub.`,
    media_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js', 'Web Development', 'Postgres', 'Tailwind'],
    status: 'published',
    published_at: '2026-06-15T11:30:00.000Z',
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
    body: `### Less, But Better

Why the best software is often what you choose *not* to build. In this video essay, we explore the design principles behind Dieter Rams, Unix philosophy, and modern software craft.

#### Core Principles:
- Single responsibility modules.
- Zero unnecessary dependencies.
- Calming, high-contrast user interfaces that respect human focus.`,
    media_url: 'https://www.youtube.com/watch?v=VqCgcpAypFQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Philosophy', 'Design', 'Minimalism', 'Productivity'],
    status: 'published',
    published_at: '2026-05-10T09:00:00.000Z',
    metadata: {
      duration: '18:22',
      youtubeId: 'VqCgcpAypFQ',
      featured: true,
      difficulty: 'General',
    },
  },

  // -------------------------------------------------------------
  // BLOG POSTS
  // -------------------------------------------------------------
  {
    id: 'blog-1',
    type: 'blog',
    title: 'Designing for Calm: The Aesthetics of Minimalist Web Applications',
    slug: 'designing-for-calm-aesthetics-minimalist-web',
    body: `Modern digital products suffer from an epidemic of distraction. Flashing badges, auto-playing banners, and visual clutter compete relentlessly for human attention.

In this essay, we explore how embracing restraint, generous whitespace, and a disciplined color palette creates interfaces that feel restorative, trustworthy, and undeniably premium.

---

### The Power of Generous Whitespace

Whitespace is not empty space; it is structural punctuation. When you increase the breathing room around a headline or card:
- The reader's cognitive load drops immediately.
- The visual hierarchy clarifies itself without requiring heavy drop shadows or rainbow borders.
- The content takes center stage.

Inspired by typography traditions from editorial print and companies like Anthropic and Linear, restraint elevates everyday content into thoughtful communication.

\`\`\`css
/* Clean spacing tokens */
:root {
  --space-unit: 1.5rem;
  --bg-primary: #FAF9F5;
  --text-primary: #141413;
  --text-secondary: #6B6B6B;
}
\`\`\`

### A Disciplined Palette

A strict palette of warm neutrals accented by a single thoughtful tone—such as **Burnt Orange (\`#D97757\`)**—conveys confidence. When color is used sparingly, its appearance carries genuine meaning: a primary call-to-action, an active link, or a focused state.

> "Simplicity is about subtracting the obvious and adding the meaningful." — John Maeda

### Building for the Long Term

When you design with calm principles, your interface doesn't look dated after the next web design trend fades. It remains functional, timeless, and delightful to use.`,
    media_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design', 'Philosophy', 'UI/UX', 'Typography'],
    status: 'published',
    published_at: '2026-08-01T10:00:00.000Z',
    metadata: {
      readTime: '6 min read',
      featured: true,
      author: 'Author',
    },
  },
  {
    id: 'blog-2',
    type: 'blog',
    title: 'Deterministic State Machines in Agentic Workflows',
    slug: 'deterministic-state-machines-in-agentic-workflows',
    body: `As Large Language Models become more capable, the challenge in software engineering shifts from raw generation to reliability and predictability.

When deploying autonomous agents in production environments, leaving control flow purely to stochastic prompting leads to brittle edge cases.

### Why State Machines Matter

By defining discrete, typed states for your agentic pipeline:
1. **Guaranteed Transitions**: The agent can only perform valid operations corresponding to the current state.
2. **Explicit Fallbacks**: If a step errors out, a deterministic recovery branch is triggered rather than an unbounded retry loop.
3. **Auditable Trails**: Every state change produces a discrete telemetry log.

### Implementation Pattern

\`\`\`typescript
type AgentState = 
  | { status: 'idle' }
  | { status: 'planning'; query: string }
  | { status: 'executing'; step: number; tool: string }
  | { status: 'verifying'; output: unknown }
  | { status: 'completed'; result: string };
\`\`\`

By enforcing rigorous types and state machines, we combine the creative reasoning of generative AI with the dependability of classical software engineering.`,
    media_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Agents', 'TypeScript', 'Engineering', 'State Machines'],
    status: 'published',
    published_at: '2026-07-12T16:00:00.000Z',
    metadata: {
      readTime: '8 min read',
      featured: true,
      author: 'Author',
    },
  },
  {
    id: 'blog-3',
    type: 'blog',
    title: 'The Art of Writing Concise Technical Specifications',
    slug: 'art-of-writing-concise-technical-specifications',
    body: `A specification document should not be a sprawling novel. It should be a crisp, actionable blueprint that aligns engineers, designers, and AI tools around a singular vision.

### Key Sections of a High-Impact Spec:
- **Problem Statement**: What problem are we solving and for whom?
- **Non-Goals**: Explicitly what we are *not* building.
- **Data Model**: The schema and relationships.
- **Verification Plan**: How we test and validate success.

Keeping specs brief ensures they are actually read, referenced, and updated throughout a project's lifecycle.`,
    media_url: null,
    thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    tags: ['Writing', 'Engineering Management', 'Best Practices'],
    status: 'published',
    published_at: '2026-06-20T08:15:00.000Z',
    metadata: {
      readTime: '4 min read',
      featured: false,
      author: 'Author',
    },
  },

  // -------------------------------------------------------------
  // PWTW (PICTURE WORTH THOUSAND WORDS)
  // -------------------------------------------------------------
  {
    id: 'pwtw-1',
    type: 'pwtw',
    title: 'Solitude at Dawn: The Geometry of Kyoto Mist',
    slug: 'solitude-at-dawn-kyoto-mist',
    body: `### The Moment

Standing at the edge of the bamboo groves in Arashiyama at 5:30 AM before the city awakes. The morning fog softens the harsh contrasts of the world, reducing towering stalks to gradients of muted emerald and charcoal.

Photography is less about capturing the object and more about preserving the feeling of silence in that specific fraction of a second.

#### Technical Reflection:
Shooting in low light with diffused mist requires embracing grain and subtle shadows. Rather than fighting dynamic range, leaning into the deep shadows gives the composition its meditative weight.

> "In the stillness of the early hour, every shadow has a story to tell."`,
    media_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Photography', 'Kyoto', 'Visual Essay', 'Landscape'],
    status: 'published',
    published_at: '2026-08-05T06:00:00.000Z',
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
    body: `### Architectural Rhythm

Brutalist concrete structures possess an unapologetic honesty. The sharp diagonal shadows cast across the facade reveal the deliberate rhythm conceived by the architect decades ago.

Look closely at the texture of the board-formed concrete—the wood grain of the original moulds remains etched into the stone permanently.`,
    media_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'Brutalism', 'Black & White', 'Street'],
    status: 'published',
    published_at: '2026-07-18T14:30:00.000Z',
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
    body: `### Light as a Medium

As the sun dips below the horizon, the wet tidal sand transforms into a mirror. The boundary between earth and sky blurs, and for twenty minutes, the entire world is bathed in warm burnt ochre and slate blue.`,
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Coast', 'Golden Hour', 'Ocean', 'Serenity'],
    status: 'published',
    published_at: '2026-06-25T19:45:00.000Z',
    metadata: {
      camera: 'Fujifilm X-T5',
      lens: 'XF 16-55mm f/2.8 R LM WR',
      settings: '23mm • f/4.0 • 1/250s • ISO 160',
      location: 'Big Sur, California',
      featured: false,
    },
  },
];
