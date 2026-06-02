# Deep Clone, Shallow Clone & Memoization

## Shallow vs Deep clone
- **Shallow** → top level copied, nested objects still **shared** by reference.
- **Deep** → fully independent copy at every level.

```js
const obj = { a: 1, nested: { b: 2 } };

const shallow = { ...obj };
shallow.nested.b = 99;
console.log(obj.nested.b); // 99 ← shared! (shallow)
```

## Deep clone options
```js
// 1. structuredClone (modern, built-in, best) — Node 17+ / browsers
const deep = structuredClone(obj);

// 2. JSON (quick but loses functions, undefined, Dates→string, Map/Set)
const deep2 = JSON.parse(JSON.stringify(obj));

// 3. Manual recursive (interview favorite — handles arrays/objects)
function deepClone(value) {
  if (value === null || typeof value !== "object") return value; // primitive
  if (Array.isArray(value)) return value.map(deepClone);
  if (value instanceof Date) return new Date(value);
  const result = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepClone(value[key]);
    }
  }
  return result;
}
```
> Mention `JSON` pitfalls: drops functions/undefined, breaks Dates/Map/Set, fails on circular refs. `structuredClone` handles circular refs but not functions.

## Memoization
Cache function results by their arguments → avoid recomputation.
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => { /* expensive */ return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(4); // computes
fastSquare(4); // from cache
```

### Memoized fibonacci
```js
const fib = memoize(function f(n) {
  return n < 2 ? n : f(n - 1) + f(n - 2);
});
fib(40); // fast
```

---

## Common interview questions
1. **Shallow vs deep clone?** → nested refs shared vs fully independent.
2. **Ways to deep clone + downsides?** → structuredClone, JSON (lossy), recursion.
3. **Implement memoize.** → closure + Map keyed by serialized args.
4. **JSON clone limitations?** → functions/undefined dropped, Dates→strings, no circular.
