# Next.js — Interview Questions & Answers

---

## Core Concepts

### 1. What is Next.js?

**Answer:** Next.js is a **React framework** for production. It extends React with:

- File-based routing
- Server-Side Rendering (SSR), Static Site Generation (SSG), ISR
- API routes and Server Actions
- Image and font optimization
- Built-in TypeScript support

Built by Vercel. Runs on Node.js. Used for full-stack React apps, e-commerce, dashboards, and marketing sites.

```bash
npx create-next-app@latest my-app
```

---

### 2. What is the difference between SSR, SSG, and ISR? When would you choose each?

**Answer:**

| Strategy | When HTML is built | Use case |
| --- | --- | --- |
| **SSG** | At build time | Blogs, docs, landing pages — rarely changes |
| **ISR** | Build time + background refresh | Product listings, news — semi-dynamic |
| **SSR** | On every request | Dashboards, auth pages — user-specific data |

**Rule of thumb:** Prefer SSG → ISR → SSR based on how dynamic your data is.

```tsx
// SSG — cached forever
fetch(url, { cache: "force-cache" });

// SSR — fresh every request
fetch(url, { cache: "no-store" });

// ISR — revalidate every 60 seconds
fetch(url, { next: { revalidate: 60 } });
```

---

### 3. What is the difference between Next.js and React?

**Answer:**

| React | Next.js |
| --- | --- |
| UI library | Full framework built on React |
| Client-side only (CRA) | SSR, SSG, ISR built-in |
| Manual routing setup | File-based routing |
| Manual bundling/config | Zero-config production build |
| No API layer | API routes + Server Actions |

React builds UI. Next.js adds routing, rendering strategies, and backend capabilities.

---

### 4. Explain React Server Components (RSC). How are they different from Client Components?

**Answer:**

| Feature | Server Component | Client Component |
| --- | --- | --- |
| Runs on | Server only | Browser (+ server during hydration) |
| Can use hooks | ❌ | ✅ |
| Can access DB/FS | ✅ | ❌ |
| Adds to JS bundle | ❌ | ✅ |
| Can handle events | ❌ | ✅ |

Server Components reduce bundle size and allow direct database access without an API layer. Add `"use client"` only when you need interactivity, hooks, or browser APIs.

```tsx
// Server Component (default)
async function ProductList() {
  const products = await db.products.findMany();
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Client Component
"use client";
export function AddToCart({ id }: { id: string }) {
  return <button onClick={() => addToCart(id)}>Add</button>;
}
```

---

### 5. What is the purpose of `"use client"` and `"use server"` directives?

**Answer:**

- **`"use client"`** — Marks a file as a Client Component. Required for hooks, event handlers, and browser APIs. Included in the JS bundle.
- **`"use server"`** — Marks a function as a Server Action. Runs on the server but callable from the client (form submissions, mutations). Replaces custom API routes for simple mutations.

By default, all components in App Router are Server Components.

```tsx
// Server Action
"use server";
export async function createPost(formData: FormData) {
  await db.posts.create({ data: { title: formData.get("title") } });
  revalidatePath("/posts");
}
```

---

### 6. What is hydration in Next.js? What causes hydration errors?

**Answer:** Hydration is when React attaches event listeners to server-rendered HTML to make it interactive. React expects client render output to **exactly match** server HTML.

**Common causes:**
- Using `window`, `localStorage` during render (not available on server)
- Rendering timestamps or random values
- Different locale/timezone on server vs client
- Conditional rendering based on `typeof window !== 'undefined'`

**Fixes:**
- Move browser-only code into `useEffect`
- Use `suppressHydrationWarning` for known mismatches (timestamps)
- Use `dynamic(() => import('./Component'), { ssr: false })` for client-only components

---

### 7. How does the App Router differ from the Pages Router?

**Answer:**

| | App Router (`app/`) | Pages Router (`pages/`) |
| --- | --- | --- |
| Data fetching | `async/await` in components | `getServerSideProps`, `getStaticProps` |
| Default component | Server Component | Client Component |
| Layouts | Nested `layout.tsx` | Manual via `_app.js` |
| Streaming | Native `<Suspense>` | Limited |
| Server Actions | ✅ | ❌ |
| Caching | Layered (Data Cache, Route Cache) | HTTP caching + manual |

App Router is the current standard (Next.js 13+). Pages Router is still supported but legacy.

---

## Data Fetching & Caching

### 8. How does data fetching work in the App Router?

**Answer:** Fetch directly inside Server Components with `async/await` — no special functions needed.

```tsx
async function Page() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return <div>{data.title}</div>;
}
```

**Cache options:**

```tsx
fetch(url, { cache: "force-cache" });     // SSG (default)
fetch(url, { cache: "no-store" });        // SSR
fetch(url, { next: { revalidate: 3600 } }); // ISR
fetch(url, { next: { tags: ["posts"] } });  // tag-based
```

**Revalidation:**

```tsx
import { revalidatePath, revalidateTag } from "next/cache";
revalidatePath("/posts");
revalidateTag("posts");
```

---

### 9. Explain Next.js caching layers in the App Router.

**Answer:**

| Cache | Scope | Control |
| --- | --- | --- |
| Request memoization | Single request | Automatic — deduplicates identical fetches |
| Data cache | Across requests | `cache: "no-store"`, `revalidate`, tags |
| Full route cache | Static routes | `revalidate`, `revalidatePath` |
| Router cache | Client navigation | Automatic (soft cache, 30s default) |

```tsx
// Opt out of data cache
const data = await fetch(url, { cache: "no-store" });

// Time-based revalidation
const data = await fetch(url, { next: { revalidate: 60 } });

// On-demand revalidation after mutation
revalidatePath("/products");
```

---

### 10. What are Server Actions? When would you use them vs API routes?

**Answer:** Server Actions are async functions marked with `"use server"` that run on the server and can be called from Client Components or forms.

```tsx
"use server";
export async function deleteUser(id: string) {
  await db.users.delete({ where: { id } });
  revalidatePath("/users");
}

// In component
<form action={deleteUser.bind(null, userId)}>
  <button type="submit">Delete</button>
</form>
```

| Server Actions | API Routes |
| --- | --- |
| Form mutations, CRUD | REST endpoints, webhooks |
| No HTTP layer needed | External clients need HTTP |
| Built-in revalidation | Manual response handling |
| Progressive enhancement | Full request/response control |

Use Server Actions for form submissions and mutations. Use API routes for external consumers or complex HTTP logic.

---

## Routing & Navigation

### 11. How does file-based routing work in the App Router?

**Answer:**

```
app/
├── page.tsx              → /
├── about/page.tsx        → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/page.tsx   → /blog/my-post
├── dashboard/
│   ├── layout.tsx        → shared dashboard layout
│   └── settings/page.tsx → /dashboard/settings
└── api/users/route.ts    → /api/users
```

| File | Purpose |
| --- | --- |
| `page.tsx` | Route UI |
| `layout.tsx` | Shared wrapper (persists on navigation) |
| `loading.tsx` | Loading skeleton |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |
| `route.ts` | API endpoint |

---

### 12. How does dynamic routing work? Explain catch-all and optional catch-all.

**Answer:**

```tsx
// Dynamic segment: app/products/[id]/page.tsx
// /products/42 → params.id = "42"
export default function Page({ params }: { params: { id: string } }) {
  return <p>Product {params.id}</p>;
}

// Catch-all: app/docs/[...slug]/page.tsx
// /docs/a/b/c → params.slug = ["a", "b", "c"]

// Optional catch-all: app/docs/[[...slug]]/page.tsx
// /docs → params.slug = undefined
// /docs/a/b → params.slug = ["a", "b"]
```

**Generate static paths at build:**

```tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
```

---

### 13. How do you handle redirects, 404s, and error boundaries?

**Answer:**

**Redirects:**
```tsx
// Static — next.config.js
{ source: "/old", destination: "/new", permanent: true }

// Dynamic — middleware or Server Component
import { redirect } from "next/navigation";
redirect("/login");

// Server Action
redirect("/dashboard");
```

**404:**
```tsx
// app/not-found.tsx — global 404 page
import { notFound } from "next/navigation";

async function Page({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound(); // triggers not-found.tsx
}
```

**Error boundaries:**
```tsx
// app/dashboard/error.tsx — must be Client Component
"use client";
export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

### 14. What is middleware in Next.js? Give a use case.

**Answer:** Middleware runs **before** a request completes — at the edge, before the route handler.

```tsx
// middleware.ts (project root)
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
```

**Use cases:** Auth guards, redirects, A/B testing, geo-routing, rate limiting, security headers.

---

## Performance & Optimization

### 15. How do you reduce bundle size in a Next.js app?

**Answer:**

- **Dynamic imports** — load heavy components on demand
- **Tree shaking** — named imports, not entire libraries
- **Bundle analyzer** — `@next/bundle-analyzer`
- **`next/image`** — optimized images, no manual lazy load
- **Route-based splitting** — automatic per-page chunks
- **Server Components** — zero JS for non-interactive UI

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // client-only
});
```

---

### 16. How does `next/image` work? What are the benefits?

**Answer:** `next/image` automatically optimizes images:

- Serves WebP/AVIF (smaller than JPEG/PNG)
- Lazy loads below-the-fold images
- Prevents layout shift with required `width`/`height`
- Responsive sizing via `sizes` prop
- On-demand resizing via Next.js image optimizer

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={400}
  priority              // preload above-fold
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Tradeoff:** Requires Next.js server (or Vercel) for optimization. Static export needs external CDN.

---

### 17. How does `Suspense` integrate with Next.js streaming?

**Answer:** `Suspense` shows a fallback while waiting for async data. In App Router, this enables **streaming SSR** — send the page shell immediately, stream deferred sections as data arrives.

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList /> {/* streams in when data ready */}
      </Suspense>
    </div>
  );
}
```

Improves Time to First Byte (TTFB) — users see content faster instead of waiting for all data.

---

### 18. What are Core Web Vitals and how do you improve them in Next.js?

**Answer:**

| Metric | Measures | Target | Next.js fix |
| --- | --- | --- | --- |
| **LCP** | Largest content paint time | < 2.5s | `next/image`, SSR/SSG, font optimization |
| **CLS** | Layout shift | < 0.1 | Explicit image dimensions, `next/font` |
| **INP** | Interaction responsiveness | < 200ms | Code splitting, Server Components, defer JS |

```tsx
// Improve LCP — priority image
<Image src="/hero.jpg" priority width={1200} height={600} />

// Improve CLS — self-hosted fonts
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

---

## State Management & React Patterns

### 19. How do you manage shared state across pages in Next.js?

**Answer:**

| Solution | Best for |
| --- | --- |
| **Context API** | Theme, auth user, locale — low-frequency updates |
| **Zustand** | App-level state — minimal boilerplate, no providers |
| **Redux Toolkit** | Complex async flows, large teams familiar with Redux |
| **React Query / SWR** | Server state — API data, caching, background refetch |

Server state (API data) should live in React Query/SWR, not global stores. Client UI state goes in Zustand or Context.

```tsx
// Zustand — persists across routes
import { create } from "zustand";
const useStore = create(set => ({
  count: 0,
  increment: () => set(s => ({ count: s.count + 1 })),
}));
```

---

### 20. How do you avoid unnecessary re-renders?

**Answer:**

- `React.memo` on expensive components with stable props
- `useMemo` for expensive computed values
- `useCallback` for stable function references passed to memoized children
- Avoid inline objects/arrays in JSX props
- Split Context into smaller contexts
- Zustand selectors — subscribe only to needed slice

```tsx
// Zustand selector — only re-renders when name changes
const name = useStore(state => state.user.name);
```

Profile with React DevTools before optimizing — premature memoization adds complexity.

---

## Authentication & Security

### 21. How would you implement authentication in Next.js?

**Answer:**

**Recommended pattern:** httpOnly cookies + middleware guard.

```tsx
// middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get("session");
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

// Login Server Action
"use server";
export async function login(formData: FormData) {
  const user = await validateCredentials(formData);
  cookies().set("session", createToken(user), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}
```

**Libraries:** NextAuth.js (Auth.js), Clerk, Lucia — handle OAuth, sessions, and CSRF.

---

### 22. Why should you NOT store JWTs in localStorage?

**Answer:** `localStorage` is accessible to any JavaScript on the page. An XSS attack can steal the token.

**Better approach:** Store tokens in **httpOnly cookies**:
- Cannot be read by JavaScript
- Sent automatically with requests
- Pair with `Secure`, `SameSite=Strict/Lax`, short expiry

```tsx
cookies().set("token", jwt, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
```

---

### 23. What is CSRF and how do you prevent it in Next.js?

**Answer:** Cross-Site Request Forgery — attacker tricks a logged-in user's browser into making unwanted requests.

**Prevention:**
- `SameSite=Lax/Strict` on cookies (built-in browser protection)
- CSRF tokens for state-changing forms
- Server Actions have built-in CSRF protection via origin checking
- Avoid storing auth tokens in localStorage (use httpOnly cookies)

---

### 24. What is XSS? How does React/Next.js protect against it?

**Answer:** Cross-Site Scripting — injecting malicious scripts into pages.

**React protection:** JSX auto-escapes values — `{userInput}` renders as text, not HTML.

```tsx
// Safe — React escapes
<div>{userInput}</div>

// Dangerous — bypasses escaping
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**Additional measures:**
- Content Security Policy (CSP) headers in middleware or `next.config.js`
- Sanitize HTML with DOMPurify if using `dangerouslySetInnerHTML`
- Never store JWTs in localStorage

---

## API Routes & Backend

### 25. How do API routes work in the App Router?

**Answer:**

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const users = await db.users.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await db.users.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}

// Dynamic route: app/api/users/[id]/route.ts
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await db.users.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}
```

---

### 26. How do you handle environment variables in Next.js?

**Answer:**

```env
# .env.local
DATABASE_URL=postgresql://...        # server only
SECRET_KEY=abc123                   # server only
NEXT_PUBLIC_API_URL=https://api.com # exposed to browser
```

- Variables **without** `NEXT_PUBLIC_` → server only
- Variables **with** `NEXT_PUBLIC_` → bundled into client JS

**Security:** Never put secrets in `NEXT_PUBLIC_` variables. Use `.env.local` (gitignored) for secrets.

---

## Deployment & Production

### 27. How do you deploy a Next.js application?

**Answer:**

```bash
npm run build   # creates .next/ production build
npm run start   # starts production server on port 3000
```

**Options:**
- **Vercel** — zero config, recommended, edge functions, ISR
- **Docker** — self-hosted, full control
- **Node.js server** — VPS, AWS EC2, Railway
- **Static export** — `output: 'export'` for CDN-only (no SSR/API routes)

```js
// next.config.js — static export
module.exports = { output: "export" };
```

---

### 28. What is the difference between `next dev`, `next build`, and `next start`?

**Answer:**

| Command | Purpose |
| --- | --- |
| `next dev` | Development server — hot reload, verbose errors |
| `next build` | Production build — optimizes, pre-renders static pages |
| `next start` | Runs production build — fast, no hot reload |

Always test with `next build && next start` before deploying — dev mode hides production issues.

---

## Advanced Topics

### 29. What are parallel routes and intercepting routes?

**Answer:**

**Parallel routes** — render multiple pages in the same layout simultaneously.

```
app/
├── @modal/
│   └── (.)photo/[id]/page.tsx   → modal overlay
└── photo/[id]/page.tsx          → full page
```

**Intercepting routes** — show a modal on client navigation but full page on direct URL visit.

| Convention | Intercepts |
| --- | --- |
| `(.)` | Same level |
| `(..)` | One level up |
| `(..)(..)` | Two levels up |
| `(...)` | From root |

Used for route-based modals (e.g., photo lightbox in a feed).

---

### 30. How do you implement internationalization (i18n) in Next.js?

**Answer:**

**App Router approach:**

```
app/
├── [lang]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── about/page.tsx
```

```tsx
// middleware.ts — detect locale
export function middleware(req: NextRequest) {
  const locale = req.headers.get("accept-language")?.split(",")[0] ?? "en";
  if (!req.nextUrl.pathname.startsWith(`/${locale}`)) {
    return NextResponse.redirect(new URL(`/${locale}${req.nextUrl.pathname}`, req.url));
  }
}
```

**Libraries:** `next-intl`, `next-i18next` for translations, date/number formatting.

---

### 31. How would you design a large-scale Next.js e-commerce app?

**Answer:**

**Architecture:**
- App Router with Server Components for product pages (SEO + performance)
- ISR for product listings (`revalidate: 60`)
- Client Components only for cart, checkout, filters
- API routes or Server Actions for mutations
- Redis/CDN caching for hot products
- `next/image` with CDN for product images

**Structure:**
```
app/
├── (shop)/
│   ├── products/[slug]/page.tsx   → ISR product pages
│   └── category/[slug]/page.tsx
├── (account)/
│   ├── orders/page.tsx            → SSR auth pages
│   └── profile/page.tsx
├── api/webhooks/stripe/route.ts
└── middleware.ts                  → auth + geo
```

**Performance:** Edge middleware for geo-routing, static generation for catalog, streaming for personalized sections.

---

### 32. What is the difference between `getServerSideProps` and Server Components?

**Answer:**

| | `getServerSideProps` (Pages) | Server Components (App) |
| --- | --- | --- |
| Location | Separate export function | Inline in component |
| Syntax | `export async function getServerSideProps()` | `async function Page()` |
| Data access | Via `props` | Direct in component |
| Streaming | ❌ | ✅ with Suspense |
| Partial rendering | ❌ | ✅ |

```tsx
// Pages Router (legacy)
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// App Router (current)
async function Page() {
  const data = await fetchData(); // direct fetch
  return <div>{data.title}</div>;
}
```

---

### 33. How do you test Next.js components and pages?

**Answer:**

```tsx
// Component test — React Testing Library + Jest
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("increments counter", async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("1")).toBeInTheDocument();
});

// API route test
import { GET } from "@/app/api/users/route";
const response = await GET();
const data = await response.json();
expect(data).toHaveLength(3);

// E2E — Playwright
test("login flow", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "user@test.com");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
});
```

Use MSW to mock API calls in unit/integration tests. Run E2E against `next build && next start`.

---

### 34. What happens when you navigate between pages in the App Router?

**Answer:**

1. Client-side navigation via `<Link>` or `router.push()`
2. Next.js fetches the **React Server Component payload** (not full HTML)
3. Router cache stores the payload (soft navigation, 30s default)
4. Layouts **persist** — only the `page.tsx` segment re-renders
5. Shared layouts don't remount — state in layout Client Components survives

```tsx
// Layout persists — sidebar state survives navigation
// Only page.tsx content swaps
app/dashboard/layout.tsx  ← stays mounted
app/dashboard/page.tsx      ← swaps to settings/page.tsx
```

Prefetching: `<Link>` automatically prefetches visible links in viewport.

---

### 35. What is `generateMetadata` and how does it help SEO?

**Answer:** Export `metadata` or `generateMetadata` from any page/layout for SEO tags.

```tsx
// Static
export const metadata = {
  title: "My App",
  description: "Best app ever",
  openGraph: { title: "My App", images: ["/og.png"] },
};

// Dynamic
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImage] },
  };
}
```

Next.js injects these into `<head>` server-side — crawlers see full metadata without JavaScript.

---

## Quick Revision

```
SSR     = HTML on every request (dynamic)
SSG     = HTML at build time (static)
ISR     = static + background revalidate
RSC     = Server Component — zero client JS
"use client" = Client Component — hooks, events
"use server" = Server Action — server mutations
layout.tsx  = shared UI, persists on navigation
middleware  = runs before request (auth, redirect)
next/image  = auto image optimization
revalidate  = ISR refresh interval
fetch cache = force-cache | no-store | revalidate:N
```
