# State Management

## Levels of state
1. **Local** — `useState`/`useReducer` inside a component.
2. **Shared (a few components)** — lift up + Context.
3. **Global app state** — Redux Toolkit / Zustand / Jotai.
4. **Server state** — React Query / SWR (caching, refetch, dedupe).

> Modern advice: use **React Query/SWR for server data** and a light global store only for true client state.

## Context API
Good for low-frequency global values (theme, auth user, locale).
```jsx
const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes />
    </AuthContext.Provider>
  );
}
const { user } = useContext(AuthContext);
```
> Downside: every consumer re-renders when the value changes. Split contexts or memoize value.

## Redux Toolkit (RTK) — modern Redux
Less boilerplate than classic Redux.
```jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";

const counter = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (s) => { s.value += 1; },      // Immer → "mutate" safely
    addBy: (s, action) => { s.value += action.payload; },
  },
});

export const { increment, addBy } = counter.actions;
const store = configureStore({ reducer: { counter: counter.reducer } });

// in component
const value = useSelector((state) => state.counter.value);
const dispatch = useDispatch();
dispatch(increment());
```

### Redux core concepts
- **Store** — single source of truth.
- **Action** — `{ type, payload }` describing what happened.
- **Reducer** — `(state, action) => newState`, pure function.
- **Dispatch** — send action to store.
- **Selector** — read slice of state.
- **Middleware (thunk)** — async logic (`createAsyncThunk`).

## Zustand (lightweight alternative)
```jsx
import { create } from "zustand";
const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
const count = useStore((s) => s.count);
```

---

## Common interview questions
1. **When Context vs Redux?** → Context for simple/low-frequency; Redux for complex, frequently-updated global state.
2. **Redux data flow?** → dispatch action → reducer → new state → UI re-renders via selector.
3. **Why RTK over classic Redux?** → less boilerplate, Immer, built-in thunk.
4. **Client vs server state?** → use React Query/SWR for server data.
5. **Context performance issue?** → all consumers re-render; split/memoize.
