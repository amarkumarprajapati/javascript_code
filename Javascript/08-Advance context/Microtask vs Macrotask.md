# Microtask vs Macrotask

## Definition
JavaScript's **Event Loop** handles asynchronous tasks by categorizing them into two queues:
- **Macrotasks** (or Tasks): Larger, discrete units of work.
- **Microtasks**: Smaller, high-priority tasks that run immediately after the current synchronous code.

---

## Macrotasks (Task Queue)

### Definition
Macrotasks represent the main chunks of asynchronous work. The Event Loop picks **one** macrotask per loop iteration to execute.

### Sources of Macrotasks
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- `requestAnimationFrame`
- I/O operations
- UI rendering

### Example
```js
console.log('Start');

setTimeout(() => {
  console.log('Macrotask: setTimeout');
}, 0);

console.log('End');
// Output: Start → End → Macrotask: setTimeout
```

---

## Microtasks

### Definition
Microtasks are short tasks that execute **immediately after the currently executing script**, but before the next macrotask. The Event Loop drains the entire microtask queue before moving to the next macrotask.

### Sources of Microtasks
- `Promise.then/catch/finally`
- `Promise.resolve/reject`
- `queueMicrotask()`
- `MutationObserver`
- `async/await` (because it uses Promises internally)

### Example
```js
console.log('Start');

setTimeout(() => console.log('Macrotask'), 0);

Promise.resolve().then(() => console.log('Microtask 1'));
Promise.resolve().then(() => console.log('Microtask 2'));

console.log('End');

// Output:
// Start
// End
// Microtask 1
// Microtask 2
// Macrotask
```

---

## Execution Order

### Event Loop Priority
```
1. Execute all synchronous code
2. Execute ALL microtasks (until queue is empty)
3. Execute ONE macrotask
4. Render UI (if needed)
5. Repeat from step 2
```

### Combined Example
```js
console.log('1: Sync');

setTimeout(() => console.log('2: Macrotask 1'), 0);
setTimeout(() => console.log('3: Macrotask 2'), 0);

Promise.resolve().then(() => console.log('4: Microtask 1'));
Promise.resolve().then(() => console.log('5: Microtask 2'));

console.log('6: Sync End');

// Output:
// 1: Sync
// 6: Sync End
// 4: Microtask 1
// 5: Microtask 2
// 2: Macrotask 1
// 3: Macrotask 2
```

---

## Why This Matters
- **Microtasks can starve macrotasks** if they recursively queue more microtasks.
- `Promise` callbacks run before `setTimeout` even with 0ms delay.
- Understanding this prevents bugs in async-heavy code.

---

## Quick Summary Table
| Feature | Macrotask | Microtask |
|---------|-----------|-----------|
| Priority | Lower | Higher |
| Executes | One per loop | All per loop |
| Sources | setTimeout, setInterval, I/O | Promise, queueMicrotask |
| Blocking | Can be delayed by microtasks | Runs immediately after sync code |
