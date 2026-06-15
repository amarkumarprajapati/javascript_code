# Deloitte Interview Prep — Managed Services Engineer II (Frontend / Next.js)
**Role:** Managed Services Engineer II — DFO&I Team
**Stack Focus:** React, Next.js, TypeScript, Jest, REST/GraphQL, CI/CD, GenAI Tools

---

## 1. React & Next.js

### Core Concepts

**Q: What is the difference between SSR, SSG, and ISR in Next.js? When would you choose each?**

**A:**
- **SSR (Server-Side Rendering):** HTML is generated on every request at runtime. Use for pages with user-specific or highly dynamic data (e.g., dashboards, authenticated pages). In App Router, this is the default behavior of Server Components that fetch dynamic data.
- **SSG (Static Site Generation):** HTML is generated at build time. Use for content that rarely changes — blog posts, landing pages, documentation. Fastest because pages are served from a CDN.
- **ISR (Incremental Static Regeneration):** Pages are statically generated but can be revalidated in the background after a set time (`revalidate`). Best for semi-dynamic content like product listings or news feeds that need freshness without full SSR overhead.

**Rule of thumb:** SSG → ISR → SSR in order of preference based on how dynamic your data is.

---

**Q: Explain React Server Components (RSC). How are they different from Client Components?**

**A:**
React Server Components run only on the server and never ship their JavaScript to the browser. Key differences:

| Feature | Server Component | Client Component |
|---|---|---|
| Runs on | Server only | Browser (and server during hydration) |
| Can use hooks | ❌ No | ✅ Yes |
| Can access DB/FS directly | ✅ Yes | ❌ No |
| Adds to JS bundle | ❌ No | ✅ Yes |
| Can handle events | ❌ No | ✅ Yes |

RSCs reduce bundle size and allow direct data access without API layers. You add `"use client"` only when you need interactivity, hooks, or browser APIs.

---

**Q: How does the Next.js App Router differ from the Pages Router in terms of data fetching, caching, and layout?**

**A:**
- **Data Fetching:** Pages Router used `getServerSideProps`/`getStaticProps` as special functions. App Router uses native `async/await` in Server Components. You fetch directly inside the component — no special API.
- **Caching:** App Router has a layered caching system — Request Memoization, Data Cache (extended `fetch`), Full Route Cache, and Router Cache. Pages Router relied on HTTP caching and manual revalidation.
- **Layouts:** App Router has file-based nested layouts (`layout.tsx`) that persist across route changes without re-mounting. Pages Router had no built-in layout system — devs used `_app.js` with manual wrapping.
- **Streaming:** App Router natively supports streaming with `<Suspense>`. Pages Router doesn't.

---

**Q: What is hydration in Next.js and what problems can cause hydration errors?**

**A:**
Hydration is the process where React attaches event listeners to the already-rendered server HTML to make it interactive. React replays the render on the client and expects the output to match the server HTML exactly.

**Common causes of hydration errors:**
- Using browser-only APIs (`window`, `localStorage`) during render — they don't exist on the server.
- Rendering content that depends on the current timestamp or random values.
- Rendering based on `typeof window !== 'undefined'` without a stable initial render.
- Using a different locale or timezone on server vs client.

**Fix:** Use `useEffect` for client-only code, or `suppressHydrationWarning` for known acceptable mismatches (e.g., timestamps). Use `dynamic()` with `ssr: false` for components that truly shouldn't render on the server.

---

**Q: How does `Suspense` work in React 18? How does it integrate with Next.js streaming?**

**A:**
`Suspense` lets you declaratively define loading states while waiting for data or lazy-loaded components. When a component suspends (throws a Promise internally), React shows the nearest `<Suspense fallback={...}>` until it resolves.

In Next.js App Router, this integrates with **streaming SSR** — instead of waiting for all data before sending HTML, Next.js streams the shell immediately and flushes deferred `<Suspense>` sections as their data becomes ready. This improves Time to First Byte (TTFB) dramatically.

```jsx
// In a Server Component
<Suspense fallback={<ProductSkeleton />}>
  <ProductList /> {/* Streams in after data is fetched */}
</Suspense>
```

---

**Q: What is the purpose of `use client` and `use server` directives in the App Router?**

**A:**
- **`"use client"`**: Marks a component as a Client Component. It and all its imports run in the browser and are included in the JS bundle. Required for hooks, event handlers, and browser APIs.
- **`"use server"`**: Marks a function as a Server Action — an async function that runs on the server but can be called from the client (e.g., form submissions, mutations). Replaces the need for custom API routes for simple mutations.

By default, all components in the App Router are Server Components. You opt into client-side execution explicitly.

---

**Q: How do you handle layout nesting and shared UI in Next.js App Router?**

**A:**
Each folder in the `app/` directory can have a `layout.tsx` that wraps all child routes. Layouts are nested automatically — a root `layout.tsx` wraps everything, and segment-level layouts wrap their subtree.

```
app/
  layout.tsx        ← Root layout (html, body tags)
  dashboard/
    layout.tsx      ← Dashboard layout (sidebar, nav)
    page.tsx
    settings/
      page.tsx
```

Layouts persist across navigation — they don't remount when navigating between child routes, making them ideal for sidebars, headers, and navigation that should maintain state.

---

### State Management

**Q: How do you manage shared state across pages in a Next.js app?**

**A:**
- **Context API:** Good for low-frequency updates (theme, auth user, locale). Avoid for high-frequency state since it re-renders all consumers.
- **Zustand:** My go-to for most app-level state. Minimal boilerplate, no providers needed, supports slices, and doesn't cause unnecessary re-renders.
- **Redux Toolkit:** Use for complex apps with many async flows, extensive devtools needs, or team familiarity with Redux patterns.
- **Jotai/Recoil:** Atomic state — great for fine-grained reactivity where different components subscribe to different atoms independently.
- **React Query / SWR:** For server state (API data, caching, background refetching) — these replace the need to put API responses in global state.

---

**Q: When would you lift state vs use a global store? What are the tradeoffs?**

**A:**
- **Lift state** when two sibling components need to share state — move it to their common parent. Simple, no added dependencies.
- **Use a global store** when state needs to be accessed by deeply nested or unrelated components, when prop drilling becomes unwieldy, or when state needs to persist across route changes.

**Tradeoff:** Global stores add abstraction and can make data flow harder to trace. Lifting state keeps things local and predictable but doesn't scale. My approach: start with local state, lift when needed, reach for a store only when lifting becomes impractical.

---

**Q: How do you avoid unnecessary re-renders in a large React application?**

**A:**
- Use `React.memo` on components that receive stable props.
- Use `useMemo` to memoize expensive derived values.
- Use `useCallback` to stabilize function references passed as props.
- Avoid creating objects/arrays inline in JSX props — they create new references every render.
- Split context into multiple smaller contexts so consumers only re-render when their slice changes.
- Use Zustand's selector pattern — subscribe only to the specific slice of state a component needs.
- Profile with React DevTools Profiler before optimizing — premature optimization adds complexity.

---

### Components & Design Systems

**Q: How do you build reusable, composable components that work across multiple teams?**

**A:**
- Design for the minimal surface area — expose only what consumers need via props.
- Use composition over configuration — rather than a giant `variant` prop list, expose sub-components (e.g., `<Card>`, `<Card.Header>`, `<Card.Body>`).
- Keep components unstyled or style-agnostic at the core level with style override escape hatches (`className`, `style` props).
- Document with Storybook — every component state, variant, and edge case should have a story.
- Version and publish via npm with semantic versioning so teams can adopt on their own schedule.
- Write comprehensive tests so consumers trust the contract.

---

**Q: What are compound components and when would you use them?**

**A:**
Compound components are a pattern where a parent component shares implicit state with its children via Context, letting consumers compose flexible UIs without prop drilling.

```jsx
// Usage
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="profile"><ProfileForm /></Tabs.Panel>
  <Tabs.Panel value="settings"><SettingsForm /></Tabs.Panel>
</Tabs>
```

Use when you want flexibility in how children are arranged while the parent manages the shared state (active tab, accordion open state, dropdown visibility). Radix UI and Headless UI use this pattern extensively.

---

**Q: Explain the difference between controlled and uncontrolled components. When do you use each?**

**A:**
- **Controlled:** Form input's value is driven by React state. Every change goes through an `onChange` handler. You have full control — good for validation, conditional disabling, formatted inputs.
- **Uncontrolled:** Input manages its own internal state via the DOM. You read the value via a `ref`. Less code for simple forms.

**When to use:**
- Controlled → whenever you need validation, conditional logic, or derived state.
- Uncontrolled → simple forms where you only need the value on submit, or when integrating with non-React code.
- React Hook Form uses uncontrolled inputs under the hood for better performance, with a controlled abstraction on top.

---

### Routing & Navigation

**Q: How does dynamic routing work in Next.js App Router?**

**A:**
- **Dynamic segments:** `app/products/[id]/page.tsx` — `id` is available via `params.id`.
- **Catch-all:** `app/docs/[...slug]/page.tsx` — matches `/docs/a/b/c`, `slug` is `['a','b','c']`.
- **Optional catch-all:** `app/docs/[[...slug]]/page.tsx` — also matches `/docs` itself.
- **Parallel routes:** `app/@modal/(.)photo/[id]/page.tsx` — render multiple pages in the same layout simultaneously (e.g., a modal alongside the current page).
- **Intercepting routes:** `(.)` intercepts at the same level, `(..)` goes up one level. Used for route-based modals that show a modal on client nav but the full page on direct URL visit.

---

**Q: How do you handle redirects, 404s, and error boundaries in Next.js?**

**A:**
- **Redirects:** In `next.config.js` for static redirects. In middleware for dynamic (auth-based) redirects. `redirect()` function from `next/navigation` inside Server Components.
- **404s:** Create `app/not-found.tsx` for the global 404 page. Call `notFound()` from `next/navigation` inside a route when a resource isn't found.
- **Errors:** Create `error.tsx` in any route segment to catch runtime errors in that subtree. It must be a Client Component (uses `useEffect` to log errors). `global-error.tsx` catches errors in the root layout.

---

## 2. JavaScript (ES6+)

### Core Language

**Q: Explain the JavaScript event loop. What are microtasks vs macrotasks?**

**A:**
The event loop continuously checks if the call stack is empty, then picks tasks from the queue.

- **Macrotasks (Task Queue):** `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks. One macrotask runs per loop iteration.
- **Microtasks (Microtask Queue):** Promise `.then`/`.catch`, `queueMicrotask`, `MutationObserver`. All microtasks are drained before the next macrotask runs.

```js
console.log('1');           // sync
setTimeout(() => console.log('2'), 0); // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('4');           // sync
// Output: 1, 4, 3, 2
```

This is why Promises resolve before `setTimeout` even with `0` delay.

---

**Q: Explain closures. Give a real-world use case.**

**A:**
A closure is when a function retains access to its outer scope even after the outer function has returned.

```js
function makeCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
```

Real-world uses: debounce/throttle implementations, factory functions, partial application, memoization, and module patterns (encapsulating private state before classes).

---

**Q: What is the difference between `var`, `let`, and `const`? What is the temporal dead zone?**

**A:**
- `var`: Function-scoped, hoisted and initialized as `undefined`, can be redeclared.
- `let`: Block-scoped, hoisted but NOT initialized (TDZ), cannot be redeclared.
- `const`: Block-scoped, must be initialized at declaration, cannot be reassigned (but the object it points to can be mutated).

**Temporal Dead Zone (TDZ):** The period between when a `let`/`const` variable is hoisted and when it's actually initialized. Accessing it in this window throws a `ReferenceError`.

```js
console.log(x); // ReferenceError — TDZ
let x = 5;
```

---

**Q: How do Promises work? Explain `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`.**

**A:**
A Promise represents an eventual value — it's in one of three states: pending, fulfilled, or rejected.

| Method | Resolves when | Rejects when |
|---|---|---|
| `Promise.all` | All promises fulfill | Any one rejects |
| `Promise.allSettled` | All promises settle (either way) | Never rejects |
| `Promise.race` | First promise settles (either way) | First rejects |
| `Promise.any` | First promise fulfills | All reject (AggregateError) |

Use `Promise.all` for parallel dependent requests. Use `Promise.allSettled` when you need all results regardless of individual failures (e.g., batch operations). Use `Promise.race` for timeout patterns. Use `Promise.any` for "first successful" patterns (e.g., multiple CDN fallbacks).

---

**Q: What is debouncing vs throttling? Implement debounce from scratch.**

**A:**
- **Debounce:** Delays execution until the user stops firing the event for X ms. Use for search input, resize handlers.
- **Throttle:** Limits execution to once per X ms regardless of how many times it fires. Use for scroll events, mousemove.

```js
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => fetchResults(query), 300);
```

---

**Q: What causes memory leaks in a React app? How do you detect and fix them?**

**A:**
**Common causes:**
- Event listeners added in `useEffect` without cleanup.
- `setInterval`/`setTimeout` not cleared on unmount.
- Subscriptions (WebSocket, RxJS, Zustand) not unsubscribed.
- Closures holding references to large objects that prevent garbage collection.
- State updates on unmounted components (though React 18 handles this better).

**Fix pattern:**
```js
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval); // cleanup
}, []);
```

**Detection:** Chrome DevTools Memory tab — take heap snapshots before and after navigation, look for detached DOM trees. React DevTools Profiler can also reveal excessive re-renders.

---

## 3. TypeScript

**Q: What is the difference between `interface` and `type`? When do you use each?**

**A:**
- Both can describe object shapes and can be extended.
- `interface` supports declaration merging (two interfaces with the same name merge automatically). Good for library types and when you expect extensions.
- `type` is more flexible — can represent unions, intersections, tuples, primitives, and mapped types. Use for complex type expressions.

**My rule:** Use `interface` for object shapes and public APIs. Use `type` for everything else — unions, computed types, utility type compositions.

---

**Q: Explain generics in TypeScript. Give a practical example.**

**A:**
Generics let you write reusable code that works with multiple types while preserving type safety.

```ts
// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Generic hook I used in a project
function useFetch<T>(url: string): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  // ...
}

const { data } = useFetch<User[]>('/api/users');
// TypeScript knows data is User[] | null
```

In LilyPads AI, I used generics to create a typed API client that handled both list responses `ApiResponse<T[]>` and single item responses `ApiResponse<T>` without code duplication.

---

**Q: What are utility types? Explain `Partial`, `Pick`, `Omit`, `Required`, `Readonly`.**

**A:**
Utility types are built-in TypeScript types that transform existing types.

```ts
interface User { id: number; name: string; email: string; age?: number; }

Partial<User>        // All fields optional: { id?: number; name?: string; ... }
Required<User>       // All fields required (removes ?)
Readonly<User>       // All fields readonly
Pick<User, 'id' | 'name'>   // { id: number; name: string }
Omit<User, 'email'>         // { id: number; name: string; age?: number }
```

I use `Omit` frequently when creating DTO types from entity types (e.g., `Omit<User, 'id'>` for a CreateUserDto).

---

**Q: What is a discriminated union? How does it help with type narrowing?**

**A:**
A discriminated union is a union type where each member has a common literal type field (the discriminant) that TypeScript uses to narrow the type.

```ts
type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function render(state: ApiState<User[]>) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'success': return <UserList users={state.data} />; // TypeScript knows data exists
    case 'error': return <ErrorMsg msg={state.error} />;  // TypeScript knows error exists
  }
}
```

Eliminates impossible states and makes exhaustive handling easy.

---

**Q: How do you handle `unknown` vs `any` types?**

**A:**
- `any`: Opts out of type checking entirely. Anything goes — dangerous.
- `unknown`: Type-safe alternative. You must narrow it before you can use it.

```ts
function processInput(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // Safe — TypeScript knows it's a string
  }
}
```

I avoid `any` entirely. I use `unknown` for data from external sources (API responses, JSON.parse, user input) and then validate/narrow with type guards or Zod schemas.

---

**Q: What is `as const` and when is it useful?**

**A:**
`as const` freezes a value's type to its literal type instead of widening it.

```ts
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings',
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES]; // '/' | '/dashboard' | '/settings'
```

Without `as const`, TypeScript infers `string` for the values. With `as const`, it infers the exact string literals, enabling union types derived from the object and preventing accidental mutation.

---

## 4. Testing (Jest & React Testing Library)

### Jest

**Q: How do you mock an API call in Jest?**

**A:**
Three main approaches:

```js
// 1. jest.fn() — mock a specific function
const mockFetch = jest.fn().mockResolvedValue({ data: [] });

// 2. jest.mock() — mock an entire module
jest.mock('../api/users', () => ({
  getUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'Amar' }])
}));

// 3. MSW (Mock Service Worker) — intercept at the network level
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Amar' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**I prefer MSW** for integration tests — it's closer to real network behavior and doesn't require mocking implementation details.

---

**Q: What is snapshot testing? When is it useful and when does it become a liability?**

**A:**
Snapshot testing captures a component's rendered output and compares it against a stored snapshot on future runs. Useful for catching unintentional UI regressions.

**When it helps:** Simple, stable presentational components (buttons, badges, icons) where you want to catch accidental markup changes.

**When it becomes a liability:**
- Large component trees — snapshots become massive and meaningless.
- Frequent UI changes — snapshots break constantly and developers reflexively update them without reviewing.
- Testing behaviour — snapshots test structure, not interaction. They don't tell you if a button works.

My approach: use snapshots sparingly for leaf components. Prefer behaviour-focused tests with RTL for anything interactive.

---

### React Testing Library

**Q: What is the difference between `getBy`, `queryBy`, and `findBy`?**

**A:**
| | Exists | Doesn't Exist | Async |
|---|---|---|---|
| `getBy` | Returns element | **Throws** | ❌ |
| `queryBy` | Returns element | Returns **null** | ❌ |
| `findBy` | Returns element (awaited) | **Throws** after timeout | ✅ |

- Use `getBy` when you expect the element to be there synchronously.
- Use `queryBy` when asserting something is NOT in the DOM (`expect(queryBy...).not.toBeInTheDocument()`).
- Use `findBy` when the element appears after an async operation.

---

**Q: What is `userEvent` vs `fireEvent`? Which do you prefer?**

**A:**
- `fireEvent` dispatches a single synthetic DOM event (e.g., `fireEvent.click`). Low-level, doesn't simulate real user behavior.
- `userEvent` (from `@testing-library/user-event`) simulates realistic user interactions — typing fires `keydown`, `keypress`, `input`, `keyup` in sequence, clicks handle focus, pointer events, etc.

**I always prefer `userEvent`** because it tests closer to how real users interact. `fireEvent` can pass tests that fail in a real browser. The newer `@testing-library/user-event` v14 uses a `setup()` call:

```js
const user = userEvent.setup();
await user.type(input, 'hello');
await user.click(button);
```

---

**Q: How do you test a component that fetches data on mount?**

**A:**
```jsx
// Component
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Test with MSW
it('renders users after fetch', async () => {
  server.use(
    rest.get('/api/users', (req, res, ctx) =>
      res(ctx.json([{ id: 1, name: 'Amar' }]))
    )
  );

  render(<UserList />);

  // Wait for the async render
  expect(await screen.findByText('Amar')).toBeInTheDocument();
});
```

Wrap assertions in `findBy` or `waitFor` for async state updates. Always test the loading state too if it exists.

---

### Testing Strategy

**Q: How do you decide what to unit test vs integration test vs E2E test?**

**A:**
I follow the **Testing Trophy** (Kent C. Dodds) over the classic pyramid:

- **Unit tests:** Pure functions, utilities, custom hooks in isolation. Fast, no DOM needed.
- **Integration tests (RTL):** Components with their real children, context, and mocked network. This is the bulk of my tests — highest ROI.
- **E2E tests (Playwright/Cypress):** Critical user journeys only — login flow, checkout, form submission. Slow and brittle, so keep them focused.

The goal is confidence that the app works, not 100% line coverage. A well-written integration test gives more confidence than 10 unit tests that each test a line in isolation.

---

**Q: Have you used Playwright or Cypress? How do you integrate with CI?**

**A:**
Yes, I've used Playwright. Integration with GitHub Actions:

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    BASE_URL: http://localhost:3000

- uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

Key practices:
- Run against a real built app (`npm run build && npm start`), not the dev server.
- Use `page.getByRole()` and `page.getByTestId()` instead of CSS selectors — more resilient.
- Isolate test state — each test creates/cleans its own data.
- Run Playwright in CI with `--reporter=html` and upload reports as artifacts on failure.

---

## 5. Performance & Optimization

### Core Web Vitals

**Q: What are Core Web Vitals? Explain LCP, CLS, INP.**

**A:**
- **LCP (Largest Contentful Paint):** Time until the largest visible content element renders. Target: < 2.5s. Fix by optimizing images, reducing render-blocking resources, improving TTFB.
- **CLS (Cumulative Layout Shift):** Measures visual stability — how much elements move around unexpectedly. Target: < 0.1. Fix by setting explicit width/height on images, avoiding dynamically inserted content above existing content, using CSS `min-height` for dynamic sections.
- **INP (Interaction to Next Paint):** Replaced FID. Measures responsiveness to all interactions during the page lifecycle. Target: < 200ms. Fix by reducing long tasks, deferring non-critical JS, using web workers.

---

**Q: How do you reduce bundle size in a Next.js app?**

**A:**
- **Dynamic imports:** `const HeavyChart = dynamic(() => import('./HeavyChart'), { ssr: false })` — loads only when needed.
- **Tree shaking:** Import named exports, not entire libraries. `import { format } from 'date-fns'` not `import dateFns from 'date-fns'`.
- **Bundle Analyzer:** `@next/bundle-analyzer` to visualize what's in the bundle.
- **Avoid large libraries:** Replace `moment.js` (330KB) with `date-fns` or `dayjs`. Replace full `lodash` with `lodash-es` and named imports.
- **Use `next/image`** for automatic image optimization — serves WebP, lazy loads, correct sizing.
- **Route-based code splitting** is automatic in Next.js — each page is a separate chunk.

---

**Q: When and how do you use `React.memo`, `useMemo`, and `useCallback`?**

**A:**
- **`React.memo`:** Wrap a component to prevent re-render if props haven't changed. Use when a component is expensive to render and its parent re-renders often for unrelated reasons.
- **`useMemo`:** Memoize an expensive computed value. Use for heavy calculations (filtering large lists, complex transformations), NOT for simple expressions.
- **`useCallback`:** Stabilize a function reference so it doesn't cause unnecessary re-renders in child components that use `React.memo`. Necessary when passing callbacks as props to memoized children.

**Can overusing hurt?** Yes — memoization has its own cost (memory, comparison overhead). Profile first; don't memoize pre-emptively.

---

## 6. Accessibility (a11y)

**Q: What is WCAG 2.1? Differences between Level A, AA, AAA?**

**A:**
WCAG (Web Content Accessibility Guidelines) 2.1 is the international standard for web accessibility, organized around 4 principles: Perceivable, Operable, Understandable, Robust.

- **Level A:** Minimum requirements. Must be met — without these, some users cannot access content at all (e.g., all images need alt text).
- **Level AA:** The standard target for most legal/compliance requirements. Addresses major barriers (color contrast ratio ≥ 4.5:1 for normal text, keyboard accessibility, visible focus).
- **Level AAA:** Highest level — not required for most websites. Addresses edge cases (sign language for video, contrast ≥ 7:1).

Most enterprise and government projects target AA compliance.

---

**Q: How do ARIA roles, states, and properties work? Give a concrete example.**

**A:**
ARIA (Accessible Rich Internet Applications) supplements HTML semantics for custom widgets that have no native HTML equivalent.

```jsx
// Custom dropdown
<div
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-labelledby="label-id"
>
  <input aria-autocomplete="list" aria-controls="listbox-id" />
  <ul
    id="listbox-id"
    role="listbox"
    aria-label="Options"
  >
    {options.map(opt => (
      <li key={opt.id} role="option" aria-selected={opt.id === selected}>
        {opt.label}
      </li>
    ))}
  </ul>
</div>
```

Rule of thumb: Use native HTML elements first (`<button>`, `<select>`, `<input>`). Only reach for ARIA when building custom interactive widgets.

---

**Q: How do you handle focus management when a modal opens and closes?**

**A:**
1. **On open:** Move focus to the first focusable element inside the modal (or the modal container itself with `tabIndex={-1}`).
2. **Trap focus:** Ensure Tab/Shift+Tab cycles only within the modal while it's open. Use a focus trap library (`focus-trap-react`) or implement manually by handling `keydown`.
3. **On close:** Return focus to the element that triggered the modal (store the ref before opening).
4. **Escape key:** Close the modal and return focus.

```jsx
useEffect(() => {
  if (isOpen) {
    const previousFocus = document.activeElement;
    modalRef.current?.focus();
    return () => previousFocus?.focus();
  }
}, [isOpen]);
```

---

## 7. APIs, Auth & Security

### Authentication & Authorization

**Q: Explain the difference between JWT-based auth and session-based auth.**

**A:**
- **Session-based:** Server stores session data (in memory or DB). Client holds only a session ID cookie. Server validates every request by looking up the session. Stateful — easy to revoke.
- **JWT-based:** Server issues a signed token containing claims. Client sends the token with each request. Server validates the signature — no DB lookup needed. Stateless — scales well but harder to revoke before expiry.

**Frontend tradeoffs:**
- JWTs can decode user info client-side without an extra API call.
- JWTs are harder to invalidate (logout doesn't truly invalidate unless using a token blacklist).
- Sessions are simpler to revoke but require sticky sessions or a shared session store.

---

**Q: Why should you NOT store JWTs in `localStorage`? Where should you store them?**

**A:**
`localStorage` is accessible to any JavaScript on the page, making it vulnerable to **XSS attacks** — if an attacker injects a script, they can steal the token.

**Better approach:** Store access tokens in **`httpOnly` cookies**. `httpOnly` cookies cannot be read by JavaScript, only sent automatically by the browser with requests.

Pair with:
- `Secure` flag (HTTPS only)
- `SameSite=Strict` or `Lax` (CSRF protection)
- Short expiry on access tokens + refresh token rotation

In Next.js with Auth.js (NextAuth), this is handled automatically — tokens are stored in httpOnly cookies.

---

**Q: How does OAuth 2.0 / OIDC flow work? How would you implement it in Next.js?**

**A:**
**Authorization Code Flow (PKCE for public clients):**
1. User clicks "Sign in with Google"
2. App redirects to Google's auth server with `client_id`, `redirect_uri`, `scope`, `code_challenge` (PKCE)
3. User logs in and consents
4. Google redirects back with an authorization `code`
5. App exchanges `code` + `code_verifier` for `access_token` and `id_token`
6. App uses `id_token` (OIDC) to identify the user

**In Next.js with Auth.js:**
```js
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  }
});
```

---

### Security (OWASP Basics)

**Q: What is XSS? How does React protect against it and where can it still happen?**

**A:**
**XSS (Cross-Site Scripting):** An attacker injects malicious scripts into your page that run in other users' browsers, stealing cookies, tokens, or session data.

**How React protects:** React escapes all values in JSX by default — `{userInput}` is always rendered as text, never as HTML.

**Where it can still happen:**
- `dangerouslySetInnerHTML` — bypasses React's escaping.
- Constructing URLs from user input: `<a href={userUrl}>` — if `userUrl` is `javascript:alert(1)`, it runs.
- Third-party libraries that manipulate the DOM directly.

**Mitigations:** Never use `dangerouslySetInnerHTML` with untrusted input. Sanitize with `DOMPurify` if you must. Validate/allowlist URLs. Set a strict Content Security Policy (CSP).

---

**Q: What is CSRF? How do you prevent it in a Next.js app?**

**A:**
**CSRF (Cross-Site Request Forgery):** A malicious site tricks an authenticated user's browser into making an unwanted request to your app (e.g., a hidden form that posts to `/api/transfer`).

**Prevention:**
- Use `SameSite=Strict` or `Lax` on auth cookies — modern browsers won't send them on cross-site requests.
- CSRF tokens: generate a token server-side, include in forms, validate on the server.
- Next.js Server Actions include automatic CSRF protection.
- Auth.js handles CSRF tokens automatically for its routes.

---

**Q: What are Content Security Policy (CSP) headers? How do you configure them in Next.js?**

**A:**
CSP is an HTTP header that tells the browser which sources of content (scripts, styles, images) are trusted, preventing XSS by blocking inline scripts and untrusted origins.

```js
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.myapp.com;
  frame-ancestors 'none';
`;

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'Content-Security-Policy', value: cspHeader }] }];
  }
};
```

For Next.js with inline scripts (which it uses), you need nonce-based CSP — generate a nonce in middleware and inject it into both the CSP header and Next.js script tags.

---

## 8. CI/CD & Git Workflows

**Q: What CI/CD pipelines have you worked with?**

**A:**
Primarily **GitHub Actions** and **GitLab CI**. I've configured:
- Lint and type-check on every PR.
- Test suite (Jest + Playwright) on PRs targeting main.
- Build and deploy to staging on merge to `develop`.
- Deploy to production on merge to `main` with manual approval gate.
- Environment-specific `.env` via GitHub Secrets / GitLab CI Variables.

---

**Q: Describe your Git branching strategy.**

**A:**
I've used **trunk-based development** at scale and **Gitflow** on longer-release-cycle projects.

**My preferred approach (trunk-based):**
- `main` is always deployable.
- Feature branches are short-lived (1-3 days max).
- PRs require passing CI + 1 reviewer approval.
- Feature flags gate incomplete features instead of long-lived branches.

This reduces merge conflicts, keeps the team in sync, and enables continuous deployment.

---

**Q: How do you handle environment variables securely in Next.js?**

**A:**
- `NEXT_PUBLIC_` prefix exposes a variable to the browser — for non-sensitive values (public API URLs, analytics IDs).
- Without the prefix, variables are server-only — for secrets, DB URLs, API keys.
- In CI/CD: store secrets in GitHub Secrets / GitLab CI Variables. Never commit `.env.production` files.
- At runtime (Vercel, EC2): set env vars in the platform's environment configuration.
- Use a secrets manager (AWS Secrets Manager, Vault) for production — inject secrets at deploy time, not baked into builds.

---

**Q: What are blue-green deployments and canary releases?**

**A:**
- **Blue-Green:** Two identical production environments (blue = live, green = new version). You deploy to green, test it, then switch traffic. Rollback is instant — just switch back to blue. Zero downtime.
- **Canary:** Route a small percentage of traffic (e.g., 5%) to the new version. Monitor metrics. Gradually increase if healthy, rollback if errors spike.

Blue-green is simpler and safer. Canary is better for catching issues that only appear at real-world scale/traffic patterns. On AWS this can be done with ALB weighted routing or CodeDeploy.

---

## 9. Observability & Monitoring

**Q: What tools have you used for error tracking and monitoring?**

**A:**
- **Sentry:** Frontend error tracking — captures unhandled exceptions with stack traces, source maps, user context, and session replay. I've integrated it in both React and Next.js projects.
- **Datadog:** APM, logs, metrics. Used for distributed tracing across frontend and backend.
- **Vercel Analytics / Speed Insights:** Core Web Vitals monitoring for Next.js deployments.

---

**Q: How do you log frontend errors in production?**

**A:**
```js
// Global error boundary + Sentry
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }
}

// Also capture unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
});
```

Capture: error message, stack trace, user ID (anonymized), browser/OS, URL, app version, and relevant context (which API call failed, what the user was doing). Use Sentry's `beforeSend` hook to scrub PII before it's logged.

---

## 10. GenAI Tools & AI-Assisted Development

**Q: How do you use GitHub Copilot in your daily workflow?**

**A:**
I use AI coding tools (Copilot, Cline with Ollama locally) for:
- Boilerplate generation — DTO types, test scaffolding, CRUD API routes.
- Refactoring suggestions — cleaning up repetitive code.
- Explaining unfamiliar code sections.
- Writing regex patterns and complex TypeScript generics.

I treat AI output as a **first draft**, not a final answer. I always review it for correctness, security issues, and alignment with our codebase conventions before committing.

---

**Q: How do you verify AI-generated code?**

**A:**
- **Correctness:** Read it, run it, test it. Don't commit untested AI code.
- **Security:** Watch for hardcoded secrets, SQL injection, unsafe `eval`, missing input validation.
- **Performance:** AI often generates naive implementations. Review for N+1 queries, unnecessary re-renders, missing memoization.
- **Code style:** Run ESLint/Prettier — AI often diverges from team conventions.
- **Hallucinations:** Verify library APIs against official docs — AI sometimes invents methods that don't exist.

---

**Q: Give an example of when AI-generated code needed significant correction.**

**A:**
I once had Copilot generate a JWT verification middleware that looked correct but called `jwt.verify()` synchronously and swallowed errors in a bare `catch` block, returning `401` on ANY error including `TokenExpiredError` — which should have been handled differently (trigger refresh) vs `JsonWebTokenError` (invalid token, force logout). The logic was functionally wrong in a subtle way that could only be caught by reading the code carefully and knowing the business requirements. I rewrote the error handling to distinguish error types. This is why AI tools accelerate, not replace, careful engineering judgment.

---

**Q: What are the IP and data-handling risks when using AI tools with client code?**

**A:**
- Code sent to cloud AI tools (Copilot, ChatGPT) may be logged or used for training — risk with proprietary algorithms or client-confidential business logic.
- Regulated industries (finance, healthcare) may have compliance restrictions on sending code to third parties.
- Mitigation: Use local models (Ollama) for sensitive code, configure Copilot's telemetry/training opt-out, review enterprise agreements, avoid pasting credentials or PII into prompts.

---

## 11. Agile & Delivery

**Q: Describe your Agile workflow.**

**A:**
I've worked in 2-week sprint cycles with: Sprint Planning (break epics into tasks, estimate in story points), Daily Standups (blockers, progress), Sprint Review (demo to stakeholders), Retrospectives (what went well / what to improve). I use Jira for tracking and have collaborated with PMs to write acceptance criteria in Given/When/Then format.

---

**Q: How do you handle scope creep mid-sprint?**

**A:**
I surface it immediately to the PM. New work mid-sprint means something existing has to move out or the sprint goal is at risk. I never silently absorb scope — it leads to half-finished work and missed commitments. I help the PM understand the tradeoff: "We can add X, but it means Y moves to next sprint." The decision is theirs, but I make the impact visible.

---

**Q: Describe how you clarify requirements and define acceptance criteria.**

**A:**
Before a story enters development, I do a "definition of ready" check:
- Is the happy path clear?
- Are edge cases defined (empty states, error states, permission boundaries)?
- Are designs provided for all states?
- Is there an API contract (or do we need to align with backend)?

For ambiguous requirements, I write my assumptions as comments on the Jira ticket and get PM/design sign-off before coding.

---

**Q: How do you handle a situation where design specs conflict with technical constraints?**

**A:**
I raise it early — design-dev alignment should happen before sprint, not during. I explain the constraint in plain terms ("This animation requires recalculating layout every frame at 60fps, which will cause CLS and lag on mobile"), propose an alternative that achieves the same user goal with less technical risk, and get design buy-in. I never silently "fix" design because it's easier — that breaks trust with the design team.

---

## 12. Code Quality & Engineering Standards

**Q: What do you look for in a code review?**

**A:**
- **Correctness:** Does it do what the ticket says? Are edge cases handled?
- **Security:** No exposed secrets, no `dangerouslySetInnerHTML` with unsanitized input, proper auth checks.
- **Performance:** No obvious N+1s, no heavy computation in render, images optimized.
- **Readability:** Self-documenting names, no magic numbers, complexity extracted into named functions.
- **Tests:** Are there tests? Do they cover the core logic and edge cases?
- **Consistency:** Does it follow the team's patterns and conventions?

Code review is also a knowledge-sharing opportunity, not just a gatekeeping exercise.

---

**Q: How do you enforce code quality standards across a team?**

**A:**
- **ESLint + Prettier:** Consistent formatting and linting rules. Fail CI on lint errors.
- **Husky + lint-staged:** Run linting and type checks on pre-commit so issues never make it to a PR.
- **TypeScript strict mode:** Catch issues at compile time.
- **PR templates:** Checklist that includes test coverage, accessibility checks, and documentation updates.
- **SonarQube (or CodeClimate):** Automated code quality metrics and security scanning on PRs.
- **Team-agreed coding standards doc:** Especially for patterns that can't be auto-enforced (naming conventions, file structure, component patterns).

---

**Q: How do you approach refactoring a legacy codebase?**

**A:**
- Never refactor without test coverage. Write characterization tests first to capture current behavior.
- Refactor in small, deployable increments — the "strangler fig" pattern. Don't try to rewrite everything at once.
- Keep refactoring PRs separate from feature PRs — mixing them makes review impossible.
- Agree with the team on the target pattern before starting — refactoring toward inconsistent conventions is counterproductive.
- Measure before and after — performance, bundle size, error rates.

---

## 13. System Design (Frontend Focus)

**Q: How would you design a large-scale Next.js application for a global e-commerce client?**

**A:**
Key decisions:
- **App Router** with RSCs for product pages (SEO-critical, data-heavy, no interactivity needed server-side).
- **ISR** for product listing and category pages — revalidate on inventory/price changes via on-demand revalidation (`revalidatePath`).
- **CDN** for all static assets — images via `next/image` with a CDN origin.
- **Edge Middleware** for A/B testing, geo-routing, auth redirects — runs before the page, minimal latency.
- **Component library** shared across storefront, admin, and marketing sites.
- **React Query** for cart, wishlist, user-specific data (bypasses cache, always fresh).
- **i18n** via Next.js built-in routing (`/en`, `/de`) + translation library (next-intl).
- **Monitoring:** Sentry for errors, Vercel Speed Insights / Datadog RUM for Core Web Vitals.

---

**Q: How would you implement micro-frontends? What are the tradeoffs?**

**A:**
**Approaches:**
- **Module Federation (Webpack 5):** Each team deploys independent bundles. The shell app loads them at runtime. Full independence — different teams can use different frameworks.
- **Next.js Multi-Zone:** Multiple Next.js apps served under one domain with rewrite rules in `next.config.js`. Simpler than Module Federation for teams already on Next.js.
- **iFrames:** True isolation but terrible UX and performance.

**Tradeoffs:**
- ✅ Independent deployments, team autonomy, technology flexibility
- ❌ Duplicate dependencies (multiple copies of React), increased complexity, shared state is hard, worse performance than a monolith, harder DX

My view: micro-frontends solve an organizational problem, not a technical one. They're worth the cost for large orgs with many teams working on the same product. For most projects, a well-organized monorepo with a shared component library is better.

---

**Q: How would you build a real-time dashboard?**

**A:**
- **WebSockets** (via Socket.io or native WS) for bi-directional real-time data — market prices, live metrics, operational dashboards.
- **Server-Sent Events (SSE)** for one-way push — simpler, HTTP-native, auto-reconnects. Good for activity feeds, notifications.
- **React Query with polling** (`refetchInterval`) — simplest solution if true real-time isn't required; reduces infrastructure complexity.
- For high-frequency updates, use virtualization (react-virtual) so the DOM doesn't choke.
- State management: keep real-time data in a dedicated store slice (Zustand) separate from server-fetched data.

---

## 14. Behavioural / HR

**Q: Tell me about yourself and your journey as a frontend developer.**

**A:**
I'm a Full Stack MERN Developer with around 3 years of experience, currently working at Alchemy Techsol in Mumbai. My core stack is React, Next.js, Node.js, TypeScript, MongoDB, and AWS. I've worked across a range of projects — from an AI-integrated product called LilyPads AI where I handled OpenAI API integrations, to infrastructure-heavy work like building a MapTileServer with Nginx load balancing and PM2 process management, to a real-time Location Awareness System using Django Channels and WebSockets.

In the last year I've been deepening my TypeScript and NestJS expertise, getting into proper architecture patterns — module-based design, DTOs, JWT auth flows. I enjoy the intersection of clean frontend UX and solid backend architecture, and I'm looking for a role where I can contribute to larger-scale systems while continuing to grow technically.

---

**Q: Walk me through your most complex project.**

**A:**
The MapTileServer project at Alchemy Techsol stands out. The requirement was to serve vector map tiles at scale with minimal latency. My individual contributions:
- Set up `tileserver-gl` on Ubuntu, managed by PM2 for process supervision and auto-restart.
- Solved an ESM/CommonJS incompatibility in the tileserver package by writing a bash wrapper script that normalized the execution environment.
- Configured Nginx as a reverse proxy with round-robin load balancing across multiple tileserver instances.
- Wrote bootstrap automation scripts so the entire stack could be brought up on a fresh server with a single command.
- The result was a horizontally scalable tile serving infrastructure with PM2 cluster management and near-zero downtime.

---

**Q: Tell me about a time you disagreed with a technical decision. How did you handle it?**

**A:**
On a previous project, the team was planning to store JWT tokens in `localStorage` because "it's simpler." I disagreed — I knew this exposed us to XSS theft. Rather than just pushing back, I wrote a short doc explaining the attack vector with a concrete example, proposed the `httpOnly` cookie approach, and showed how Auth.js would handle it with almost the same implementation effort. The team agreed. I've learned that the most effective disagreements are data-driven and come with an alternative solution, not just a complaint.

---

**Q: Describe a situation where your code had a bug in production. How did you handle it?**

**A:**
On a feature rollout at Alchemy, a data transformation function I wrote wasn't handling a null edge case from one specific API response shape. It caused a silent crash for a subset of users. Steps I took:
1. Identified the scope using Sentry — which users, which endpoint, how frequent.
2. Hotfixed the null check and deployed within the hour.
3. Added a test case specifically covering that null shape so it couldn't regress.
4. Wrote a post-incident note for the team explaining what happened and how we'd catch similar issues earlier (better input validation at the API boundary).

The lesson: bugs happen. What matters is detection speed, communication, fix quality, and not letting it happen again.

---

**Q: How do you stay updated with the rapidly changing frontend ecosystem?**

**A:**
- Follow the official changelogs — React, Next.js, TypeScript release notes.
- Newsletters: This Week in React, JavaScript Weekly.
- GitHub trending and issue discussions for libraries I use.
- Build small experiments with new features before they hit production.
- Engage with the community — I've found that explaining things to others (or writing it down) is the fastest way to solidify understanding.

---

## 15. Deloitte-Specific Questions

**Q: Why do you want to work at Deloitte over a product company?**

**A:**
At a product company you go deep on one domain. At Deloitte, working with multiple enterprise clients across different industries, you're exposed to a breadth of problems, scales, and tech decisions that accelerate your growth in a different way. The DFO&I team specifically interests me because it sits at the intersection of engineering rigor and real client impact — you're not building for the sake of features, you're solving actual operational problems for organizations. I also value Deloitte's investment in upskilling and the access to senior practitioners across disciplines.

---

**Q: What do you know about the Digital Foundry Operate & Innovations (DFO&I) team?**

**A:**
DFO&I is Deloitte's managed services engineering team that operates and continuously innovates client-facing digital products post-launch. Unlike project-based consulting engagements, DFO&I takes ongoing ownership of products — handling performance, reliability, feature evolution, and integration with emerging tech like GenAI. The "Operate" part means SLA accountability and production stability; the "Innovations" part means proactively bringing better solutions to clients rather than just maintaining the status quo. This model appeals to me because it combines engineering discipline with strategic thinking.

---

**Q: How do you see your role contributing to client outcomes, not just code delivery?**

**A:**
Code delivery is a means, not an end. The outcome for a client might be reduced operational costs, faster customer onboarding, or a better NPS score. I try to understand the "why" behind every feature — what metric moves if this works? I ask those questions during requirements, propose solutions that address the root problem rather than just the stated requirement, and flag when a technically correct solution might not actually solve the business problem. That thinking is especially important in a managed services context where you're a long-term partner, not just a delivery team.

---

**Q: Where do you see yourself in 2–3 years?**

**A:**
In 2-3 years I see myself at a Senior Engineer / Tech Lead level — taking architectural ownership of modules, mentoring junior developers, and being the person the team looks to for decisions on frontend architecture and performance. In a Deloitte context, I'd want to be involved in client discovery — helping shape technical approaches from early in engagements, not just executing specs. The exposure to varied client problems here would accelerate that trajectory faster than a single-product environment.

---

**Q: Deloitte values include integrity, inclusion, and making an impact. Give an example of one.**

**A:**
On the HIMSHRAVAN project, a junior developer on the team was consistently having their ideas dismissed in planning meetings because they were less vocal. I started explicitly inviting their input in meetings — "Rohan, you were looking at this part of the codebase — what do you think?" — and I made sure to credit their suggestions when we adopted them. Over a few weeks, they became more confident contributing. This is a small example, but inclusion to me means actively creating space, not just not excluding people. The team got better because of it — their perspective caught a data model issue none of the rest of us had noticed.

---

## Quick Prep Checklist

| Area | Must Revise | Priority |
|---|---|---|
| Next.js App Router & RSC | SSR vs SSG vs ISR, Server Components, caching | 🔴 High |
| React hooks deep dive | useMemo, useCallback, useEffect pitfalls | 🔴 High |
| Jest + RTL | Mock API, async testing, userEvent | 🔴 High |
| Auth | JWT vs session, OAuth/OIDC, NextAuth.js | 🔴 High |
| OWASP basics | XSS, CSRF, CSP in Next.js | 🔴 High |
| Core Web Vitals | LCP, CLS, INP — how to measure & fix | 🟡 Medium |
| TypeScript | Generics, utility types, discriminated unions | 🟡 Medium |
| Accessibility | WCAG, ARIA, focus management | 🟡 Medium |
| CI/CD | GitHub Actions, env vars, deployment flow | 🟡 Medium |
| System Design | Micro-frontends, real-time, i18n | 🟢 Good to have |
| GenAI tools | Copilot usage + verification example | 🟡 Medium |

---

*Prepared for Deloitte DFO&I — Managed Services Engineer II interview. Requisition 353062.*