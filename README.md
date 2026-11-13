# IngatWaktu

> **Ingat Aku, Ingat Waktu** — Aplikasi jadwal dan manajemen waktu harian dengan desain premium gelap, kalender interaktif, time-blocking, dan pelacakan kebiasaan.

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui primitives + Framer Motion
- **Database**: SQLite (dev) / PostgreSQL (production) via Prisma ORM
- **Auth**: NextAuth.js v4 (Credentials, JWT) + bcrypt
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup Lokal (SQLite)

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client & push schema (SQLite)
npx prisma generate
npx prisma db push

# 3. Seed database (creates admin + demo user, sample data)
npm run db:seed

# 4. Run dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Akun default (hasil seed)

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@ingatwaktu.id  | admin123 |
| Demo  | demo@ingatwaktu.id   | demo1234 |

## Deploy ke Vercel / Netlify (PostgreSQL)

Aplikasi siap deploy ke platform serverless. Karena filesystem serverless bersifat ephemeral, **production menggunakan PostgreSQL** (bukan SQLite).

### 1. Siapkan database PostgreSQL (gratis)

- **Vercel Postgres** — langsung dari dashboard Vercel
- **Neon** (https://neon.tech) — free tier, koneksi serverless
- **Supabase** (https://supabase.com) — free tier
- **Railway** (https://railway.app) — mulai $5/bulan

Setelah membuat database, salin connection string `postgresql://...` ke environment variable:

| Variable | Nilai |
|----------|-------|
| `DATABASE_URL` | `postgresql://user:password@host:5432/db?schema=public` |
| `NEXTAUTH_SECRET` | hasil `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL deployment (contoh `https://ingatwaktu.vercel.app`) |

> `vercel.json` sudah dikonfigurasi: saat build, `schema.postgres.prisma` disalin menjadi `schema.prisma`, kemudian `prisma generate` + `prisma db push` dijalankan otomatis.

### 2. Deploy ke Vercel

```bash
npm i -g vercel
vercel login
vercel
```

Atau hubungkan repo GitHub ke Vercel. Framework terdeteksi otomatis (`Next.js`).

### 3. Deploy ke Netlify

- Build command: `cp prisma/schema.postgres.prisma prisma/schema.prisma && prisma generate && prisma db push --skip-generate && next build`
- Output directory: `.next`
- Env vars sama seperti di atas (tambahkan `NEXT_PUBLIC_*` jika diperlukan).

### 4. Seed database production (sekali saja)

```bash
# dari lokal — pastikan .env berisi DATABASE_URL postgres
npm run db:generate:pg
npm run db:push:pg
npm run db:seed:pg
```

## Scripts

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Start dev server (SQLite) |
| `npm run build` | Build production |
| `npm run start` | Start production server |
| `npm run db:seed` | Seed SQLite (dev) |
| `npm run db:generate:pg` | Generate client (PostgreSQL schema) |
| `npm run db:push:pg` | Push PostgreSQL schema |
| `npm run db:seed:pg` | Seed PostgreSQL (production) |

## Struktur

```
src/
├── app/
│   ├── api/            # route handlers (tasks, habits, categories, profile, auth)
│   ├── (auth)/         # login, register
│   ├── (dashboard)/    # protected: dashboard, calendar, tasks, focus
│   ├── layout.tsx
│   └── page.tsx        # landing premium
├── components/
│   ├── ui/             # shadcn primitives
│   ├── calendar/       # calendar components
│   ├── tasks/          # task components
│   ├── landing/        # landing page sections
│   └── layout/         # sidebar, topbar
├── lib/                # utils, prisma client, auth
├── types/
└── styles/
```

## Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--bg-deep` | `#0A1628` | Page background |
| `--bg-elevated` | `#112240` | Cards |
| `--primary` | `#2E86DE` | Buttons, active states |
| `--bone` | `#F5F0E8` | Primary text |
| `--bone-muted` | `#C9C0B0` | Secondary text |
| `--accent-gold` | `#D4A843` | Highlights, streaks |