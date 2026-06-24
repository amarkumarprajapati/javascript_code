# Next.js — Hooks

> Hooks only work in **Client Components** (`"use client"`). Server Components cannot use hooks.

---

## Rules of Hooks

1. Only call at the **top level** — not inside loops, conditions, or nested functions
2. Only call from **React functions** — components or custom hooks
3. Add `"use client"` at top of file to use hooks in App Router

```tsx
"use client";  // required for hooks in App Router
import { useState } from "react";
```

---

## React Hooks (used in Next.js Client Components)

### useState

```tsx
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

### useEffect

Side effects — fetch, subscriptions, DOM, timers.

```tsx
"use client";
import { useEffect, useState } from "react";

export function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(setUser);
  }, [id]); // re-run when id changes

  return user ? <p>{user.name}</p> : <p>Loading...</p>;
}

// Cleanup on unmount
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer); // cleanup
}, []);
```

| Dependency array | Behavior |
| --- | --- |
| `[dep]` | Run when `dep` changes |
| `[]` | Run once on mount |
| none | Run every render (avoid) |

---

### useRef

Persist value without re-render. Access DOM nodes.

```tsx
"use client";
import { useRef } from "react";

export function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => inputRef.current?.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </>
  );
}

// Store previous value without re-render
const prevCount = useRef<number>();
useEffect(() => {
  prevCount.current = count;
}, [count]);
```

---

### useContext

Share data without prop drilling.

```tsx
"use client";
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

---

### useReducer

Complex state logic — Redux-like, local.

```tsx
"use client";
import { useReducer } from "react";

type State = { count: number };
type Action = { type: "inc" } | { type: "dec" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "dec": return { count: state.count - 1 };
    case "reset": return { count: 0 };
    default: return state;
  }
}

export function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "inc" })}>+</button>
    </>
  );
}
```

---

### useMemo & useCallback

```tsx
"use client";
import { useMemo, useCallback, memo } from "react";

function ExpensiveList({ items, onSelect }: Props) {
  // Memoize expensive computation
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  // Stable function reference — prevents child re-render
  const handleSelect = useCallback(
    (id: string) => onSelect(id),
    [onSelect]
  );

  return sorted.map(item => (
    <Item key={item.id} item={item} onSelect={handleSelect} />
  ));
}

const Item = memo(function Item({ item, onSelect }) {
  return <div onClick={() => onSelect(item.id)}>{item.name}</div>;
});
```

| Hook | Memoizes |
| --- | --- |
| `useMemo` | computed **value** |
| `useCallback` | **function** reference |

---

## Next.js Navigation Hooks (App Router)

Import from `next/navigation`:

```tsx
"use client";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
```

---

### useRouter

Programmatic navigation.

```tsx
"use client";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    await login();
    router.push("/dashboard");       // navigate
    router.replace("/dashboard");   // replace history (no back)
    router.back();                   // go back
    router.forward();
    router.refresh();                // refresh server data
    router.prefetch("/about");       // prefetch route
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

| Method | Does |
| --- | --- |
| `push(href)` | Navigate to route |
| `replace(href)` | Navigate without history entry |
| `back()` | Browser back |
| `forward()` | Browser forward |
| `refresh()` | Re-fetch server components |
| `prefetch(href)` | Preload route in background |

---

### usePathname

Current URL pathname.

```tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
      <Link href="/about" className={pathname === "/about" ? "active" : ""}>About</Link>
    </nav>
  );
}
// pathname = "/about" when on /about
```

---

### useSearchParams

Read URL query string.

```tsx
"use client";
import { useSearchParams } from "next/navigation";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");       // ?q=hello → "hello"
  const page = searchParams.get("page") ?? "1";

  return <p>Searching: {query} (page {page})</p>;
}

// Wrap in Suspense when used in static pages
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchResults />
    </Suspense>
  );
}
```

---

### useParams

Dynamic route parameters.

```tsx
"use client";
import { useParams } from "next/navigation";

// Route: app/blog/[slug]/page.tsx
export function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;  // /blog/my-post → "my-post"
  return <p>Post: {slug}</p>;
}

// Catch-all: app/docs/[...slug]/page.tsx
// /docs/a/b/c → params.slug = ["a", "b", "c"]
```

---

### useSelectedLayoutSegment & useSelectedLayoutSegments

Active layout segment — useful for nav highlighting.

```tsx
"use client";
import { useSelectedLayoutSegment } from "next/navigation";

// app/dashboard/layout.tsx with children: settings, profile
export function DashboardNav() {
  const segment = useSelectedLayoutSegment();
  // on /dashboard/settings → segment = "settings"
  // on /dashboard → segment = null

  return (
    <nav>
      <a href="/dashboard/settings" className={segment === "settings" ? "active" : ""}>
        Settings
      </a>
    </nav>
  );
}
```

---

## Pages Router Hooks (Legacy)

Import from `next/router` — **different API** from App Router.

```tsx
import { useRouter } from "next/router";

function Page() {
  const router = useRouter();

  router.pathname;   // "/blog/[slug]"
  router.query;      // { slug: "my-post" }
  router.asPath;     // "/blog/my-post"
  router.push("/about");
  router.replace("/login");
  router.back();

  // Route change events
  useEffect(() => {
    const handleStart = (url: string) => console.log("Navigating to", url);
    router.events.on("routeChangeStart", handleStart);
    return () => router.events.off("routeChangeStart", handleStart);
  }, [router]);
}
```

| App Router (`next/navigation`) | Pages Router (`next/router`) |
| --- | --- |
| `useRouter()` | `useRouter()` |
| `usePathname()` | `router.pathname` / `router.asPath` |
| `useSearchParams()` | `router.query` |
| `useParams()` | `router.query` |
| No events API | `router.events.on/off` |

---

## Custom Hooks for Next.js

### useDebounce

```tsx
"use client";
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Usage — search input
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);
useEffect(() => {
  if (debouncedSearch) fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

---

### useLocalStorage

```tsx
"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(JSON.parse(stored));
  }, [key]);

  const set = (val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, set] as const;
}
```

---

### useMediaQuery

```tsx
"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery("(max-width: 768px)");
```

---

### useFetch (client-side)

```tsx
"use client";
import { useState, useEffect } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(d => { if (active) { setData(d); setError(null); } })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [url]);

  return { data, loading, error };
}
```

> Prefer **Server Components** for data fetching when possible — no hook needed, no loading state in client.

---

## Server vs Client — Where to Fetch Data

| Pattern | Where | Hook? |
| --- | --- | --- |
| Server Component fetch | Server | ❌ async/await directly |
| Server Action | Server | ❌ `"use server"` function |
| Client fetch on mount | Client | ✅ `useEffect` + `useState` |
| Client fetch library | Client | ✅ SWR / React Query hooks |
| Route handler | Server | ❌ API route |

```tsx
// ✅ Preferred — Server Component (no hook)
async function ProductPage({ params }) {
  const product = await fetch(`/api/products/${params.id}`).then(r => r.json());
  return <ProductCard product={product} />;
}

// ✅ Client interactivity — SWR
"use client";
import useSWR from "swr";
const { data, error, isLoading } = useSWR("/api/user", fetcher);
```

---

## Quick Reference

```
"use client"              → required for hooks in App Router
useState                  → local state
useEffect                 → side effects, cleanup
useRef                    → DOM access, persist without re-render
useContext                → shared state
useReducer                → complex state
useMemo                   → memoize value
useCallback               → memoize function
useRouter (navigation)    → push, replace, back, refresh
usePathname               → current path string
useSearchParams           → URL query params
useParams                 → dynamic route params
useSelectedLayoutSegment  → active layout segment
next/navigation           → App Router hooks
next/router               → Pages Router hooks (legacy)
```
