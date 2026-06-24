# React — Performance Optimization

---

## Why Components Re-render

A component re-renders when:
1. Its **state** changes
2. Its **props** change (new reference)
3. Its **parent** re-renders (children re-render by default)
4. **Context** it consumes changes

```
Parent re-renders → all children re-render (unless prevented)
```

---

## React.memo

Skip re-render if props are **shallow equal**.

```jsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onSelect }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onSelect(item.id)}>{item.name}</li>
      ))}
    </ul>
  );
});
```

**Only helps when:**
- Component renders often with same props
- Component is expensive to render
- Props are stable (use `useCallback`/`useMemo` for object/function props)

```jsx
// ❌ memo useless — new function every render
<MemoizedChild onClick={() => handleClick(id)} />

// ✅ stable reference
const onClick = useCallback(() => handleClick(id), [id]);
<MemoizedChild onClick={onClick} />
```

---

## useMemo & useCallback

```jsx
// Memoize expensive computation
const sortedItems = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items]
);

// Stable function reference for memoized children
const handleDelete = useCallback(
  (id) => deleteItem(id),
  [deleteItem]
);
```

| Hook | Memoizes | Use when |
| --- | --- | --- |
| `useMemo` | computed value | expensive calculation |
| `useCallback` | function reference | passing to `React.memo` child |

> **Don't overuse** — memoization has memory and comparison overhead. Profile first.

---

## Code Splitting

Load components only when needed — smaller initial bundle.

```jsx
import { lazy, Suspense } from "react";

const AdminPanel = lazy(() => import("./AdminPanel"));
const Chart = lazy(() => import("./Chart"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/chart" element={<Chart />} />
      </Routes>
    </Suspense>
  );
}
```

### Route-based splitting

Each route becomes a separate JS chunk — user only downloads what they visit.

```jsx
// Next.js — automatic per-page splitting
// React Router + lazy — manual per route
```

---

## List Virtualization

Render only visible rows for huge lists (10k+ items).

```jsx
import { FixedSizeList } from "react-window";

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

Libraries: `react-window`, `react-virtualized`, `@tanstack/react-virtual`.

---

## Key Performance Tips

### 1. Stable keys

```jsx
// ✅ unique stable ID
{items.map(item => <Row key={item.id} />)}

// ❌ index — breaks on reorder/delete
{items.map((item, i) => <Row key={i} />)}
```

### 2. Lift state down

Keep state as local as possible — fewer components re-render.

```jsx
// ❌ state in App → everything re-renders on typing
function App() {
  const [search, setSearch] = useState("");
  return <><SearchBox search={search} setSearch={setSearch} /><ExpensiveList /></>;
}

// ✅ state in SearchBox → only SearchBox re-renders
function App() {
  return <><SearchBox /><ExpensiveList /></>;
}
```

### 3. Avoid inline objects/arrays/functions in props

```jsx
// ❌ new reference every render
<Child style={{ color: "red" }} onClick={() => doThing()} />

// ✅ stable references
const style = useMemo(() => ({ color: "red" }), []);
const onClick = useCallback(() => doThing(), []);
<Child style={style} onClick={onClick} />
```

### 4. Split Context

```jsx
// ❌ one big context — all consumers re-render on any change
const AppContext = createContext({ user, theme, cart, notifications });

// ✅ split by concern
const UserContext = createContext();
const ThemeContext = createContext();
const CartContext = createContext();
```

### 5. Debounce expensive handlers

```jsx
const debouncedSearch = useDebounce(query, 300);
useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
```

### 6. React 18 transitions

```jsx
const [isPending, startTransition] = useTransition();
startTransition(() => setFilteredItems(heavyFilter(query)));
```

---

## Bundle Size Reduction

| Technique | Example |
| --- | --- |
| Tree shaking | `import { format } from "date-fns"` not entire library |
| Dynamic imports | `lazy(() => import("./Heavy"))` |
| Replace heavy libs | `dayjs` instead of `moment` |
| Analyze bundle | `webpack-bundle-analyzer`, `@next/bundle-analyzer` |
| Remove unused deps | audit `package.json` |

---

## Profiling

### React DevTools Profiler

1. Record interaction
2. See which components re-rendered and why
3. See render duration per component
4. Find unnecessary re-renders

### Chrome DevTools Performance tab

- Record page load
- Find long tasks blocking main thread
- Identify layout thrashing

### web-vitals

```jsx
import { getCLS, getLCP, getFID } from "web-vitals";

getCLS(console.log);
getLCP(console.log);
getFID(console.log);
```

---

## Core Web Vitals (Frontend)

| Metric | Measures | Target |
| --- | --- | --- |
| **LCP** | Largest content paint time | < 2.5s |
| **CLS** | Layout shift | < 0.1 |
| **INP** | Interaction responsiveness | < 200ms |

**React fixes:** code splitting, memo, lazy loading, virtualization, transitions, avoid blocking main thread.

---

## When NOT to Optimize

- Don't wrap every component in `React.memo`
- Don't `useMemo` simple expressions
- Don't `useCallback` functions not passed to memoized children
- **Measure first** — React DevTools Profiler, Lighthouse

Premature optimization adds complexity without measurable benefit.

---

## Common Patterns

### Windowing large tables

```jsx
// react-window for tables with 10k+ rows
<FixedSizeList height={400} itemCount={rows.length} itemSize={35}>
  {Row}
</FixedSizeList>
```

### Paginate instead of render all

```jsx
const visibleItems = items.slice(page * pageSize, (page + 1) * pageSize);
```

### Web Workers for heavy computation

```jsx
const worker = new Worker(new URL("./heavyCalc.worker.js", import.meta.url));
worker.postMessage(data);
worker.onmessage = (e) => setResult(e.data);
```

---

## Quick Revision

```
Re-render causes  → state, props, parent, context change
React.memo        → skip re-render on shallow-equal props
useMemo           → memoize expensive value
useCallback       → stable function for memo children
lazy + Suspense   → code splitting
Virtualization    → render only visible list rows
Lift state down   → keep state local
Split context     → avoid broad re-renders
Profile first     → React DevTools before optimizing
```
