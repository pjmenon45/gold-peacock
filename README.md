# Gold Peacock — Personal Content Website

A modern, clean, minimal personal content website built with Next.js App Router, TypeScript, Tailwind CSS, and PostgreSQL. Designed for high readability, spacious typography, and seamless programmatic updates by autonomous AI agents.

---

## 🎨 Design System & Aesthetic Principles

Built strictly adhering to the Design Brief and [rules.md](.antigravity/rules.md):
- **Aesthetic**: Spacious, refined, calm, and trustworthy (inspired by Linear, Anthropic, and DeepLearning.AI).
- **Light Background**: `#FFFFFF` (pure white for cards/layers) & `#FAF9F5` (warm soft off-white).
- **Text / Primary**: `#141413` (rich near-black).
- **Secondary Text**: `#6B6B6B` (medium gray for captions, metadata, dates).
- **Borders & Dividers**: `#E5E5E5` (light gray).
- **Accent (Burnt Orange)**: `#D97757` (used sparingly for CTAs, active links, and highlights).
- **Accent Hover**: `#C45C3A`.
- **Dark Mode**: Full dark mode support with `#0F0F0E` background, `#FAF9F5` soft white text, and `#262624` borders.
- **Typography**: Inter font with generous line-height (`leading-relaxed` / 1.6–1.75).

---

## 📐 Project Structure & Sections

```
gold-peacock/
├── prisma/
│   ├── schema.prisma       # Exact PostgreSQL schema
│   └── seed.js             # Seed script for initial content
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/content/        # Protected Agent/Admin API routes
│   │   │   │   ├── route.ts          # GET (list all) & POST (create)
│   │   │   │   └── [id]/route.ts     # GET, PATCH, DELETE by ID
│   │   │   ├── content/route.ts      # Public read-only content endpoint
│   │   │   └── contact/route.ts      # Contact form submission endpoint
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog listing with tag filters
│   │   │   └── [slug]/page.tsx       # Single blog detail with typography focus
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact page with validated form
│   │   ├── pwtw/
│   │   │   ├── page.tsx              # PWTW photo gallery listing
│   │   │   └── [slug]/page.tsx       # PWTW detail with EXIF & Markdown essay
│   │   ├── videos/
│   │   │   ├── page.tsx              # Video library with tag filters
│   │   │   └── [slug]/page.tsx       # Video detail with responsive YouTube embed
│   │   ├── globals.css               # Theme variables & modern styles
│   │   ├── layout.tsx                # Inter font, ThemeProvider, Navbar, Footer
│   │   └── page.tsx                  # Home page (Hero, Featured, Previews, CTA)
│   ├── components/
│   │   ├── content/                  # ContentCard, SectionHeader, MarkdownViewer, etc.
│   │   ├── layout/                   # Navbar, Footer, ThemeProvider
│   │   └── ui/                       # Button, Badge, Input, Textarea
│   ├── lib/
│   │   ├── auth.ts                   # Admin API Key validator
│   │   ├── content.ts                # DB abstraction & fallback data layer
│   │   ├── db.ts                     # Prisma client singleton
│   │   └── seed-data.ts              # Rich seed dataset
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── Dockerfile                        # Multi-stage production container
├── docker-compose.yml                # Docker Compose with PostgreSQL
├── tailwind.config.ts                # Design tokens & typography config
└── package.json
```

---

## 🗄️ Database Schema

The database is defined in `prisma/schema.prisma` with the exact requested fields:

```prisma
enum ContentType {
  video
  blog
  pwtw
  future
}

enum ContentStatus {
  draft
  published
}

model Content {
  id            String        @id @default(uuid())
  type          ContentType
  title         String
  slug          String        @unique
  body          String        @db.Text
  media_url     String?       @map("media_url")
  thumbnail_url String?       @map("thumbnail_url")
  tags          String[]      @default([])
  status        ContentStatus @default(draft)
  published_at  DateTime?     @map("published_at")
  metadata      Json?         @default("{}")
  created_at    DateTime      @default(now()) @map("created_at")
  updated_at    DateTime      @updatedAt @map("updated_at")

  @@index([type, status, published_at(sort: Desc)])
  @@index([slug])
  @@map("content")
}

model ContactSubmission {
  id         String   @id @default(uuid())
  name       String
  email      String
  subject    String?
  message    String   @db.Text
  created_at DateTime @default(now()) @map("created_at")

  @@map("contact_submission")
}
```

---

## 🤖 Protected Admin API (For AI Agents & Automation)

AI agents can publish, update, and manage articles, videos, and photography stories using simple API key authentication.

### Authentication
Include either the `Authorization` header with a Bearer token or the `x-api-key` header matching `ADMIN_API_KEY`:
```http
Authorization: Bearer your-admin-api-key
```
or
```http
x-api-key: your-admin-api-key
```

### 1. Create Content (`POST /api/admin/content`)
```bash
curl -X POST https://yourdomain.com/api/admin/content \
  -H "Authorization: Bearer your-admin-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "title": "Autonomous Agent Workflows in Production",
    "slug": "autonomous-agent-workflows-in-production",
    "body": "### Introduction\n\nDetailed markdown article body...",
    "tags": ["AI Agents", "Architecture", "Engineering"],
    "status": "published",
    "metadata": {
      "readTime": "5 min read",
      "featured": true
    }
  }'
```

### 2. List All Content (Drafts & Published) (`GET /api/admin/content`)
```bash
curl -X GET "https://yourdomain.com/api/admin/content?type=video&status=draft" \
  -H "Authorization: Bearer your-admin-api-key"
```

### 3. Update Content (`PATCH /api/admin/content/{id}`)
```bash
curl -X PATCH https://yourdomain.com/api/admin/content/item-uuid-or-id \
  -H "Authorization: Bearer your-admin-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "title": "Updated Title"
  }'
```

### 4. Delete Content (`DELETE /api/admin/content/{id}`)
```bash
curl -X DELETE https://yourdomain.com/api/admin/content/item-uuid-or-id \
  -H "Authorization: Bearer your-admin-api-key"
```

---

## 🌐 Public Read API

- **`GET /api/content`**: Returns published items.
  - Query parameters:
    - `?type=video|blog|pwtw`
    - `?tag=AI Agents`
    - `?limit=6`
    - `?featured=true`

- **`POST /api/contact`**: Handles contact form submission with validation.
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Collaboration Inquiry",
    "message": "Hello, I would love to connect..."
  }
  ```

---

## 🚀 Quick Start (Local Development)

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` and `ADMIN_API_KEY`.

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 3. Push Prisma Schema & Seed Database (Optional when Postgres is running)
```bash
npm run prisma:push
npm run db:seed
```

---

## 🚢 DigitalOcean Droplet Deployment

### Option A: Deploy via Docker Compose (Recommended)
1. Clone the repository onto your DigitalOcean droplet:
   ```bash
   git clone https://github.com/pjmenon45/gold-peacock.git
   cd gold-peacock
   ```
2. Create your `.env` file with a secure `ADMIN_API_KEY`:
   ```bash
   echo "ADMIN_API_KEY=$(openssl rand -hex 24)" >> .env
   ```
3. Launch with Docker Compose:
   ```bash
   docker compose up -d --build
   ```

### Option B: Deploy with PM2 & Node.js
```bash
npm install
npm run prisma:generate
npm run build
pm2 start npm --name "gold-peacock" -- start
```
