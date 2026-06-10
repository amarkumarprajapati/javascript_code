# Garbage Collection in JavaScript

## Definition
**Garbage Collection (GC)** is the automatic process by which JavaScript engines reclaim memory that is no longer reachable or usable by the program. Unlike languages like C/C++, JavaScript does not require manual memory deallocation.

The primary algorithm used by modern JS engines is **Mark-and-Sweep**.

---

## How Garbage Collection Works

### 1. Mark-and-Sweep Algorithm
```
Step 1: MARK
  - Start from root objects (global object, stack variables, etc.).
  - Traverse all references and mark reachable objects as "alive".

Step 2: SWEEP
  - Scan the heap.
  - Any object not marked is considered garbage.
  - Free the memory occupied by garbage objects.
```

### Visual Representation
```
Roots → Object A → Object B
  |
  └── Object C (unreachable)

After GC: Object C is removed
```

---

## Reachability

### Definition
An object is **reachable** if it can be accessed via a chain of references starting from a root.

### Roots Include:
- Global variables (`window` / `global`)
- Local variables and parameters of currently executing functions
- Chained references from roots

### Example
```js
let user = { name: 'John' };
// Object is reachable via `user`

user = null;
// Object is now unreachable → eligible for GC
```

---

## Generational Garbage Collection

Modern JS engines (V8, SpiderMonkey) use a **Generational GC** strategy:

### Young Generation (New Space)
- Small, frequently cleaned area.
- Stores newly created objects.
- Uses **Scavenge** algorithm (fast, minor GC).
- Objects that survive multiple scavenges are promoted to Old Space.

### Old Generation (Old Space)
- Larger area for long-lived objects.
- Uses **Mark-Sweep-Compact** (slower, major GC).
- Runs less frequently but takes longer.

```
New Space (Small, Fast GC)
  → Object survives? → Promoted to Old Space

Old Space (Large, Slow GC)
  → Mark → Sweep → Compact
```

---

## Common Causes of Memory Retention

Even with GC, memory leaks happen when objects remain **unexpectedly reachable**:

### 1. Forgotten Global Variables
```js
function leak() {
  accidentallyGlobal = 'This is bad'; // No `let/const/var`
}
```

### 2. Closures Holding References
```js
function createHeavyData() {
  const hugeArray = new Array(1000000).fill('x');

  return function() {
    console.log('I only need this');
    // `hugeArray` is still reachable through closure
  };
}
```

### 3. Detached DOM Nodes
```js
const elements = document.querySelectorAll('.item');
// Even after removing from DOM, references in JS keep them alive
elements.forEach(el => el.remove());
// `elements` array still holds references!
```

### 4. Event Listeners
```js
element.addEventListener('click', handler);
// If element is removed but listener not removed,
// the element stays in memory
```

### 5. Interval/Timeout References
```js
const intervalId = setInterval(() => { /* ... */ }, 1000);
// Must call clearInterval(intervalId) when done
```

---

## WeakMap and WeakSet

### Definition
`WeakMap` and `WeakSet` hold **weak references** to their keys. If the only reference to an object is inside a WeakMap/WeakSet, it becomes eligible for garbage collection.

```js
let user = { name: 'Alice' };
const weakMap = new WeakMap();
weakMap.set(user, 'some data');

user = null;
// { name: 'Alice' } can now be garbage collected
// (even though weakMap still has a weak reference)
```

**Important**: Keys must be objects. WeakMaps are not iterable.

---

## Monitoring Memory

### In Browser DevTools
- **Performance tab**: Record memory allocation over time.
- **Memory tab**: Take heap snapshots to inspect objects.

### In Node.js
```js
console.log(process.memoryUsage());
// { rss, heapTotal, heapUsed, external, arrayBuffers }
```

---

## Key Takeaways
- GC is **automatic** but not magic — unreachable objects are removed.
- **Reachability** determines whether an object stays in memory.
- **Memory leaks** occur when you accidentally keep objects reachable.
- Use `WeakMap`/`WeakSet` when you don't want to prevent GC.
