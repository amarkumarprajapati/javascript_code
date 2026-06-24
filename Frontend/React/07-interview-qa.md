# React — Interview Questions & Answers

---

## Core Concepts

### 1. What is React?

**Answer:** React is an open-source **JavaScript library** for building user interfaces. Created by Facebook (Meta). Component-based, declarative, uses a virtual DOM for efficient updates.

Key characteristics:
- Builds UIs from reusable **components**
- **Declarative** — describe what UI should look like
- **Virtual DOM** — efficient diffing and updates
- **One-way data flow** — predictable state management
- **JSX** — HTML-like syntax in JavaScript

Used for SPAs, mobile (React Native), and server-rendered apps (Next.js).

---

### 2. What are the advantages of React?

**Answer:**
- **Component reusability** — build once, compose anywhere
- **Virtual DOM** — minimizes costly real DOM operations
- **Unidirectional data flow** — predictable, easier to debug
- **Strong ecosystem** — React Router, Redux, React Query, Next.js
- **React Native** — same skills for iOS/Android
- **SEO friendly** — with SSR (Next.js)
- **Gentle learning curve** — if you know JavaScript
- **Large community** — jobs, tutorials, tooling

---

### 3. What are the limitations of React?

**Answer:**
- **Library, not framework** — need to choose routing, state management separately
- **JSX learning curve** — mixing HTML and JavaScript
- **Fast-moving ecosystem** — frequent updates and changes
- **Boilerplate** — without frameworks like Next.js
- **Only view layer** — need backend integration separately
- **CSR-only apps** — poor SEO without SSR

---

### 4. What is JSX?

**Answer:** JSX (JavaScript XML) is syntax extension that lets you write HTML-like code inside JavaScript. It compiles to `React.createElement()` calls.

```jsx
// JSX
const el = <h1 className="title">Hello {name}</h1>;

// Compiles to
const el = React.createElement("h1", { className: "title" }, "Hello ", name);
```

Rules: `className` not `class`, single root element (or Fragment), expressions in `{}`.

---

### 5. What is the Virtual DOM? How does React use it?

**Answer:** Virtual DOM is a lightweight **JavaScript object** representation of the real DOM.

**Process:**
1. State/props change → component re-renders
2. React builds a new virtual DOM tree
3. **Diffs** (reconciles) new tree against previous tree
4. Calculates minimal set of DOM changes
5. Applies only those changes to the real DOM

**Why?** Direct DOM manipulation is slow. Virtual DOM batches and minimizes real DOM updates.

---

### 6. What is reconciliation?

**Answer:** Reconciliation is React's **diffing algorithm** that compares the new virtual DOM tree with the previous one to determine the minimum set of changes needed in the real DOM.

React assumes elements of different types produce different trees — it destroys old tree and builds new one. For same-type elements, it updates only changed attributes.

**Keys** help React identify which list items changed, were added, or removed between renders.

---

### 7. What are keys in React? Why are they important?

**Answer:** Keys are special string attributes on list elements that give them **stable identity** across renders.

```jsx
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

**Why important:**
- Help React identify which items changed, added, or removed
- Without keys, React can't efficiently update lists
- Must be **unique among siblings** (not globally)
- Use stable IDs from data — **avoid array index** for dynamic/reorderable lists

---

## Components & Props

### 8. What is the difference between functional and class components?

**Answer:**

| | Functional | Class |
| --- | --- | --- |
| Syntax | `function Component()` | `class extends React.Component` |
| State | `useState` hook | `this.state` |
| Lifecycle | `useEffect` hook | lifecycle methods |
| `this` | Not needed | Required |
| Status | Modern standard | Legacy |

Since React 16.8 (Hooks), functional components have feature parity. Use functional for all new code.

---

### 9. What are props?

**Answer:** Props (properties) are **read-only** inputs passed from parent to child components. They configure and customize child components.

```jsx
function UserCard({ name, age, avatar }) {
  return <div><h2>{name}</h2><p>Age: {age}</p></div>;
}
<UserCard name="John" age={30} avatar="/john.jpg" />
```

Props are **immutable** — child cannot modify them. Data flows one way: parent → child.

---

### 10. What is state in React?

**Answer:** State is **internal mutable data** owned by a component. When state changes, the component re-renders.

```jsx
const [count, setCount] = useState(0);
setCount(c => c + 1); // functional updater for dependent updates
```

| Props | State |
| --- | --- |
| From parent | Internal to component |
| Read-only | Mutable via setter |
| External configuration | Changing data |

---

### 11. Why is setState asynchronous? What is batching?

**Answer:** React **batches** multiple state updates into a single re-render for performance. Updates don't apply immediately — they're queued.

```jsx
setCount(count + 1);
setCount(count + 1); // both see same count → +1 only

setCount(c => c + 1);
setCount(c => c + 1); // functional updater → +2
```

React 18 batches all updates — including inside `setTimeout`, promises, and native events.

---

### 12. What is prop drilling? How do you avoid it?

**Answer:** Prop drilling is passing props through many intermediate components that don't use the data themselves.

```
App → Layout → Sidebar → Nav → UserMenu (needs user prop)
```

**Solutions:**
- **Context API** — share data across tree
- **State management** — Zustand, Redux
- **Component composition** — pass components as children/props

---

### 13. What are controlled vs uncontrolled components?

**Answer:**

| Controlled | Uncontrolled |
| --- | --- |
| React state drives value | DOM holds value |
| `value` + `onChange` | `ref` to read value |
| Full control (validation, formatting) | Simpler for basic forms |
| Preferred approach | Use for simple submit-only forms |

```jsx
// Controlled
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled
<input ref={inputRef} defaultValue="" />
```

---

## Hooks

### 14. What are React Hooks?

**Answer:** Hooks are functions that let you **use state and lifecycle features** in function components without writing classes. Introduced in React 16.8.

Built-in hooks: `useState`, `useEffect`, `useContext`, `useReducer`, `useRef`, `useMemo`, `useCallback`, and more.

Custom hooks extract reusable stateful logic — must start with `use`.

---

### 15. What are the rules of Hooks?

**Answer:**
1. Only call hooks at the **top level** — not inside loops, conditions, or nested functions
2. Only call hooks from **React functions** — components or custom hooks

Breaking these rules causes bugs with hook state getting mixed up between renders.

---

### 16. What is useState?

**Answer:** `useState` adds local state to function components. Returns `[value, setter]`.

```jsx
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: "", email: "" });

setCount(c => c + 1);           // functional update
setUser(prev => ({ ...prev, name: "John" })); // object update
```

---

### 17. What is useEffect? What is the cleanup function?

**Answer:** `useEffect` runs **side effects** after render — fetch, subscriptions, timers, DOM updates.

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup
}, [dep]);
```

**Cleanup function** runs:
- Before the effect re-runs (when deps change)
- When component unmounts

| Deps array | Behavior |
| --- | --- |
| `[]` | Run once on mount |
| `[dep]` | Run when dep changes |
| omitted | Every render (avoid) |

---

### 18. What is the difference between useMemo and useCallback?

**Answer:**

| | useMemo | useCallback |
| --- | --- | --- |
| Memoizes | computed **value** | **function** reference |
| Returns | result of computation | the function itself |
| Use when | expensive calculation | passing callback to memoized child |

```jsx
const sorted = useMemo(() => items.sort(cmp), [items]);
const handler = useCallback(() => doThing(id), [id]);
```

---

### 19. What is useRef? How is it different from useState?

**Answer:** `useRef` returns a mutable object `{ current: value }` that persists across renders **without causing re-renders**.

Uses:
- Access DOM nodes
- Store mutable values (timer IDs, previous values)
- Keep reference to any value without triggering re-render

| useRef | useState |
| --- | --- |
| Change doesn't re-render | Change triggers re-render |
| `.current` is mutable | Must use setter |

---

### 20. What are custom Hooks?

**Answer:** Custom hooks extract **reusable stateful logic**. Must start with `use`. Can call other hooks.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [url]);

  return { data, loading };
}

// Usage in any component
const { data, loading } = useFetch("/api/users");
```

Replaces HOCs and render props for logic reuse.

---

### 21. When to use useState vs useReducer?

**Answer:**

| useState | useReducer |
| --- | --- |
| Simple independent values | Complex related state |
| Few state updates | Many transition types |
| No complex logic | State depends on previous state |

```jsx
// useReducer for complex state
function reducer(state, action) {
  switch (action.type) {
    case "add": return { items: [...state.items, action.payload] };
    case "remove": return { items: state.items.filter(i => i.id !== action.payload) };
    default: return state;
  }
}
```

---

## Performance

### 22. What causes a React component to re-render?

**Answer:**
1. Its **state** changes
2. Its **props** change (new reference)
3. Its **parent** re-renders (children re-render by default)
4. **Context** it consumes changes

---

### 23. What is React.memo? When should you use it?

**Answer:** `React.memo` is a HOC that **skips re-rendering** if props haven't changed (shallow comparison).

```jsx
const Child = React.memo(function Child({ value }) {
  return <div>{value}</div>;
});
```

Use when:
- Component renders often with same props
- Component is expensive to render
- Pair with `useCallback`/`useMemo` for stable prop references

Don't wrap everything — memoization has overhead. Profile first.

---

### 24. How do you optimize a large list in React?

**Answer:**
- **Virtualization** — `react-window` / `react-virtualized` — render only visible rows
- **Stable keys** — unique IDs, not array index
- **Pagination** — load data in chunks
- **React.memo** on list items with stable props
- **Avoid inline functions** in map callbacks passed to memoized children

---

### 25. What is code splitting? How do you implement it in React?

**Answer:** Code splitting loads JavaScript in chunks — only download code needed for current view.

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

Next.js does route-based splitting automatically. In CRA/Vite, use `React.lazy` + dynamic `import()`.

---

## Advanced

### 26. What are Error Boundaries?

**Answer:** Error boundaries are React components that **catch JavaScript errors** in their child component tree, log them, and display fallback UI.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() {
    return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children;
  }
}
```

Must be a **class component** — no hook equivalent yet. Does not catch event handler errors or async errors.

---

### 27. What is lifting state up?

**Answer:** When two or more sibling components need to share state, **move the state to their closest common parent** and pass it down via props.

```jsx
function Parent() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input value={value} onChange={setValue} />
      <Preview value={value} />
    </>
  );
}
```

---

### 28. What is Context API? What are its limitations?

**Answer:** Context provides a way to pass data through the component tree **without prop drilling**.

```jsx
const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);
```

**Limitations:**
- All consumers re-render when value changes
- Not optimized for frequently changing data
- Can make component reuse harder

**Fix:** Split contexts, memoize value, use state management library for complex state.

---

### 29. What is a Higher-Order Component (HOC)?

**Answer:** A HOC is a function that takes a component and returns an **enhanced component** with additional props or behavior.

```jsx
function withAuth(WrappedComponent) {
  return function(props) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}
```

**Modern alternative:** custom hooks — simpler and more composable.

---

### 30. What is the difference between React and Angular?

**Answer:**

| | React | Angular |
| --- | --- | --- |
| Type | Library | Full framework |
| Language | JavaScript/JSX | TypeScript |
| Data binding | One-way | Two-way |
| DOM | Virtual DOM | Real DOM |
| Learning curve | Moderate | Steep |
| Size | Smaller | Larger |
| State | External (Redux, etc.) | Built-in services |

---

### 31. What is Redux? Explain the data flow.

**Answer:** Redux is a predictable state container for JavaScript apps.

**Data flow:**
```
UI → dispatch(action) → reducer → new state → store → UI re-renders
```

**Core concepts:**
- **Store** — single source of truth
- **Action** — `{ type, payload }` describing what happened
- **Reducer** — pure function `(state, action) => newState`
- **Dispatch** — send action to store
- **Selector** — read slice of state

Modern Redux uses **Redux Toolkit** — less boilerplate, Immer, built-in thunk.

---

### 32. What is React Router?

**Answer:** React Router enables **client-side routing** in SPAs — navigation without full page reload.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<UserProfile />} />
  </Routes>
</BrowserRouter>
```

Supports nested routes, route params, programmatic navigation, and protected routes.

---

### 33. What is Strict Mode?

**Answer:** `React.StrictMode` is a development tool that:
- Double-invokes renders and effects to surface bugs
- Warns about deprecated APIs
- Detects unexpected side effects

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

Only runs in development — no impact on production.

---

### 34. What is hydration?

**Answer:** Hydration is the process where React **attaches event listeners** to server-rendered HTML to make it interactive.

Used in SSR frameworks (Next.js). React expects client render output to match server HTML exactly — mismatches cause hydration errors.

**Fixes:** Move browser-only code to `useEffect`, use `suppressHydrationWarning` for known mismatches.

---

### 35. What is the difference between Element and Component?

**Answer:**

| React Element | React Component |
| --- | --- |
| Plain object describing UI | Function or class that returns elements |
| `{ type, props, key }` | `function Button() { return <button /> }` |
| Immutable | Can have state and lifecycle |
| Created by JSX or createElement | Used in JSX as `<Button />` |

```jsx
const element = <h1>Hello</h1>;        // element
const Component = () => <h1>Hello</h1>; // component
const rendered = <Component />;          // element created from component
```

---

## Quick Revision

```
React           = UI library, components, virtual DOM
JSX             = HTML-like syntax → createElement
Virtual DOM     = JS tree, diffed for efficient updates
Props           = read-only parent → child data
State           = internal mutable data (useState)
Hooks           = state/lifecycle in function components
useEffect       = side effects + cleanup
useMemo         = memoize value
useCallback     = memoize function
React.memo      = skip re-render on same props
Context         = share data without prop drilling
Redux           = dispatch → reducer → store → UI
Error Boundary  = catch render errors (class only)
Hydration       = attach React to server HTML
```
