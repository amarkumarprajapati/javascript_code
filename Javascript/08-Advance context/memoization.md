# Memoization

## Definition
**Memoization** is an optimization technique where the results of expensive function calls are **cached** and returned when the same inputs occur again. It trades memory (space) for speed (time).

---

## How It Works
```
Input → Check Cache → [Hit] → Return cached result
              |
          [Miss]
              |
        Compute result → Store in Cache → Return result
```

---

## Basic Implementation

```js
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('Cache hit for', args);
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

---

## Fibonacci Example

### Without Memoization (Exponential Time)
```js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(40) takes seconds — recomputes same values repeatedly
```

### With Memoization (Linear Time)
```js
const memoFib = memoize(function(n) {
  if (n <= 1) return n;
  return memoFib(n - 1) + memoFib(n - 2);
});

// memoFib(40) is instant
```

### Using Closure
```js
function createMemoFib() {
  const cache = {};

  return function fib(n) {
    if (n in cache) return cache[n];
    if (n <= 1) return n;

    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  };
}

const fib = createMemoFib();
console.log(fib(50)); // Instant
```

---

## Real-World Example: Expensive API/Data Computation

```js
const getUserData = memoize(async function(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// First call hits the API
const user1 = await getUserData(42);

// Second call with same ID returns cached result
const user2 = await getUserData(42); // No API call!
```

---

## LRU (Least Recently Used) Cache

For production use, consider limiting cache size:

```js
function memoizeWithLimit(fn, limit = 100) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key); // Re-insert to mark as recently used
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);

    if (cache.size >= limit) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey); // Remove least recently used
    }

    cache.set(key, result);
    return result;
  };
}
```

---

## Comparison Table

| Aspect | Without Memoization | With Memoization |
|--------|--------------------|------------------|
| Time Complexity | Usually higher | Lower (amortized) |
| Space Complexity | Lower | Higher (cache storage) |
| Repeated Inputs | Recomputed | Cached result |
| Best For | Unique inputs | Repeated inputs |

---

## Key Takeaways
- Memoization is ideal for **pure functions** with repeated inputs.
- Be cautious with **memory usage** — unbounded caches can grow indefinitely.
- Always ensure **cache keys are deterministic** for the same inputs.
- Consider cache eviction strategies for long-running applications.
