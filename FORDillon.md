# MedMatch - A Deep Dive into Building a Healthcare Staffing Platform

## What We Built

MedMatch is a **Vendor Management System (VMS)** that connects Dutch healthcare organizations (hospitals, nursing homes) with staffing agencies. Think of it as a matchmaking platform, but instead of dating, we're matching nurses and healthcare workers with the hospitals that desperately need them.

The workflow is elegantly simple:
1. Hospital posts: "Hey, we need an IC nurse for 3 months"
2. Multiple agencies see this and submit their candidates: "Here's Anna, she's awesome, and she'll cost €52/hour"
3. Hospital reviews candidates, picks the best fit
4. System generates an order confirmation (basically a mini-contract)
5. Agency logs hours worked, hospital approves them
6. Invoice gets auto-generated with all the complex Dutch overtime calculations (ORT)

## The Tech Stack - Why These Choices?

### Next.js 14 with App Router
We went with Next.js 14's App Router because it gives us the best of both worlds:
- **Server Components** for pages that don't need interactivity (list views, detail pages)
- **Client Components** for interactive forms and dynamic UI

The App Router's file-based routing made organizing our dual-portal structure intuitive:
```
/org/dashboard      → Hospital portal
/agency/dashboard   → Staffing agency portal
```

### Drizzle ORM over Prisma
Here's a hot take: Drizzle is actually better for this project. Why?
- **Type safety that actually works** - The inferred types from your schema are incredible
- **SQL-like syntax** - If you know SQL, you know Drizzle
- **Lightweight** - No heavy CLI or generation step needed

Example of how clean Drizzle queries are:
```typescript
const request = await db.query.requests.findFirst({
  where: eq(requests.id, requestId),
  with: {
    organization: true,
    submissions: {
      with: { candidate: true }
    }
  }
});
```

### Clerk for Auth
Clerk handles all the authentication headaches:
- User management
- Session handling
- Role-based access (org_user vs agency_user)
- Dutch localization (nlNL) out of the box

The middleware we wrote (`src/middleware.ts`) automatically routes users to their correct portal based on their role.

### shadcn/ui Components
Not a component library you install - it's a collection of beautifully designed components you copy into your project. This means:
- Full control over the code
- No version conflicts
- Easy to customize

## The Database Schema - A Story of Relationships

```
Organization ─┬─ creates ─→ Request
              │              ↓
              │         Submission ←─ Agency ─┬─ has ─→ Candidate
              │              ↓                │
              └─ OrderConfirmation ←──────────┘
                       ↓
              HourRegistration
                       ↓
                   Invoice
```

The schema tells the story of how a staffing request flows through the system. Each table builds on the previous one, creating a clear audit trail from initial request to final invoice.

### The ORT Challenge

ORT (Onregelmatigheidstoeslag) is the Dutch system for calculating overtime and irregular hours surcharges. It's complex:
- Evening hours (18:00-22:00): +22%
- Night hours (22:00-06:00): +40%
- Weekend hours: +35%
- Holiday hours: +100%

We built a dedicated calculation engine (`src/lib/ort.ts`) that handles all this complexity. The tricky part? Some rates can stack (night + weekend), and Dutch holidays need to be calculated dynamically (Easter-based holidays move every year).

## Architecture Patterns Worth Noting

### Lazy Initialization for Build Safety
One bug that bit us: environment variables weren't available at build time. The solution? Lazy initialization:

```typescript
// DON'T do this - fails at build time
const db = drizzle(postgres(process.env.DATABASE_URL));

// DO this instead
let _db = null;
export function getDb() {
  if (!_db) {
    _db = drizzle(postgres(process.env.DATABASE_URL));
  }
  return _db;
}
```

This pattern is used throughout - for the database, Resend email client, and Supabase.

### Route Groups That Aren't Groups
Initially we tried Next.js route groups like `(org)` and `(agency)`, thinking they'd help organize code. Wrong! Route groups share URLs, which broke our dual-portal setup.

The fix was simple: just use regular directories (`org/` and `agency/`), which gives us distinct URL paths.

### Email Templates in Code
Rather than using a template service, we embedded HTML email templates directly in `src/lib/email.ts`. This keeps everything in one place and makes it easy to maintain the Dutch translations.

## Common Pitfalls We Avoided (Learn From Us!)

### 1. The Static Export Trap
Next.js tries to statically generate pages at build time. But pages using Clerk's auth need environment variables. Solution: either set all env vars before building, or add `export const dynamic = 'force-dynamic'` to pages that need runtime data.

### 2. TypeScript Strictness is Your Friend
The project uses strict TypeScript. Yes, it's more work upfront. But catching type errors before runtime? Priceless.

### 3. Client vs Server Component Confusion
A server component can't have `onClick` handlers. We had to mark interactive pages with `"use client"` at the top. The rule: if it has event handlers or uses hooks, it's a client component.

## The User Experience Philosophy

> "Het moet vooral simpel, overzichtelijk, weinig klikken, soepel lopen"
> (It should be simple, clear, few clicks, run smoothly)

This Dutch phrase from the requirements guided every design decision:

1. **3-Step Wizard for Requests** - Not a massive form, just: Function → Period → Details → Done
2. **One-Click Candidate Submission** - Select candidate, set rate, upload CV, submit
3. **Side-by-Side Comparison** - Hospital can compare all candidates at once
4. **Bulk Hour Approval** - Approve multiple hour entries with one click

## Files Worth Understanding

| File | Why It Matters |
|------|----------------|
| `src/lib/db/schema.ts` | The entire data model in one file. Every table, relationship, and type. |
| `src/lib/ort.ts` | The ORT calculation engine. Complex business logic, well-documented. |
| `src/middleware.ts` | Auth and routing logic. Controls who sees what. |
| `src/components/layout/sidebar.tsx` | The navigation hub. Shows how org vs agency UI differs. |
| `src/app/org/requests/new/page.tsx` | The 3-step wizard. Great example of form handling. |

## Getting This Running

1. Copy `.env.example` to `.env.local`
2. Fill in your credentials:
   - Supabase: Create a project, get the URL and keys
   - Clerk: Create an app, get the keys
   - Resend: Sign up for email API access
3. Push the schema: `npm run db:push`
4. Run dev server: `npm run dev`

## What's Next? (Future Improvements)

1. **Real-time Updates** - Supabase Realtime could notify agencies instantly when new requests drop
2. **PDF Generation** - Order confirmations and invoices as downloadable PDFs (we have @react-pdf/renderer ready)
3. **Roster Integration** - API for hospital roster systems to auto-create requests
4. **Mobile App** - React Native version for on-the-go hour registration

## Final Thoughts

Building a VMS is like building an assembly line - each step must feed cleanly into the next. The key insight is that healthcare staffing isn't just about matching people to jobs; it's about paperwork, compliance, and money. Our job was to make all that administrative burden disappear behind a clean interface.

The Dutch healthcare market has specific requirements (ORT calculations, BIG registration numbers, KvK business IDs) that generic staffing platforms miss. MedMatch is purpose-built for this market, speaking the language (literally - everything is in Dutch) and understanding the workflow.

---

*Built with enthusiasm, tested with patience, documented for future-you who will definitely forget how this works.*
