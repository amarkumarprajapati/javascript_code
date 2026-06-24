# React — Features

---

## Key Features Overview

| Feature | Description |
| --- | --- |
| **Component-based** | UI built from reusable, composable components |
| **Declarative** | Describe what UI should look like, React handles how |
| **Virtual DOM** | Efficient updates via diffing |
| **One-way data flow** | Predictable state management |
| **JSX** | HTML-like syntax in JavaScript |
| **Hooks** | State and lifecycle in function components |
| **Context** | Share data without prop drilling |
| **Suspense** | Declarative loading states |
| **Concurrent Mode** | Non-blocking, priority-based rendering |
| **SSR support** | Server-side rendering (Next.js, Remix) |
| **DevTools** | Browser extension for debugging |

---

## Declarative UI

Describe **what** the UI should look like for a given state — React handles **how** to update the DOM.

```jsx
// Declarative — describe outcome
function UserStatus({ isOnline }) {
  return <span>{isOnline ? "🟢 Online" : "⚫ Offline"}</span>;
}

// Imperative (vanilla JS) — describe steps
const span = document.getElementById("status");
if (isOnline) {
  span.textContent = "🟢 Online";
  span.className = "online";
} else {
  span.textContent = "⚫ Offline";
  span.className = "offline";
}
```

---

## Reusable Components

Build once, use anywhere with different props.

```jsx
function Button({ variant, size, children, onClick }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

<Button variant="primary" size="lg" onClick={handleSave}>Save</Button>
<Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
```

---

## Fragments

Group elements without adding extra DOM nodes.

```jsx
// Short syntax
return (
  <>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </>
);

// Explicit Fragment with key (for lists)
return (
  <React.Fragment key={item.id}>
    <td>{item.name}</td>
    <td>{item.price}</td>
  </React.Fragment>
);
```

---

## Context API

Share data across the component tree without prop drilling.

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
      {theme} mode
    </button>
  );
}
```

**Best for:** theme, auth user, locale — low-frequency updates.

**Avoid for:** frequently changing data — causes all consumers to re-render.

---

## Portals

Render children into a DOM node outside the parent hierarchy.

```jsx
import { createPortal } from "react-dom";

function Modal({ isOpen, children }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">{children}</div>
    </div>,
    document.getElementById("modal-root")
  );
}
```

**Use for:** modals, tooltips, dropdowns — escape parent overflow/z-index constraints.

---

## Refs & forwardRef

Access DOM nodes or persist values without re-rendering.

```jsx
// Direct ref
const inputRef = useRef(null);
inputRef.current.focus();

// Forward ref to child component
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});

function Form() {
  const ref = useRef(null);
  return <FancyInput ref={ref} />;
}
```

---

## Error Boundaries

Catch JavaScript errors in child component tree — display fallback UI.

```jsx
// Must be a class component (no hook equivalent yet)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

Does **not** catch: event handler errors, async errors, SSR errors, errors in the boundary itself.

---

## Suspense

Declaratively handle loading states for lazy components or async data.

```jsx
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}

// Nested Suspense for granular loading
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <SlowContent />
  </Suspense>
</Suspense>
```

---

## Code Splitting (Lazy Loading)

Load components only when needed — reduces initial bundle size.

```jsx
const AdminPanel = lazy(() => import("./AdminPanel"));
const Settings = lazy(() => import("./Settings"));

function App() {
  const [page, setPage] = useState("home");

  return (
    <Suspense fallback={<Loading />}>
      {page === "admin" && <AdminPanel />}
      {page === "settings" && <Settings />}
    </Suspense>
  );
}
```

---

## Higher-Order Components (HOC)

Function that takes a component and returns an enhanced component.

```jsx
function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
```

**Modern alternative:** custom hooks (`useAuth`) — simpler and more composable.

---

## Render Props

Share code via a function prop.

```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return render(pos);
}

<MouseTracker render={({ x, y }) => <p>Mouse: {x}, {y}</p>} />
```

**Modern alternative:** custom hooks — same logic, cleaner API.

---

## React 18 Features

### Automatic Batching

All state updates batched — including inside `setTimeout`, promises, native events.

```jsx
// React 18 — both batched into one render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
```

### useTransition

Mark state updates as non-urgent transitions.

```jsx
const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  setInput(query);                              // urgent — update input immediately
  startTransition(() => setResults(filter(query))); // non-urgent — can be interrupted
}
```

### useDeferredValue

Defer updating a value — keeps UI responsive during expensive re-renders.

```jsx
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => search(deferredQuery), [deferredQuery]);
```

### useId

Generate unique stable IDs for accessibility.

```jsx
const id = useId();
return (
  <>
    <label htmlFor={id}>Email</label>
    <input id={id} type="email" />
  </>
);
```

### useSyncExternalStore

Subscribe to external stores (Redux, Zustand internals).

---

## Strict Mode

Development-only tool that surfaces potential problems.

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

- Double-invokes renders and effects in dev
- Warns about deprecated APIs
- Detects unexpected side effects

---

## React DevTools

Browser extension for debugging:
- Component tree inspection
- Props and state viewer
- Profiler — measure render performance
- Highlight re-renders

---

## Styling Options

| Approach | Example |
| --- | --- |
| **CSS Modules** | `import styles from './Button.module.css'` |
| **Tailwind CSS** | `<button className="bg-blue-500 px-4">` |
| **CSS-in-JS** | styled-components, Emotion |
| **Inline styles** | `style={{ color: 'red' }}` |
| **Sass/Less** | `.scss` files imported directly |

```jsx
// CSS Modules
import styles from "./Card.module.css";
<div className={styles.card}>

// Tailwind
<div className="flex items-center gap-4 p-4 rounded-lg shadow">

// styled-components
const Button = styled.button`
  background: ${props => props.primary ? "blue" : "gray"};
`;
```

---

## React Router (Common Addition)

Client-side routing for SPAs.

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Advantages of React

- **Component reusability** — build once, use everywhere
- **Virtual DOM** — efficient updates
- **Large ecosystem** — libraries for everything
- **Strong community** — jobs, tutorials, tooling
- **React Native** — same skills for mobile
- **Flexible** — use only what you need
- **SEO friendly** — with SSR (Next.js)

---

## Limitations of React

- **Library, not framework** — need to choose routing, state, etc.
- **JSX learning curve** — HTML + JS mixed
- **Fast-moving ecosystem** — frequent updates
- **Boilerplate** — without Next.js or frameworks
- **SEO** — CSR-only apps need extra work

---

## Quick Revision

```
Declarative    = describe UI for state, React updates DOM
Fragment       = group without extra DOM node
Context        = share data, avoid prop drilling
Portal         = render outside parent DOM tree
Error Boundary = catch render errors (class only)
Suspense       = declarative loading fallback
lazy()         = code splitting on demand
HOC            = enhance component (legacy pattern)
useTransition  = non-urgent state updates
Strict Mode    = dev-only bug detection
```
