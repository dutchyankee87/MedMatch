# MedMatch - Project Guide for Claude Code

## What is MedMatch?

MedMatch is a **Vendor Management System (VMS)** for Dutch healthcare staffing. It connects healthcare organizations (hospitals, care homes) with staffing agencies (uitzendbureaus) to fill temporary positions. The platform handles the full lifecycle: posting staffing requests, submitting candidates, managing placements, tracking hours (with Dutch ORT surcharges), and invoicing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL via Supabase |
| ORM | Drizzle ORM (`postgres-js` driver) |
| Auth | Clerk (with Dutch localization, role-based routing) |
| Email | Resend (Dutch-language templates) |
| UI | shadcn/ui (New York style), Tailwind CSS, Lucide icons |
| Forms | React Hook Form + Zod |
| State | TanStack React Query |
| PDF | @react-pdf/renderer |
| Webhooks | Svix (Clerk webhook verification) |

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (TS errors block, ESLint does not)
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema directly (dev shortcut)
npm run db:studio    # Open Drizzle Studio (DB browser)
```

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── requests/           # Staffing request CRUD
│   │   ├── submissions/        # Candidate submission + status updates
│   │   ├── hours/              # Hour registration + approval
│   │   ├── invoices/           # Invoice generation + status
│   │   └── webhooks/clerk/     # Clerk user sync webhook
│   ├── org/                    # Hospital portal (/org/*)
│   │   ├── dashboard/
│   │   ├── requests/           # Create & manage staffing requests
│   │   ├── placements/
│   │   ├── hours/              # Approve submitted hours
│   │   ├── invoices/
│   │   └── settings/
│   ├── agency/                 # Staffing agency portal (/agency/*)
│   │   ├── dashboard/
│   │   ├── requests/           # Browse & respond to requests
│   │   ├── candidates/         # Manage candidate pool
│   │   ├── placements/
│   │   ├── hours/              # Register hours worked
│   │   ├── invoices/
│   │   └── settings/
│   └── auth/                   # Login & registration pages
├── components/
│   ├── ui/                     # shadcn/ui primitives (24 components)
│   └── layout/                 # Sidebar, Header
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── db/
│   │   ├── schema.ts           # All Drizzle table + relation definitions
│   │   └── index.ts            # getDb() with lazy initialization
│   ├── ort.ts                  # ORT calculation engine + Dutch holidays
│   ├── email.ts                # Resend email service + Dutch templates
│   ├── supabase.ts             # Supabase client (storage only)
│   └── utils.ts                # cn() helper
└── middleware.ts               # Clerk auth + role-based route protection
```

## Architecture Patterns

### Dual-Portal Design
Two completely separate portals sharing the same backend:
- **`/org/*`** — Hospital portal (blue theme). Creates requests, reviews candidates, approves hours, pays invoices.
- **`/agency/*`** — Agency portal (emerald theme). Browses requests, submits candidates, registers hours, generates invoices.

Each portal has its own sidebar, dashboard, and navigation. The `<Sidebar type="org" | "agency" />` component renders portal-specific nav items.

### Role-Based Routing (Middleware)
Clerk session claims contain `metadata.role` (`org_user` | `agency_user` | `admin`). Middleware enforces:
- Unauthenticated users → redirect to `/login`
- `org_user` trying `/agency/*` → redirect to `/org/dashboard`
- `agency_user` trying `/org/*` → redirect to `/agency/dashboard`
- Public routes (no auth): `/`, `/login`, `/register`, `/api/webhooks`

### Lazy Initialization
Both `getDb()` and `getResend()` use lazy initialization to avoid build-time errors when env vars aren't available. Always call `getDb()` instead of instantiating a new client.

### Server vs Client Components
Pages are server components by default. Use `"use client"` only when needed (forms, interactive state, `usePathname`, etc.). Layout components (sidebar, header) are client components.

## Database Conventions

### Schema Location
Single schema file: `src/lib/db/schema.ts`. All tables, relations, and type exports live here.

### Database Access
```typescript
import { getDb } from '@/lib/db';
import { requests, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

const db = getDb();

// Query with relations
const results = await db.query.requests.findMany({
  where: eq(requests.organizationId, orgId),
  orderBy: [desc(requests.createdAt)],
  with: { organization: true, submissions: true },
});

// Insert with returning
const [newRecord] = await db.insert(requests).values({...}).returning();
```

### Tables & Their Roles

| Table | Purpose | Status Flow |
|-------|---------|-------------|
| `organizations` | Healthcare institutions (KVK, address, ORT settings) | — |
| `agencies` | Staffing agencies | — |
| `users` | Clerk-linked users (role, org/agency FK) | — |
| `candidates` | Agency candidate pool (function, BIG number, qualifications) | — |
| `requests` | Staffing requests from orgs | `open` → `in_review` → `filled` / `cancelled` |
| `submissions` | Agency responses with candidate + rate | `pending` → `accepted` / `rejected` / `withdrawn` |
| `orderConfirmations` | Formal agreements (locked rate, dates) | — |
| `hourRegistrations` | Time tracking with ORT breakdowns | `pending` → `approved` / `disputed` |
| `invoices` | Billing with line items + ORT | `draft` → `sent` → `paid` |
| `ortSettings` | Configurable ORT surcharge rates | — |
| `messages` | In-app communication | — |

### Key Relations
- `organizations` → `users`, `requests`, `orderConfirmations`, `invoices`
- `agencies` → `users`, `candidates`, `submissions`, `orderConfirmations`, `invoices`
- `requests` → `submissions`, `orderConfirmations`
- `orderConfirmations` → `hourRegistrations`, `invoices`

### Type Exports
Schema exports `$inferSelect` and `$inferInsert` types for all tables:
```typescript
import type { Request, NewRequest, Submission, User } from '@/lib/db/schema';
```

## API Conventions

### Auth Pattern (every route)
```typescript
const { userId } = await auth();
if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const user = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

// Role check
if (user.role !== 'org_user' || !user.organizationId) {
  return NextResponse.json({ error: 'Only organization users can do this' }, { status: 403 });
}
```

### Response Format
```typescript
// Success
return NextResponse.json({ success: true, data: result });

// Error
return NextResponse.json({ error: 'Description' }, { status: 4xx });
```

### Data Scoping
All queries filter by the user's `organizationId` or `agencyId` — users only see their own data. Cross-entity ownership is verified before mutations.

## Business Logic

### ORT Calculation (`src/lib/ort.ts`)
ORT (Onregelmatigheidstoeslag) is the Dutch irregular hours surcharge system for healthcare:

| Period | Rate | Multiplier |
|--------|------|-----------|
| Evening (18:00–22:00) | 22% toeslag | 1.22 |
| Night (22:00–06:00) | 40% toeslag | 1.40 |
| Weekend (Sat/Sun) | 35% toeslag | 1.35 |
| Holiday (feestdagen) | 100% toeslag | 2.00 |

**Key rules:**
- Holiday rate **replaces** weekend rate (no double-counting)
- Evening/night rates can stack with weekend/holiday
- ORT amount = hours × hourlyRate × (multiplier - 1)
- Rates are configurable per organization via `ortSettings` table

### Dutch Holidays (`getDutchHolidays()`)
Calculates both fixed and Easter-based holidays:
- **Fixed:** Nieuwjaarsdag, Koningsdag (Apr 27), Bevrijdingsdag (May 5), Kerstdagen (Dec 25-26)
- **Easter-based:** Pasen, Hemelvaart (+39d), Pinksteren (+49/50d) — uses Anonymous Gregorian algorithm

### Invoice Calculation
- Generated from approved `hourRegistrations` for a date range
- Line items include regular hours + each ORT type separately
- VAT = 21% of (subtotal + ORT total)
- Payment terms: 30 days

### Core Workflow
```
Org creates Request (open)
  → Agencies notified via email
  → Agency submits Candidate (pending)
    → Org reviews → accepts one (→ filled, others auto-rejected)
      → OrderConfirmation created
        → Agency registers hours (pending)
          → Org approves hours (approved)
            → Agency generates invoice (draft → sent → paid)
```

## Email Notifications (`src/lib/email.ts`)
All in Dutch, sent via Resend. Templates:
1. `newRequestNotification` — to agencies when org creates request
2. `submissionReceivedNotification` — to org when agency submits candidate
3. `submissionStatusNotification` — to agency on accept/reject (color-coded)
4. `hoursSubmittedNotification` — to org when hours need approval
5. `invoiceGeneratedNotification` — to org when invoice is sent

## Environment Variables

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register/organization
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Email (Resend)
RESEND_API_KEY=
FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
```

## Component Conventions

- **shadcn/ui** components are in `src/components/ui/` (New York style, HSL CSS variables for theming)
- Import path alias: `@/*` maps to `src/*`
- Icons: `lucide-react` exclusively
- Dates: `date-fns` with Dutch locale (`nl`)
- Currency: `Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })`

## Key Files Quick Reference

| File | What it does |
|------|-------------|
| `src/lib/db/schema.ts` | All tables, relations, type exports |
| `src/lib/db/index.ts` | `getDb()` lazy DB client |
| `src/lib/ort.ts` | ORT engine, Dutch holidays, currency formatting |
| `src/lib/email.ts` | Resend email service + 5 Dutch templates |
| `src/middleware.ts` | Clerk auth, role-based route guards |
| `src/components/layout/sidebar.tsx` | Dual-portal sidebar (org/agency) |
| `src/app/api/webhooks/clerk/route.ts` | Clerk → DB user sync |
| `drizzle.config.ts` | Drizzle ORM configuration |
