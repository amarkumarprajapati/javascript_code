# Full-Stack JavaScript Developer — 3-Month Interview Prep Roadmap

> For a developer with **3+ years experience** targeting a **mid/senior full-stack JS role** in **3 months**.
> Stack focus: **JavaScript, React, Node.js, Express, MongoDB (+ basic SQL), DSA, System Design.**
> TypeScript = learn later (after you land interviews).

You said you can't study daily — so this plan is **topic-based, not date-based**. Do one block whenever you get time, tick the box, move on. Each folder has its own `README.md` index telling you exactly what to study and in what order.

---

## How to use this repo

1. Start from **Phase 1** and go top to bottom.
2. Open the folder, read its `README.md` first (it's the index for that topic).
3. Read the notes → run the code examples → answer the interview Q&A out loud.
4. Tick the checkbox below when a topic feels interview-ready (you can explain it without notes).

---

## Folder map

| Folder | What it covers | Priority |
| --- | --- | --- |
| `Javascript/` | Core + advanced JS, machine coding | CRITICAL |
| `Theory/` | JS theory (OOP, event loop, DOM, async) | CRITICAL |
| `Frontend/react/` | React hooks, perf, patterns, Q&A | CRITICAL |
| `Backend/Node.js/` | Node internals, streams, cluster | HIGH |
| `Backend/Express/` | REST, middleware, auth, errors | HIGH |
| `Backend/MongoDB/` & `database/` | MongoDB + SQL, indexing, aggregation | HIGH |
| `Array/` & `String/` | DSA practice (you already have lots) | HIGH |
| `System design/` | HLD/LLD for mid-level | MEDIUM |
| `Frontend/Next.js/` | SSR/SSG (only if JD asks) | LOW |
| `TypeScript/` | Learn after interviews start | LATER |

---

## PHASE 1 — JavaScript Mastery (Weeks 1–3)

> 70% of MERN interviews are JavaScript + React. Nail this first.

### Core JS — `Javascript/01-core/`
- [ ] Execution context, hoisting, scope (global/function/block)
- [ ] `var` vs `let` vs `const` + Temporal Dead Zone
- [ ] Closures (most asked — know 3 real use cases)
- [ ] `this` keyword (all 4 binding rules) + arrow functions
- [ ] Prototypes & prototypal inheritance
- [ ] `call` / `apply` / `bind`
- [ ] Type coercion, `==` vs `===`, truthy/falsy
- [ ] Pass by value vs reference

### Async JS — `Javascript/02-async/`
- [ ] Event loop, call stack, task queue vs microtask queue
- [ ] Callbacks → Promises → async/await
- [ ] `Promise.all` / `race` / `allSettled` / `any`
- [ ] Error handling in async code
- [ ] `setTimeout` / `setInterval` gotchas

### Advanced JS — `Javascript/03-advanced/`
- [ ] Currying & partial application
- [ ] Debounce & throttle (write from scratch)
- [ ] Deep clone vs shallow clone
- [ ] Memoization
- [ ] Generators & iterators
- [ ] Modules (ESM vs CommonJS)
- [ ] Event delegation & bubbling/capturing

### Machine coding — `Javascript/04-machine-coding/`
- [ ] Polyfills: `map`, `filter`, `reduce`, `bind`, `Promise.all`
- [ ] Implement debounce/throttle
- [ ] Flatten nested array/object
- [ ] EventEmitter / pub-sub

---

## PHASE 2 — React (Weeks 3–5)

### React core — `Frontend/react/`
- [ ] JSX, virtual DOM, reconciliation, keys
- [ ] Components, props, state
- [ ] All hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`, `useReducer`
- [ ] Custom hooks (write 2–3)
- [ ] Lifecycle (class) vs hooks mapping
- [ ] Controlled vs uncontrolled components
- [ ] Lifting state up, prop drilling, Context API
- [ ] Performance: memo, useMemo, useCallback, lazy/Suspense
- [ ] State management (Redux Toolkit / Zustand basics)
- [ ] React Router basics

---

## PHASE 3 — Backend: Node + Express (Weeks 5–7)

### Node.js — `Backend/Node.js/`
- [ ] Event loop in Node (phases), libuv
- [ ] Streams & buffers
- [ ] `process`, `EventEmitter`, cluster/worker threads
- [ ] CommonJS vs ESM
- [ ] Error handling & process crashes

### Express — `Backend/Express/`
- [ ] Routing, middleware (order matters)
- [ ] Request/response lifecycle
- [ ] Error-handling middleware
- [ ] Auth: JWT, sessions, bcrypt, refresh tokens
- [ ] REST best practices, status codes
- [ ] Validation, rate limiting, CORS, helmet

---

## PHASE 4 — Databases (Weeks 7–9)

### MongoDB — `Backend/MongoDB/` & `database/`
- [ ] CRUD, query operators
- [ ] Aggregation pipeline (`$match`, `$group`, `$lookup`, `$project`)
- [ ] Indexing & performance
- [ ] Schema design / embedding vs referencing
- [ ] Transactions

### SQL — `database/SQL/`
- [ ] Joins (inner/left/right/full)
- [ ] GROUP BY, HAVING, aggregate functions
- [ ] Indexes, normalization
- [ ] ACID, transactions
- [ ] SQL vs NoSQL — when to use which

---

## PHASE 5 — DSA (ongoing, Weeks 1–10 in parallel)

> Do **2–3 problems on the days you study.** You already have a big `Array/` folder.
- [ ] Arrays & two pointers
- [ ] Strings & sliding window
- [ ] Hashing (maps/sets)
- [ ] Recursion & backtracking
- [ ] Sorting & searching (binary search)
- [ ] Linked lists, stacks, queues
- [ ] Trees & BFS/DFS basics
- [ ] Time/space complexity (Big-O)

See `Array/PATTERNS.md` for the pattern cheat sheet.

---

## PHASE 6 — System Design + Behavioral (Weeks 9–12)

### System design — `System design/`
- [ ] Scalability basics, load balancing, caching
- [ ] DB scaling (sharding, replication)
- [ ] REST vs GraphQL, microservices (you have notes)
- [ ] Design a URL shortener / rate limiter / chat app (LLD)

### Behavioral — `System design/BEHAVIORAL.md`
- [ ] STAR method answers
- [ ] "Tell me about yourself" (60-sec pitch)
- [ ] Conflict, failure, leadership stories
- [ ] Questions to ask the interviewer

---

## Weekly rhythm (when you do get time)

| Block | Focus |
| --- | --- |
| Block A | 1 theory topic + read notes |
| Block B | 2–3 DSA problems |
| Block C | 1 machine-coding / build task |
| Block D | Revise old notes + mock Q&A out loud |

---

## Final 2 weeks before interviews
- [ ] Revise all folder `README.md` indexes
- [ ] Mock interviews (Pramp / friend)
- [ ] Polish resume + GitHub
- [ ] Review JD-specific tech
- [ ] Prepare 3–4 project deep-dive stories

---

*This roadmap is the entry point. Each folder is being filled step by step — start with `Javascript/`.*
