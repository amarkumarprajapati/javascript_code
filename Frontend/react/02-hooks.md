# React Hooks

Hooks let function components use state and lifecycle features.

## Rules of hooks
1. Only call at the **top level** (not in loops/conditions/nested functions).
2. Only call from React functions (components or custom hooks).

## useState
```jsx
const [count, setCount] = useState(0);
setCount((c) => c + 1); // functional update (safe for dependent updates)
```

## useEffect
Run side effects (fetch, subscriptions, timers) after render.
```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup (on unmount / before re-run)
}, [dep]); // [] = run once on mount; no array = every render
```
- Cleanup runs before the next effect and on unmount.
- Common bug: missing deps → stale values; or object/array deps causing infinite loops.

## useRef
- Persist a mutable value across renders **without** re-rendering.
- Access DOM nodes.
```jsx
const inputRef = useRef(null);
<input ref={inputRef} />;
inputRef.current.focus();
```

## useMemo vs useCallback
- **useMemo** → memoize a **computed value**.
- **useCallback** → memoize a **function reference** (so children don't re-render).
```jsx
const expensive = useMemo(() => heavyCalc(a, b), [a, b]);
const handleClick = useCallback(() => doThing(id), [id]);
```
> Only optimize when there's a real perf issue; overusing adds complexity.

## useContext
Avoid prop drilling — read shared data.
```jsx
const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);
```

## useReducer
For complex state logic (Redux-like, local).
```jsx
function reducer(state, action) {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: "inc" });
```

## Custom hooks
Extract reusable stateful logic. Must start with `use`.
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch(url)
      .then((r) => r.json())
      .then((d) => active && (setData(d), setLoading(false)));
    return () => { active = false; };
  }, [url]);
  return { data, loading };
}
```

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
```

---

## Common interview questions
1. **Rules of hooks?** → top level + only React functions.
2. **useMemo vs useCallback?** → value vs function reference.
3. **useEffect cleanup — when runs?** → before next effect & on unmount.
4. **useRef vs useState?** → ref doesn't trigger re-render.
5. **Why custom hooks?** → reuse stateful logic without HOCs/render props.
6. **useState vs useReducer?** → reducer for complex/related state transitions.
