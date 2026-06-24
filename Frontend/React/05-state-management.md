# React — State Management

---

## Levels of State

| Level | Tool | Use case |
| --- | --- | --- |
| **Local** | `useState`, `useReducer` | Component-only data |
| **Shared (few components)** | Lift state + props | Siblings need same data |
| **Global client state** | Context, Zustand, Redux | App-wide UI state |
| **Server state** | React Query, SWR | API data, caching, sync |

> Modern advice: **React Query/SWR for server data** + light global store for true client state (theme, auth, cart).

---

## When to Use What

```
useState/useReducer  → form inputs, toggles, local UI state
Context              → theme, auth user, locale (low-frequency)
Zustand              → medium apps, simple global state
Redux Toolkit        → large apps, complex async flows, devtools
React Query/SWR      → all server/API data
```

---

## Context API

Built into React. Good for low-frequency global values.

```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
```

### Context performance issue

All consumers re-render when value changes. **Fixes:**

```jsx
// Split contexts
const UserContext = createContext();
const ActionsContext = createContext();

// Memoize value
const value = useMemo(() => ({ user, theme }), [user, theme]);

// Selective subscription with custom hook + useMemo
function useTheme() {
  const { theme } = useContext(AppContext);
  return theme;
}
```

---

## Zustand (Lightweight)

Minimal boilerplate, no providers, selective subscriptions.

```jsx
import { create } from "zustand";

const useStore = create((set, get) => ({
  count: 0,
  user: null,
  increment: () => set(s => ({ count: s.count + 1 })),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Selective subscription — only re-renders when count changes
function Counter() {
  const count = useStore(s => s.count);
  const increment = useStore(s => s.increment);
  return <button onClick={increment}>{count}</button>;
}
```

### With persistence

```jsx
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "app-storage" }
  )
);
```

---

## Redux Toolkit (RTK)

Modern Redux — less boilerplate, Immer for immutable updates, built-in thunk.

```jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);  // Immer allows "mutation"
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;

// Store
const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

// Provider
<Provider store={store}>
  <App />
</Provider>

// Component
function Cart() {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

### Async with createAsyncThunk

```jsx
export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("/api/users");
  return res.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### Redux core concepts

| Concept | Description |
| --- | --- |
| **Store** | Single source of truth |
| **Action** | `{ type, payload }` — describes what happened |
| **Reducer** | `(state, action) => newState` — pure function |
| **Dispatch** | Send action to store |
| **Selector** | Read slice of state |
| **Middleware** | Intercept actions (thunk for async) |

---

## React Query (TanStack Query)

Best for **server state** — caching, background refetch, deduplication.

```jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then(r => r.json()),
    staleTime: 5 * 60 * 1000, // fresh for 5 min
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser) =>
      fetch("/api/users", { method: "POST", body: JSON.stringify(newUser) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return <button onClick={() => mutation.mutate({ name: "John" })}>Add</button>;
}
```

---

## SWR (Alternative to React Query)

```jsx
import useSWR from "swr";

const fetcher = url => fetch(url).then(r => r.json());

function Profile() {
  const { data, error, isLoading, mutate } = useSWR("/api/user", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Failed to load</p>;
  return <div>{data.name}</div>;
}
```

---

## Lift State vs Global Store

| Lift state | Global store |
| --- | --- |
| 2–3 related components | Deeply nested or unrelated components |
| Simple shared data | Complex, frequently updated state |
| Easy to trace | Needs devtools for debugging |
| No extra dependencies | Adds library overhead |

**Approach:** Start local → lift when needed → global store only when lifting becomes impractical.

---

## Client State vs Server State

| Client state | Server state |
| --- | --- |
| UI toggles, form inputs, theme | API responses, database records |
| Lives in memory | Lives on server, cached locally |
| You own the source of truth | Server is source of truth |
| useState, Zustand, Redux | React Query, SWR |

Don't put API data in Redux/Zustand unless you need complex client-side transformations.

---

## Jotai / Recoil (Atomic State)

Fine-grained reactivity — components subscribe to individual atoms.

```jsx
import { atom, useAtom } from "jotai";

const countAtom = atom(0);
const doubleAtom = atom(get => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [double] = useAtom(doubleAtom);
  return (
    <>
      <p>{count} × 2 = {double}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </>
  );
}
```

---

## Quick Revision

```
useState/useReducer  → local component state
Context              → low-frequency global (theme, auth)
Zustand              → simple global state, no boilerplate
Redux Toolkit        → complex apps, async flows, devtools
React Query/SWR      → server state, caching, refetch
Lift state           → share between siblings via parent
Client vs server     → UI state vs API data — use different tools
```
