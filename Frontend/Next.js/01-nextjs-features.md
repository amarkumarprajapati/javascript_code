# Next.js — Features

Next.js is a **React framework** for production — adds routing, rendering, data fetching, and optimization on top of React.

Built by Vercel. Runs on Node.js. Uses React for UI.

---

## Key Features

| Feature | What it does |
| --- | --- |
| **File-based routing** | Folders/files = routes — no manual route config |
| **SSR** | Server-Side Rendering — HTML on every request |
| **SSG** | Static Site Generation — HTML at build time |
| **ISR** | Incremental Static Regeneration — static + background refresh |
| **Server Components** | Run on server, zero JS sent to browser |
| **API Routes** | Backend endpoints in same project |
| **Image optimization** | `next/image` — auto WebP, lazy load, resize |
| **Font optimization** | `next/font` — no layout shift |
| **Code splitting** | Automatic per-route JS splitting |
| **Middleware** | Run code before request completes |
| **TypeScript** | Built-in support |
| **Fast Refresh** | Instant feedback during development |

---

## App Router vs Pages Router

| | **App Router** (`app/`) | **Pages Router** (`pages/`) |
| --- | --- | --- |
| Status | Current (Next.js 13+) | Legacy (still supported) |
| Default component | Server Component | Client Component |
| Data fetching | `async/await` in components | `getServerSideProps`, `getStaticProps` |
| Layouts | Nested `layout.tsx` | Manual via `_app.js` |
| Streaming | Native `<Suspense>` | Limited |
| Server Actions | `"use server"` | Not built-in |

---

## Rendering Strategies

### SSR — Server-Side Rendering
HTML generated **on every request** at runtime.

```tsx
// App Router — dynamic by default when fetching without cache
async function Dashboard() {
  const data = await fetch("https://api.example.com/user", { cache: "no-store" });
  const user = await data.json();
  return <div>Hello {user.name}</div>;
}
```

**Use for:** authenticated pages, dashboards, real-time data.

---

### SSG — Static Site Generation
HTML generated **at build time**.

```tsx
// App Router
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`, {
    cache: "force-cache", // default — static
  }).then(r => r.json());
  return <article>{post.title}</article>;
}

// Generate all paths at build time
export async function generateStaticParams() {
  const posts = await fetch("https://api.example.com/posts").then(r => r.json());
  return posts.map((p: { slug: string }) => ({ slug: p.slug }));
}
```

**Use for:** blogs, docs, landing pages — content that rarely changes.

---

### ISR — Incremental Static Regeneration
Static pages **revalidated** in background after a time interval.

```tsx
async function Products() {
  const products = await fetch("https://api.example.com/products", {
    next: { revalidate: 60 }, // refresh every 60 seconds
  }).then(r => r.json());
  return <ProductList products={products} />;
}
```

**Use for:** product listings, news feeds — semi-dynamic content.

---

### CSR — Client-Side Rendering
Data fetched in browser after page loads.

```tsx
"use client";
import { useEffect, useState } from "react";

export default function ClientPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/data").then(r => r.json()).then(setData);
  }, []);
  return data ? <div>{data.title}</div> : <p>Loading...</p>;
}
```

**Use for:** highly interactive UI, data that doesn't need SEO.

---

### When to choose?

```
SSG → ISR → SSR → CSR
(fastest)              (most dynamic)

SSG  = blog, docs, marketing
ISR  = e-commerce, news
SSR  = dashboards, auth pages
CSR  = admin panels, client-only widgets
```

---

## Server Components vs Client Components

| | Server Component | Client Component |
| --- | --- | --- |
| Directive | default (none) | `"use client"` |
| Runs on | Server only | Browser + server |
| Can use hooks | ❌ | ✅ |
| Can use browser APIs | ❌ | ✅ |
| Adds to JS bundle | ❌ | ✅ |
| Can fetch DB directly | ✅ | ❌ |
| Can handle events | ❌ | ✅ |

```tsx
// Server Component (default) — no directive
async function ProductList() {
  const products = await db.products.findMany(); // direct DB access
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}

// Client Component — needs interactivity
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## File-Based Routing (App Router)

```
app/
├── layout.tsx          → wraps all routes (root layout)
├── page.tsx            → / (home)
├── about/
│   └── page.tsx        → /about
├── blog/
│   ├── page.tsx        → /blog
│   └── [slug]/
│       └── page.tsx    → /blog/my-post
├── dashboard/
│   ├── layout.tsx      → dashboard layout (sidebar)
│   ├── page.tsx        → /dashboard
│   └── settings/
│       └── page.tsx    → /dashboard/settings
├── api/
│   └── users/
│       └── route.ts    → /api/users (API endpoint)
├── loading.tsx         → loading UI (Suspense fallback)
├── error.tsx           → error boundary
└── not-found.tsx       → 404 page
```

### Route types

| File/Folder | Purpose |
| --- | --- |
| `page.tsx` | Route UI |
| `layout.tsx` | Shared UI wrapper (persists on navigation) |
| `loading.tsx` | Loading skeleton |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |
| `[id]` | Dynamic segment |
| `[...slug]` | Catch-all |
| `[[...slug]]` | Optional catch-all |
| `(group)` | Route group (no URL impact) |
| `@folder` | Parallel route |

---

## Data Fetching (App Router)

```tsx
// Static (SSG) — cached forever until rebuild
fetch(url, { cache: "force-cache" });

// Dynamic (SSR) — fresh on every request
fetch(url, { cache: "no-store" });

// ISR — revalidate after N seconds
fetch(url, { next: { revalidate: 3600 } });

// Tag-based revalidation
fetch(url, { next: { tags: ["products"] } });
// Later: revalidateTag("products")
```

### Server Actions

```tsx
// app/actions.ts
"use server";
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  await db.users.create({ data: { name } });
  revalidatePath("/users");
}

// app/users/page.tsx
import { createUser } from "../actions";

export default function Page() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## API Routes

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
```

---

## Middleware

Runs **before** request completes — auth, redirects, headers.

```tsx
// middleware.ts (root)
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

## Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={400}
  priority          // above fold — preload
  placeholder="blur" // blur while loading
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

Auto: WebP/AVIF format, lazy loading, responsive sizes, prevents layout shift.

---

## Font Optimization

```tsx
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

Fonts self-hosted at build time — no external request, no layout shift.

---

## Metadata & SEO

```tsx
// Static metadata
export const metadata = {
  title: "My App",
  description: "Best app ever",
  openGraph: { title: "My App", images: ["/og.png"] },
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}
```

---

## Caching (App Router)

| Cache | Scope | How to control |
| --- | --- | --- |
| Request memoization | Single request | automatic |
| Data cache | Across requests | `cache: "no-store"`, `revalidate` |
| Full route cache | Static routes | `revalidate`, `revalidatePath` |
| Router cache | Client navigation | automatic (soft) |

```tsx
import { revalidatePath, revalidateTag } from "next/cache";

revalidatePath("/products");   // refresh specific route
revalidateTag("products");     // refresh all fetches with this tag
```

---

## Environment Variables

```env
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com  # exposed to browser
SECRET_KEY=abc123                               # server only
```

```tsx
// Server only
process.env.SECRET_KEY

// Client accessible (must prefix NEXT_PUBLIC_)
process.env.NEXT_PUBLIC_API_URL
```

---

## Deployment

```bash
npm run build    # production build
npm run start    # start production server

# Vercel (recommended — zero config)
vercel deploy

# Docker
docker build -t my-app .
docker run -p 3000:3000 my-app
```

---

## Project Structure

```
my-app/
├── app/                  # App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/           # route group
│   │   ├── login/
│   │   └── register/
│   └── api/
├── components/           # shared components
│   ├── ui/
│   └── forms/
├── lib/                  # utilities, db client
├── public/               # static files
├── middleware.ts
├── next.config.js
└── package.json
```

---

## Quick Revision

```
Next.js       = React framework (routing + rendering + optimization)
App Router    = app/ folder (current, Server Components default)
Pages Router  = pages/ folder (legacy, getServerSideProps)
SSR           = render on every request
SSG           = render at build time
ISR           = static + background revalidate
"use client"  = Client Component (hooks, events)
"use server"  = Server Action (form mutations)
layout.tsx    = shared UI, persists on navigation
middleware.ts = run before request (auth, redirect)
next/image    = optimized images
revalidate    = ISR refresh interval
```
