# Event Loop

JS is **single-threaded** but non-blocking thanks to the event loop.

## Pieces
- **Call Stack** — runs synchronous code (LIFO).
- **Web APIs / Node APIs** — handle async work (timers, fetch, fs, DB).
- **Callback (Task / Macrotask) Queue** — `setTimeout`, `setInterval`, I/O, DOM events.
- **Microtask Queue** — Promise `.then/.catch/.finally`, `queueMicrotask`, `MutationObserver`. **Higher priority.**
- **Event Loop** — when the call stack is empty, it drains **all microtasks first**, then **one macrotask**, repeat.

## Priority rule (key!)
After each macrotask, **the entire microtask queue is emptied** before the next macrotask.

## Classic output question
```js
console.log("1 start");

setTimeout(() => console.log("2 timeout"), 0);   // macrotask

Promise.resolve().then(() => console.log("3 promise")); // microtask

console.log("4 end");

// Output:
// 1 start
// 4 end
// 3 promise   ← microtask runs before timeout
// 2 timeout
```

## Harder one
```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
});
Promise.resolve().then(() => console.log("E"));
console.log("F");

// A, F, C, E, B, D
// sync: A, F
// microtasks: C, E   (C schedules timeout D)
// macrotasks: B, then D
```

## Node.js specifics
Node's loop has phases: **timers → pending → poll → check (setImmediate) → close**.
- `process.nextTick()` runs **before** other microtasks (even Promises).
- `setImmediate` vs `setTimeout(0)` order can vary, but inside an I/O callback `setImmediate` runs first.

```js
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));
// nextTick → promise
```

---

## Common interview questions
1. **What is the event loop?** → Mechanism that moves queued callbacks to the stack when it's empty, enabling async in a single thread.
2. **Microtask vs macrotask?** → Promises (micro) run before setTimeout (macro).
3. **`setTimeout(fn, 0)` runs immediately?** → No, after current sync + all microtasks.
4. **`process.nextTick` vs Promise?** → nextTick fires first in Node.
