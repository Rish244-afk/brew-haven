# Brew Haven — Full-Stack Next.js Application

A production-ready full-stack website and management system for **Brew Haven** boutique cafe, built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Stripe Checkout**, **Resend Email**, and **NextAuth.js**.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up local SQLite database
npx prisma db push --schema=prisma/schema.sqlite.prisma

# 3. Seed initial menu items & admin account
npx ts-node prisma/seed.ts

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
- **Admin Login:** `http://localhost:3000/admin/login`
- **Default Email:** `admin@brewhaven.co`
- **Default Password:** `HavenAdminSecretPassword123!`

---

## 🌐 Deploying to Vercel (Production)

### 1. Push Code to GitHub
Push this repository to your GitHub account.

### 2. Create PostgreSQL Database (Neon or Supabase)
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy the PostgreSQL connection string (`DATABASE_URL`).

### 3. Import Project into Vercel
1. Go to [Vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repository.
2. Under **Environment Variables**, add:

| Variable Name | Value / Description |
| --- | --- |
| `DATABASE_URL` | Your Neon / Supabase PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` or any random 32-char string |
| `NEXTAUTH_URL` | `https://<your-vercel-domain>.vercel.app` |
| `STRIPE_SECRET_KEY` | `sk_test_...` (from Stripe Dashboard → Developers → API keys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (from Stripe Dashboard) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Stripe Dashboard → Webhooks) |
| `RESEND_API_KEY` | `re_...` (from Resend.com dashboard) |
| `ADMIN_EMAIL` | `admin@brewhaven.co` |
| `ADMIN_PASSWORD` | Your custom secure password |

3. Click **Deploy**.

### 4. Seed Production Database
Once deployed, run database migrations and seed from your local terminal pointing to your production `DATABASE_URL`:

```bash
DATABASE_URL="your-production-postgres-url" npx prisma db push
DATABASE_URL="your-production-postgres-url" npx ts-node prisma/seed.ts
```

### 5. Stripe Webhook Setup
In Stripe Dashboard: **Developers → Webhooks → Add Endpoint**
- **URL:** `https://<your-vercel-domain>.vercel.app/api/webhooks/stripe`
- **Events to send:** `checkout.session.completed`
- Copy the **Signing secret** (`whsec_...`) and update `STRIPE_WEBHOOK_SECRET` in Vercel settings.

---

## 🎨 Visual Identity & Features

- **Brand Aesthetic:** Warm, unhurried, editorial mood ("Coffee is not rushed — it is respected").
- **Typography:** `Cormorant Garamond` serif headings with italic accents + `Jost` sans-serif body.
- **Cart & Ordering:** Zustand cart store persisted in browser `localStorage`.
- **Server-Verified Checkout:** `/order/confirmation` verifies Stripe session server-side before displaying order receipt.
- **Protected Admin Dashboard:** Middleware-secured `/admin/*` routes for menu CRUD, order fulfillment, table reservations, and concierge inbox.
