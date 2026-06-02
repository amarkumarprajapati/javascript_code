# React Performance Optimization

## Why components re-render
A component re-renders when:
- its **state** changes,
- its **props** change,
- its **parent** re-renders (by default, children re-render too).

## React.memo
Skip re-render if props are shallow-equal.
```jsx
const Child = React.memo(function Child({ value }) {
  return <div>{value}</div>;
});
```
> Pair with `useCallback`/`useMemo` so prop references stay stable, otherwise memo is useless.

## useMemo / useCallback
```jsx
// avoid recreating function each render → keeps memoized child stable
const onAdd = useCallback(() => add(id), [id]);
// avoid recomputing heavy value
const sorted = useMemo(() => bigList.sort(cmp), [bigList]);
```

## Code splitting — lazy + Suspense
Load components only when needed → smaller initial bundle.
```jsx
const Dashboard = React.lazy(() => import("./Dashboard"));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

## List virtualization
Render only visible rows for huge lists (`react-window` / `react-virtualized`).

## Key performance tips
- Stable, unique **keys** (not array index for dynamic lists).
- Lift state **down** (keep state local to where it's used).
- Avoid inline object/array/function props to memoized children.
- Debounce expensive handlers (search, resize).
- Split context so unrelated consumers don't re-render.
- Use the **React DevTools Profiler** to find real bottlenecks.

## When NOT to optimize
Premature memoization adds complexity. Measure first.

---

## Common interview questions
1. **What causes re-renders?** → state/props change or parent re-render.
2. **How does React.memo work?** → shallow prop comparison.
3. **Why useCallback with memo?** → keep function reference stable.
4. **How to reduce bundle size?** → lazy/Suspense code splitting.
5. **Render a list of 10k items smoothly?** → virtualization.
