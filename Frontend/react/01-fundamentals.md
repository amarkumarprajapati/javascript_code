# React Fundamentals

## What is React?
A library for building UIs from **components** using a **declarative** approach and a **virtual DOM** for efficient updates.

## JSX
Syntax that looks like HTML but compiles to `React.createElement(...)`.
```jsx
const el = <h1 className="title">Hi {name}</h1>;
// → React.createElement("h1", { className: "title" }, "Hi ", name)
```
- `className` not `class`, `htmlFor` not `for`.
- Must return a single root (use a Fragment `<>...</>`).
- Expressions in `{}`.

## Virtual DOM & Reconciliation
- React keeps a lightweight JS copy of the DOM (**virtual DOM**).
- On state change it builds a new VDOM, **diffs** it against the old one (reconciliation), and updates only what changed in the real DOM.
- **Keys** help React match list items between renders — use stable unique IDs, **never index** if the list reorders.

```jsx
{items.map((item) => <li key={item.id}>{item.name}</li>)}
```

## Components
- **Functional components** (modern, use hooks).
- **Class components** (legacy; know lifecycle for old codebases).

```jsx
function Welcome({ name }) {
  return <h1>Hello {name}</h1>;
}
```

## Props vs State
| | Props | State |
| --- | --- | --- |
| Mutable? | read-only (immutable) | mutable via setter |
| Owner | parent | the component itself |
| Purpose | configure child | track changing data |

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## State updates are async & batched
```jsx
setCount(count + 1);
setCount(count + 1); // both see same count → +1 only
// Use updater form to be safe:
setCount((c) => c + 1);
setCount((c) => c + 1); // +2
```

## Controlled vs Uncontrolled
- **Controlled** — form value driven by state (`value` + `onChange`). Preferred.
- **Uncontrolled** — DOM holds value, read via `ref`.

```jsx
// controlled
<input value={name} onChange={(e) => setName(e.target.value)} />
```

## Lifting state up & data flow
- Data flows **one way**: parent → child via props.
- Share state by moving it to the closest common parent.

## Class lifecycle → hooks mapping
| Class | Hook equivalent |
| --- | --- |
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [deps])` |
| `componentWillUnmount` | `useEffect` cleanup `return () => {}` |

---

## Common interview questions
1. **Why virtual DOM?** → minimize costly real-DOM operations via diffing.
2. **Why keys?** → stable identity for efficient list reconciliation.
3. **Props vs state?** → immutable input vs internal mutable data.
4. **Why is setState async?** → batching for performance; use updater fn for dependent updates.
5. **Controlled vs uncontrolled?** → state-driven vs DOM-driven inputs.
