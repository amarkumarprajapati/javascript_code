# Memory Leaks in JavaScript

## Definition
A **Memory Leak** occurs when a program continues to hold references to memory that is no longer needed, preventing the garbage collector from reclaiming it. Over time, this causes the application to consume more and more memory, leading to slowdowns or crashes.

---

## Common Causes of Memory Leaks

### 1. Global Variables

#### Definition
Variables declared without `let`, `const`, or `var` become global properties and persist for the lifetime of the application.

```js
function processData() {
  data = 'huge string'; // Accidentally global!
}

// Fix: Always use let/const
function processData() {
  const data = 'huge string'; // Scoped, can be GC'd
}
```

---

### 2. Forgotten Event Listeners

#### Definition
DOM elements with attached event listeners stay in memory as long as the listener exists, even if the element is removed from the DOM.

```js
function setup() {
  const button = document.getElementById('btn');
  button.addEventListener('click', () => { /* ... */ });
}

// If button is removed from DOM but listener not cleaned:
// The detached DOM tree stays in memory!

// Fix: Remove listeners when done
button.removeEventListener('click', handler);
// Or use { once: true }
button.addEventListener('click', handler, { once: true });
```

---

### 3. Closures Holding Large Objects

#### Definition
A closure may unintentionally keep a large object alive even if only a small part is needed.

```js
function createProcessor() {
  const hugeData = new Array(1000000).fill('x');

  return {
    getLength() {
      return hugeData.length; // Keeps ENTIRE hugeData alive
    }
  };
}

// Fix: Only capture what you need
function createProcessor() {
  const hugeData = new Array(1000000).fill('x');
  const length = hugeData.length;

  return {
    getLength() {
      return length; // Only `length` is captured
    }
  };
}
```

---

### 4. Detached DOM Elements

#### Definition
JavaScript references to DOM nodes prevent them from being garbage collected even after removal from the document.

```js
const elements = [];

function processItems() {
  const items = document.querySelectorAll('.item');
  elements.push(...items); // Stored in global array!
}

// Even after removing from DOM, `elements` holds references
// Fix: Clear references when done
elements.length = 0;
```

---

### 5. Uncleared Timers and Intervals

#### Definition
`setInterval` and `setTimeout` hold references to their callback closures.

```js
const intervalId = setInterval(() => {
  console.log('Running...');
}, 1000);

// If you forget:
// clearInterval(intervalId);
// The callback and its closure stay in memory forever

// Fix: Always clear when done
function start() {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id); // Return cleanup function
}
```

---

### 6. Console Logs

#### Definition
Objects logged to the console are kept alive by DevTools until the console is cleared.

```js
const bigObject = { /* ...lots of data... */ };
console.log(bigObject);
// `bigObject` may be retained by DevTools

// Fix: Remove console.logs in production
```

---

## Detecting Memory Leaks

### Browser DevTools
1. **Memory Tab** → Take Heap Snapshots
2. Compare snapshots before/after suspected leak
3. Look for growing object counts or detached DOM trees

### Node.js
```js
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log(`Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
}, 5000);
```

---

## Prevention Checklist

- [ ] Always declare variables with `let`/`const`
- [ ] Remove event listeners when components are destroyed
- [ ] Clear intervals/timeouts when no longer needed
- [ ] Avoid storing DOM references unnecessarily
- [ ] Be careful with closures capturing large objects
- [ ] Remove console.logs in production builds
- [ ] Use `WeakMap`/`WeakSet` for cache-like structures

---

## Key Takeaways
- Memory leaks are caused by **unexpectedly reachable** objects.
- The garbage collector cannot free memory you still reference.
- Use DevTools to profile and identify leaks.
- Prevention is easier than fixing leaks in production.
