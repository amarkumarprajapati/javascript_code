# React — How It Works

---

## What is React?

React is a **JavaScript library** for building user interfaces. Created by Facebook (Meta). Component-based, declarative, uses a virtual DOM for efficient updates.

```jsx
function App() {
  return <h1>Hello React</h1>;
}
```

React is **not** a full framework — it handles the view layer. You add routing (React Router), state (Redux/Zustand), and data fetching (React Query) separately.

---

## Core Architecture

```
┌─────────────────────────────────────────┐
│              Your Components            │
│   (JSX → function calls → elements)     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│           Virtual DOM (VDOM)            │
│   Lightweight JS object tree              │
└─────────────────┬───────────────────────┘
                  │ Reconciliation (diff)
                  ▼
┌─────────────────────────────────────────┐
│            Real DOM (Browser)           │
│   Only changed nodes are updated          │
└─────────────────────────────────────────┘
```

---

## JSX — How It Compiles

JSX looks like HTML but compiles to JavaScript function calls.

```jsx
// What you write
const el = <h1 className="title">Hello {name}</h1>;

// What Babel compiles it to
const el = React.createElement("h1", { className: "title" }, "Hello ", name);
```

React.createElement returns a **React element** — a plain object describing what to render:

```js
{
  type: "h1",
  props: { className: "title", children: ["Hello ", "John"] },
  key: null,
  ref: null
}
```

---

## Virtual DOM & Reconciliation

### Why Virtual DOM?

Direct DOM manipulation is **slow** — triggers layout recalculation, repaints, reflows. React batches updates through a virtual representation first.

### How reconciliation works

1. **State/props change** → component re-renders
2. React builds a **new** virtual DOM tree
3. **Diffs** new tree against previous tree (reconciliation algorithm)
4. Calculates **minimal set of changes** needed
5. Applies only those changes to the **real DOM**

```
Old VDOM          New VDOM          Real DOM update
─────────         ─────────         ───────────────
<div>             <div>             (no change)
  <p>A</p>    →     <p>B</p>    →   update text "A" → "B"
  <span>1</span>    <span>1</span>  (no change)
</div>            </div>
```

### Keys in lists

React uses **keys** to match list items between renders.

```jsx
// ✅ Stable unique ID
{items.map(item => <li key={item.id}>{item.name}</li>)}

// ❌ Index as key — breaks when list reorders/deletes
{items.map((item, i) => <li key={i}>{item.name}</li>)}
```

Without stable keys, React can't tell which item moved — causes wrong DOM reuse and state bugs.

---

## Render Cycle

```
1. Trigger (setState, props change, parent re-render)
        ↓
2. Render phase — call component function, build new VDOM
        ↓
3. Reconciliation — diff old vs new VDOM
        ↓
4. Commit phase — apply DOM updates, run useLayoutEffect
        ↓
5. Browser paints
        ↓
6. useEffect runs (after paint)
```

### Batching

React **batches** multiple state updates into one re-render for performance.

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // Only ONE re-render, not two
}
```

React 18 batches updates everywhere — including promises, timeouts, and native event handlers.

---

## One-Way Data Flow

Data flows **down** from parent to child via props. Events flow **up** via callbacks.

```
        App (state: user)
         │ props: user
         ▼
       Header
         │ props: onLogout
         ▼
      Button ──onClick──► App.setUser(null)
```

Child components cannot modify props directly — they call parent callbacks to request changes.

---

## Component Tree

React apps are a tree of components. When state changes in a component, React re-renders that component and **all its children** by default.

```
App
├── Header
│   └── Nav
├── Main
│   ├── Sidebar
│   └── Content
│       └── ProductList
│           └── ProductCard (×N)
└── Footer
```

**Re-render rule:** If `App` re-renders, `Header`, `Main`, `Footer` all re-render too — unless prevented with `React.memo`.

---

## React Fiber (Internal Engine)

React Fiber is the **reconciliation engine** since React 16. It enables:

- **Incremental rendering** — split work into chunks, don't block the main thread
- **Priority-based updates** — user input (high priority) before background work
- **Pause and resume** — interrupt low-priority work for urgent updates
- **Concurrent features** — Suspense, transitions, concurrent mode

```
Old Stack Reconciler     Fiber Reconciler
────────────────────     ────────────────
Recursive, blocking      Incremental, interruptible
All-or-nothing render    Priority-based scheduling
No concurrent mode       Enables React 18 features
```

---

## React 18 Concurrent Features

### Automatic Batching
All state updates batched — even inside `setTimeout`, promises, native events.

### Transitions
Mark non-urgent updates so urgent ones (typing) aren't blocked.

```jsx
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setInput(e.target.value);                    // urgent
  startTransition(() => setResults(search())); // non-urgent
}
```

### Suspense
Declaratively wait for async data or lazy components.

```jsx
<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

---

## Strict Mode (Development)

React 18 Strict Mode **double-invokes** certain functions in development to surface bugs:

- Component render functions
- State updater functions
- `useEffect` setup/cleanup

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

This only happens in development — production behavior is normal.

---

## Hydration (SSR Context)

When using SSR (Next.js, etc.), the server sends HTML. React **hydrates** it — attaches event listeners and makes it interactive.

```
Server → HTML sent to browser → React hydrates → Interactive app
```

Hydration requires client render output to **match** server HTML exactly — mismatches cause hydration errors.

---

## React vs Real DOM — Summary

| Real DOM | Virtual DOM |
| --- | --- |
| Browser API, slow to update | JS object, fast to create/diff |
| Direct manipulation | React manages updates |
| Full repaint on change | Minimal targeted updates |
| Imperative | Declarative (describe UI, React handles DOM) |

---

## Quick Revision

```
React          = UI library, component-based, declarative
JSX            = syntax sugar for React.createElement
Virtual DOM    = JS copy of DOM for efficient diffing
Reconciliation = diff algorithm matching old/new VDOM
Keys           = stable identity for list items
One-way flow   = props down, events up
Batching       = multiple setState → one re-render
Fiber          = incremental reconciliation engine
Hydration      = attach React to server-rendered HTML
```
