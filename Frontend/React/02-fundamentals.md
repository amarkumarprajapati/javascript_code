# React — Fundamentals

---

## Components

Building blocks of a React UI. Two types:

### Functional Components (modern)

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// Arrow function
const Welcome = ({ name }) => <h1>Hello, {name}</h1>;
```

### Class Components (legacy)

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Use functional components with hooks for all new code. Know class components for maintaining legacy codebases.

---

## JSX Rules

```jsx
// className not class
<div className="container">

// htmlFor not for
<label htmlFor="email">

// Self-closing tags
<img src="/logo.png" alt="Logo" />
<br />

// JavaScript expressions in {}
<p>{user.name.toUpperCase()}</p>
<p>{isLoggedIn ? "Welcome" : "Please login"}</p>

// Single root — use Fragment to avoid extra DOM node
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// Style as object (camelCase properties)
<div style={{ backgroundColor: "blue", fontSize: 16 }}>
```

---

## Props

Read-only inputs passed from parent to child.

```jsx
function UserCard({ name, age, avatar }) {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

<UserCard name="John" age={30} avatar="/john.jpg" />

// Default props
function Button({ label = "Click me", onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// Spread props
const props = { name: "John", age: 30 };
<UserCard {...props} />

// Children prop
function Card({ children, title }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

<Card title="Profile">
  <p>Content goes here</p>
</Card>
```

**Props are immutable** — never modify props inside a child.

---

## State

Internal data that changes over time. Triggers re-render when updated.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### State update rules

```jsx
// ❌ Stale closure — both see same count
setCount(count + 1);
setCount(count + 1); // result: +1 not +2

// ✅ Functional updater — always correct
setCount(c => c + 1);
setCount(c => c + 1); // result: +2

// State updates are async and batched
```

### Object state

```jsx
const [user, setUser] = useState({ name: "John", age: 30 });

// ❌ Mutating directly — won't re-render
user.age = 31;

// ✅ New object reference
setUser({ ...user, age: 31 });
setUser(prev => ({ ...prev, age: prev.age + 1 }));
```

---

## Props vs State

| | Props | State |
| --- | --- | --- |
| Source | Parent component | Component itself |
| Mutable? | Read-only | Mutable via setter |
| Triggers re-render? | When parent re-renders | When setter called |
| Use for | Configuration, data from parent | Internal changing data |

---

## Event Handling

```jsx
function Form() {
  const handleClick = (e) => {
    e.preventDefault(); // prevent default browser behavior
    console.log("Clicked");
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

React uses **SyntheticEvent** — a cross-browser wrapper around native events. Events are pooled in React 17 and earlier (not in React 18+).

```jsx
// Pass argument to handler
<button onClick={() => deleteItem(id)}>Delete</button>

// Or with bind
<button onClick={deleteItem.bind(null, id)}>Delete</button>
```

---

## Conditional Rendering

```jsx
// if/else
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) return <h1>Welcome back</h1>;
  return <h1>Please sign in</h1>;
}

// Ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// Logical AND
{error && <p className="error">{error}</p>}

// Switch via object/map
const views = {
  home: <Home />,
  profile: <Profile />,
  settings: <Settings />,
};
return views[currentView] ?? <NotFound />;
```

---

## Lists & Keys

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>×</button>
        </li>
      ))}
    </ul>
  );
}
```

**Key rules:**
- Must be unique among siblings
- Use stable IDs from data — not array index (unless list is static)
- Keys help React identify which items changed, added, or removed

---

## Controlled vs Uncontrolled Components

### Controlled — React state drives the value (preferred)

```jsx
function ControlledInput() {
  const [value, setValue] = useState("");
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
```

### Uncontrolled — DOM holds the value

```jsx
function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };

  return <input ref={inputRef} defaultValue="" />;
}
```

| Controlled | Uncontrolled |
| --- | --- |
| React state is source of truth | DOM is source of truth |
| Full control — validation, formatting | Simpler for basic forms |
| Required for dynamic behavior | Read value via ref on submit |

---

## Lifting State Up

When two siblings need shared state, move it to their closest common parent.

```jsx
function Parent() {
  const [temperature, setTemperature] = useState(20);

  return (
    <>
      <Celsius value={temperature} onChange={setTemperature} />
      <Fahrenheit value={temperature} onChange={setTemperature} />
    </>
  );
}

function Celsius({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}
```

---

## Composition vs Inheritance

React favors **composition** over inheritance.

```jsx
// Composition — pass components as props/children
function Dialog({ title, children }) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      <div className="body">{children}</div>
    </div>
  );
}

<Dialog title="Confirm">
  <p>Are you sure?</p>
  <button>Yes</button>
</Dialog>

// Specialization via props
function Button({ variant = "primary", children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}
```

---

## Forms

```jsx
function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Libraries:** React Hook Form (performance), Formik (full-featured).

---

## Class Component Lifecycle (Legacy)

| Phase | Method | Hook equivalent |
| --- | --- | --- |
| Mount | `componentDidMount` | `useEffect(fn, [])` |
| Update | `componentDidUpdate` | `useEffect(fn, [deps])` |
| Unmount | `componentWillUnmount` | `useEffect` cleanup |
| Error | `componentDidCatch` | Error Boundary (class only) |

```jsx
class Timer extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() { return <div>{this.state.count}</div>; }
}
```

---

## Prop Drilling

Passing props through many intermediate components that don't use them.

```
App → Layout → Sidebar → Nav → UserMenu → Avatar (needs user)
                              ↑
                    props passed through 4 levels
```

**Solutions:** Context API, state management library (Zustand/Redux), component composition.

---

## Quick Revision

```
Component     = function returning JSX
Props         = read-only input from parent
State         = internal mutable data (useState)
JSX           = HTML-like syntax → React.createElement
key           = stable list item identity
Controlled    = state drives input value
Uncontrolled  = DOM/ref holds value
Lift state    = move shared state to common parent
Composition   = pass children/components as props
Batching      = multiple setState → one re-render
```
