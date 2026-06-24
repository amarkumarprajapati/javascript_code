# React — Hooks

Hooks let function components use state, lifecycle, and other React features without classes.

---

## Rules of Hooks

1. Only call at the **top level** — not inside loops, conditions, or nested functions
2. Only call from **React functions** — components or custom hooks (names start with `use`)

```jsx
// ❌ Wrong — conditional hook
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ✅ Correct — always at top level
const [user, setUser] = useState(null);
```

---

## useState

Add state to function components.

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: "", email: "" });
const [items, setItems] = useState([]);

// Functional update — safe for dependent updates
setCount(c => c + 1);

// Object state — spread to avoid mutation
setUser(prev => ({ ...prev, name: "John" }));

// Array state
setItems(prev => [...prev, newItem]);
setItems(prev => prev.filter(item => item.id !== id));
```

---

## useEffect

Run side effects after render — fetch, subscriptions, timers, DOM manipulation.

```jsx
useEffect(() => {
  // Effect runs after render
  document.title = `Count: ${count}`;

  return () => {
    // Cleanup — before next effect & on unmount
  };
}, [count]); // dependency array
```

| Dependency array | Behavior |
| --- | --- |
| `[dep]` | Run when `dep` changes |
| `[]` | Run once on mount |
| omitted | Run every render (avoid) |

### Common patterns

```jsx
// Fetch on mount
useEffect(() => {
  fetch("/api/users")
    .then(r => r.json())
    .then(setUsers);
}, []);

// Subscription with cleanup
useEffect(() => {
  const sub = eventBus.subscribe("update", handleUpdate);
  return () => sub.unsubscribe();
}, []);

// Prevent stale closure with cleanup flag
useEffect(() => {
  let active = true;
  fetch(url)
    .then(r => r.json())
    .then(data => { if (active) setData(data); });
  return () => { active = false; };
}, [url]);
```

**Common bugs:** missing deps → stale values; object/array deps → infinite loops.

---

## useRef

Persist a mutable value across renders **without** triggering re-render. Access DOM nodes.

```jsx
const inputRef = useRef(null);
const countRef = useRef(0);

// DOM access
<input ref={inputRef} />
inputRef.current.focus();

// Mutable value (doesn't cause re-render)
countRef.current += 1;

// Store previous value
const prevCount = useRef();
useEffect(() => {
  prevCount.current = count;
}, [count]);
```

| useRef | useState |
| --- | --- |
| Change doesn't re-render | Change triggers re-render |
| `.current` is mutable | Must use setter |
| DOM access | UI state |

---

## useContext

Read shared context value — avoids prop drilling.

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}
```

Split contexts to avoid unnecessary re-renders:

```jsx
const UserContext = createContext();
const ThemeContext = createContext();
// Consumers only re-render when their context changes
```

---

## useReducer

Complex state logic — Redux-like, local to component.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    case "reset":     return { count: 0 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

**Use when:** multiple related state values, complex transitions, next state depends on previous.

---

## useMemo

Memoize an **expensive computed value**.

```jsx
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

const filtered = useMemo(
  () => products.filter(p => p.category === category),
  [products, category]
);
```

Only use when there's a real performance cost — simple expressions don't need memoization.

---

## useCallback

Memoize a **function reference** — prevents child re-renders when passed to `React.memo` children.

```jsx
const handleDelete = useCallback(
  (id) => deleteItem(id),
  [deleteItem]
);

// Stable reference — memoized child won't re-render unnecessarily
<MemoizedList onDelete={handleDelete} />
```

| Hook | Memoizes |
| --- | --- |
| `useMemo` | computed **value** |
| `useCallback` | **function** reference |

---

## useLayoutEffect

Same as `useEffect` but runs **synchronously after DOM mutations, before browser paint**.

```jsx
useLayoutEffect(() => {
  // Measure DOM before user sees it
  const height = ref.current.getBoundingClientRect().height;
  setTooltipPosition(height);
}, []);
```

Use for DOM measurements and synchronous layout updates. Prefer `useEffect` for everything else.

---

## useImperativeHandle

Customize the ref value exposed by a child component (with `forwardRef`).

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ""; },
  }));

  return <input ref={inputRef} {...props} />;
});

// Parent
const ref = useRef();
ref.current.focus();
ref.current.clear();
```

---

## React 18 Hooks

### useTransition

Mark state updates as non-urgent.

```jsx
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  setQuery(e.target.value);                        // urgent
  startTransition(() => setResults(filter(e.target.value))); // non-urgent
}

return (
  <>
    <input onChange={handleChange} />
    {isPending && <Spinner />}
    <Results data={results} />
  </>
);
```

### useDeferredValue

Defer a value — keeps UI responsive during expensive re-renders.

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(deferredQuery), [deferredQuery]);
```

### useId

Generate unique stable IDs for accessibility.

```jsx
const id = useId();
<label htmlFor={id}>Name</label>
<input id={id} />
```

### useSyncExternalStore

Subscribe to external stores (used internally by Redux, Zustand).

```jsx
const state = useSyncExternalStore(
  store.subscribe,
  store.getSnapshot
);
```

---

## Custom Hooks

Extract reusable stateful logic. Must start with `use`.

### useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

// Usage
const { data, loading, error } = useFetch("/api/users");
```

### useDebounce

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const debouncedSearch = useDebounce(search, 300);
useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
```

### useLocalStorage

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; }
    catch { return initial; }
  });

  const set = (val) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, set];
}
```

### useToggle

```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

const [isOpen, toggleOpen] = useToggle();
```

### useMediaQuery

```jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const handler = (e) => setMatches(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

const isMobile = useMediaQuery("(max-width: 768px)");
```

### usePrevious

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
```

---

## Class Lifecycle → Hooks Mapping

| Class lifecycle | Hook equivalent |
| --- | --- |
| `constructor` | `useState` |
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [deps])` |
| `componentWillUnmount` | `useEffect` cleanup |
| `shouldComponentUpdate` | `React.memo` |
| `getDerivedStateFromProps` | Compute during render |
| `componentDidCatch` | Error Boundary (class only) |

---

## Quick Reference

```
useState         → local state
useEffect        → side effects, cleanup
useRef           → DOM access, persist without re-render
useContext       → read shared context
useReducer       → complex state logic
useMemo          → memoize computed value
useCallback      → memoize function reference
useLayoutEffect  → sync effect before paint
useTransition    → non-urgent state updates
useDeferredValue → defer expensive re-renders
useId            → unique stable IDs
Custom hooks     → reuse stateful logic (must start with use)
```
