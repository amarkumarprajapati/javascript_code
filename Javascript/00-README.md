# 📘 JavaScript Master Index

> One-stop map of this repo. Start here, then drill down.

---

## 🗺️ The Big Picture — How JS Works (end-to-end)

```
                                     ┌────────────────────────────┐
                                     │       YOUR .js FILE        │
                                     └─────────────┬──────────────┘
                                                   │
                          ┌────────────────────────▼────────────────────────┐
                          │              JS ENGINE (V8 / SpiderMonkey)      │
                          │                                                 │
                          │   ┌─────────────┐   ┌──────────────────────┐   │
                          │   │   Parser    │──▶│  AST (Abstract Tree) │   │
                          │   └─────────────┘   └──────────┬───────────┘   │
                          │                                │               │
                          │   ┌─────────────┐   ┌──────────▼───────────┐   │
                          │   │ Interpreter │◀──│      Bytecode        │   │
                          │   │  (Ignition) │   └──────────┬───────────┘   │
                          │   └──────┬──────┘              │               │
                          │          │ hot code            │               │
                          │   ┌──────▼──────┐              │               │
                          │   │  Compiler   │──▶  Optimized Machine Code   │
                          │   │ (TurboFan)  │                              │
                          │   └─────────────┘                              │
                          │                                                 │
                          │   Memory: ┌──────────┐   ┌──────────────────┐  │
                          │           │   Heap   │   │   Call Stack     │  │
                          │           │ (objects)│   │ (execution ctx)  │  │
                          │           └──────────┘   └──────────────────┘  │
                          └────────────────────────┬────────────────────────┘
                                                   │ async work
                          ┌────────────────────────▼────────────────────────┐
                          │           RUNTIME (Browser / Node.js)           │
                          │                                                 │
                          │   Web APIs / Node APIs    +    Event Loop       │
                          │   (timers, fetch, fs)          (micro+macro Q)  │
                          └─────────────────────────────────────────────────┘
```

**One-liner:** JS source → parsed to AST → bytecode → run on a single-threaded call stack. Slow/async work is offloaded to the runtime; the event loop feeds finished callbacks back when the stack is empty.

---

## 🛣️ Learning Roadmap

```
  ┌──────────────────┐
  │  1. Foundations  │  variables, types, operators, control flow, loops
  └────────┬─────────┘
           │
  ┌────────▼─────────┐
  │ 2. Core Concepts │  scope, hoisting, closures, this, prototypes, coercion
  └────────┬─────────┘   →  Javascript/01-core/
           │
  ┌────────▼─────────┐
  │ 3. Functions     │  declarations, expressions, arrow, IIFE, HOF, currying
  └────────┬─────────┘   →  Javascript/06-functions Type/
           │
  ┌────────▼─────────┐
  │ 4. Data Structs  │  Array, Object, Map, Set, WeakMap, WeakSet
  └────────┬─────────┘   →  Javascript/Array/
           │
  ┌────────▼─────────┐
  │ 5. Async         │  callbacks → promises → async/await → event loop
  └────────┬─────────┘   →  Javascript/02-async/
           │
  ┌────────▼─────────┐
  │ 6. OOP           │  classes, inheritance, prototypes, static, private
  └────────┬─────────┘   →  Javascript/05-theory/Objects.../
           │
  ┌────────▼─────────┐
  │ 7. Advanced      │  generators, iterators, Proxy, Reflect, Symbol, modules
  └────────┬─────────┘   →  Javascript/03-advanced/
           │
  ┌────────▼─────────┐
  │ 8. Browser/Node  │  DOM, events, storage, fetch, fs, streams
  └────────┬─────────┘   →  Javascript/05-theory/DOM.../
           │
  ┌────────▼─────────┐
  │ 9. Patterns/Perf │  debounce/throttle, memoize, deep clone, design patterns
  └────────┬─────────┘   →  Javascript/03-advanced/, 04-machine-coding/
           │
  ┌────────▼─────────┐
  │ 10. Interview    │  polyfills, machine coding, top questions
  └──────────────────┘   →  Javascript/04-machine-coding/, Top_100_*.md
```

---

## � 12-Day Reading Schedule (10–15 min/day)

> Every file in this list has a **`📅 Day X`** tag at the top — open the file, read it, you're done for the day.

| Day | File | Topic |
|-----|------|-------|
| 1   | `01-core/01-scope-hoisting.md` | Scope, hoisting, TDZ |
| 2   | `01-core/02-closures.md` | Closures + classic traps |
| 3   | `01-core/03-this-binding.md` | `this`, call/apply/bind |
| 4   | `01-core/04-prototypes.md` | Prototype chain, inheritance |
| 5   | `01-core/05-coercion-equality.md` | Coercion, `==` vs `===` |
| 6   | `02-async/01-event-loop.md` | Event loop, micro vs macro |
| 7   | `02-async/02-promises.md` | Promises, combinators |
| 8   | `02-async/03-async-await.md` | async/await |
| 9   | `03-advanced/01-currying.md` | Currying, partial application |
| 10  | `03-advanced/02-debounce-throttle.md` | Debounce vs throttle |
| 11  | `03-advanced/03-deep-clone-memoize.md` | Cloning + memoization |
| 12  | `06-functions Type/js_function_types.md` | All function flavours |
| 13  | `05-theory/Control Flow & Loops/loops.md` | if/switch + every loop |
| 14  | `05-theory/Error Handling/error-handling.md` | try/catch/finally, custom errors |
| 15  | `05-theory/DOM Manipulation/dom-manipulation.md` | select/modify/events/delegation |
| 16  | `05-theory/Browser APIs & Storage/browser-apis-storage.md` | localStorage, JSON, timers, fetch |
| 17  | `05-theory/Objects & Object-Oriented Programming/oop.md` | 4 pillars, classes, inheritance |
| 18  | `05-theory/Objects & Object-Oriented Programming/string-methods.md` | All String methods, grouped |
| Bonus | `00-complete-js-guide.md` | One-file overview to skim weekly |

After Day 18 → pick from the **Gap Analysis** below to keep going.

---

## 📂 What's In This Repo

### `01-core/` — Language internals
| File | Topic |
|------|-------|
| `01-scope-hoisting.md` | var/let/const, TDZ, hoisting |
| `02-closures.md` | Lexical env, closures, common uses |
| `03-this-binding.md` | `this` in methods, arrow, call/apply/bind |
| `04-prototypes.md` | Prototype chain, inheritance |
| `05-coercion-equality.md` | `==` vs `===`, type coercion rules |

### `02-async/` — Asynchronous JS
| File | Topic |
|------|-------|
| `01-event-loop.md` | Call stack, queues, micro vs macro |
| `02-promises.md` | Promise states, chaining, combinators |
| `03-async-await.md` | Syntax sugar over promises |

### `03-advanced/` — Functional patterns
| File | Topic |
|------|-------|
| `01-currying.md` | Partial application |
| `02-debounce-throttle.md` | Rate-limiting handlers |
| `03-deep-clone-memoize.md` | Caching + structured cloning |
| `debounce-throttle.js` | Runnable code |

### `04-machine-coding/` — Hands-on
| File | Topic |
|------|-------|
| `flatten-and-emitter.js` | Flatten N-d array + EventEmitter |
| `polyfills.js` | map/filter/reduce/bind polyfills |

### `05-theory/` — Topic-by-topic deep dives (.md)
- `Control Flow & Loops/loops.md` — Day 13
- `Error Handling/error-handling.md` — Day 14
- `DOM Manipulation/dom-manipulation.md` — Day 15
- `Browser APIs & Storage/browser-apis-storage.md` — Day 16
- `Objects & Object-Oriented Programming/oop.md` — Day 17
- `Objects & Object-Oriented Programming/string-methods.md` — Day 18

### `06-functions Type/`
- `js_function_types.md` — every function flavour

### `Array/` — Method playground (45+ scripts)
- **📋 `Array/INTERVIEW-QUESTIONS.md`** — 40 categorized problems (easy/medium/hard) with solutions
- **🧭 `Array/PATTERNS.md`** — 8-pattern DSA cheat sheet
- **Accessor Methods** — `at, concat, includes, indexOf, join, slice, toReversed, toSorted, toString`
- **Iteration Methods** — `entries, every, filter, find, findIndex, flat, flatMap, forEach, keys, map, reduce, some, values`
- **Mutator Methods** — `copyWithin, pop, push, ...`
- **Patterns** — duplicates, sort asc/desc, 3D→1D flatten, binary search
- **Interview** — `Interview1/2/3.js`

### Root
- `Top_100_JavaScript_Interview_Questions_Converted.md` — interview prep

---

## 🚨 Gap Analysis — Topics MISSING (recommend adding)

> Tick off as we build them.

### Foundations
- [ ] **Primitive vs Reference types** (`null`, `undefined`, `Symbol`, `BigInt`)
- [ ] **All operators table** (`??`, `?.`, `**`, spread/rest, comma)
- [ ] **Type checking** — `typeof`, `instanceof`, `Object.prototype.toString.call()`
- [ ] **Strict mode** (`'use strict'`) — what changes
- [ ] **Truthy / Falsy** cheat-sheet

### Control Flow
- [ ] `switch` deep dive + fall-through
- [ ] `for...in` vs `for...of` (when each fails)
- [ ] `break / continue / labels`

### Functions (extras)
- [ ] **IIFE** patterns
- [ ] **Recursion** + tail calls
- [ ] **Generators** (`function*`, `yield`, `yield*`)
- [ ] **Async generators** (`for await...of`)
- [ ] **Default / rest parameters** + destructuring in params

### Objects & OOP
- [ ] **`class` syntax** — constructor, static, getter/setter, `#private`, `extends`, `super`
- [ ] **Object methods** — `Object.keys/values/entries/assign/freeze/seal/create/fromEntries`
- [ ] **Property descriptors** — `defineProperty`, configurable/writable/enumerable
- [ ] **Optional chaining + nullish coalescing** real-world patterns

### Data Structures
- [ ] **`Map` & `Set`** — when to choose over Object/Array
- [ ] **`WeakMap` & `WeakSet`** — GC behaviour
- [ ] **Typed Arrays** — `Int8Array`, `Uint8Array`, `ArrayBuffer`
- [ ] **Iterables & Iterators** — the `Symbol.iterator` protocol

### Strings & Numbers & Dates
- [ ] **String methods** — full reference + template literals + tagged templates
- [ ] **Number** — `parseInt`, `parseFloat`, `Number.isNaN`, `toFixed`, precision pitfalls
- [ ] **Math** common methods
- [ ] **BigInt** — when to use
- [ ] **Date** — creating, formatting, `Intl.DateTimeFormat`
- [ ] **Regex** — basics, flags, common patterns

### Async (extras)
- [ ] **AbortController** + cancelling fetches
- [ ] **Promise.all / allSettled / race / any** with diagrams
- [ ] **Top-level await**
- [ ] **Microtask vs nextTick** (Node)

### Advanced
- [ ] **Modules** — ESM (`import/export`), CommonJS (`require`), dynamic `import()`
- [ ] **Symbols** + well-known symbols (`Symbol.iterator`, `Symbol.toPrimitive`)
- [ ] **Proxy & Reflect** — interception use cases
- [ ] **JSON** — parse/stringify, reviver/replacer
- [ ] **Error handling** — try/catch/finally, custom `Error` classes, `cause`
- [ ] **Garbage collection** — mark-and-sweep, memory leaks
- [ ] **Tail recursion / trampolining**

### Browser / Node
- [ ] **DOM** — selection, traversal, manipulation, events, delegation
- [ ] **Event** — bubbling, capturing, `stopPropagation`, `preventDefault`
- [ ] **Storage** — `localStorage`, `sessionStorage`, cookies, IndexedDB
- [ ] **Fetch API** — full options, streaming responses
- [ ] **WebSockets, SSE, Web Workers, Service Workers**
- [ ] **Node basics** — `fs`, `path`, `process`, `EventEmitter`, streams

### Patterns
- [ ] **Design patterns** — singleton, observer, factory, module, pub-sub
- [ ] **Functional patterns** — compose, pipe, partial, point-free
- [ ] **Immutability** — `Object.freeze`, structuredClone, immer-style

### Tooling / Real-world
- [ ] **Package.json basics** — scripts, deps, semver
- [ ] **ESLint / Prettier** — linting
- [ ] **Testing** — Jest/Vitest basics
- [ ] **TypeScript** — minimal type overlay

---

## 📚 How to Use This Repo

1. **New to JS?** Follow the roadmap top-down (Foundations → Interview).
2. **Looking up a method?** → `Array/` folder, grouped by category.
3. **Prepping for interview?** → `04-machine-coding/` + `Top_100_*.md` + `01-core/`.
4. **Need a concept refresh?** → `05-theory/` long-form notes.
5. **Want the full guide in one file?** → `00-complete-js-guide.md` *(coming next)*.

---

## 🧭 Conventions Used In Notes

- **ASCII diagram** at top of each topic for the mental model
- **Definition** in one sentence
- **Syntax / signature**
- **Code example** (runnable)
- **"Without the method" / polyfill** — manual implementation
- **When to use** + pitfalls
- **Common interview questions** at bottom
