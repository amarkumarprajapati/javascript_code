# Control Flow & Loops



## Mental model — pick the right tool

```
                          NEED A LOOP?
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
       known count?         until cond?         iterate items?
            │                   │                   │
            ▼                   ▼                   ▼
          for             while / do-while       object keys?  → for...in
                                                 iterable val? → for...of
                                                 array, no break? → forEach / map
```

```
                          NEED A BRANCH?
                                │
                  ┌─────────────┼─────────────┐
                  ▼             ▼             ▼
            one cond?     two values?     many cases?
                  │             │             │
                  ▼             ▼             ▼
                 if         ternary         switch
                            (a?b:c)
```

---

## 1. Conditionals

### `if / else if / else`
```js
if (score >= 90)      grade = 'A';
else if (score >= 80) grade = 'B';
else                  grade = 'C';
```

### Ternary
```js
const sign = n > 0 ? 'pos' : n < 0 ? 'neg' : 'zero';
```

### `switch`
```js
switch (day) {
  case 'mon':
  case 'tue':                          // ← fall-through (intentional)
    console.log('weekday'); break;
  case 'sat':
  case 'sun':
    console.log('weekend'); break;
  default:
    console.log('unknown');
}
```
**Gotcha:** forgetting `break` causes accidental fall-through.

---

## 2. Loop reference table

| Loop | Iterates over | Can `break`? | Can `await`? | Best for |
|------|---------------|--------------|--------------|----------|
| `for` | counter | ✅ | ✅ | classic index loops |
| `while` | condition | ✅ | ✅ | unknown count |
| `do...while` | condition (runs ≥1) | ✅ | ✅ | "do then check" |
| `for...in` | **keys** of object | ✅ | ✅ | object properties |
| `for...of` | **values** of iterable | ✅ | ✅ | arrays, strings, Map, Set |
| `forEach` | array values | ❌ | ❌ (callback isn't awaited) | side-effect only |
| `map/filter/reduce` | array → new value | ❌ | ❌ | transform pipelines |

---

## 3. Each loop with example

### `for`
```js
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i]);
}
```

### `while`
```js
let i = 0;
while (i < 5) { console.log(i); i++; }
```

### `do...while` (runs at least once)
```js
let n;
do { n = Math.random(); } while (n < 0.9);
```

### `for...in` — **object keys**
```js
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  if (Object.hasOwn(obj, key)) console.log(key, obj[key]);
}
// ⚠️ also walks inherited enumerable props — that's why we hasOwn-check
// ⚠️ DON'T use on arrays — order not guaranteed, includes any added props
```

### `for...of` — **iterable values**
```js
for (const v of [10, 20, 30]) console.log(v);
for (const ch of 'hi')         console.log(ch);
for (const [k,v] of new Map([['a',1]])) console.log(k,v);
for (const v of new Set([1,2,3])) console.log(v);
```

### `forEach` — short but no break
```js
[1,2,3].forEach((v, i, arr) => console.log(i, v));
// no way to break — use for...of if you need to bail out early
```

---

## 4. `break`, `continue`, labels

```js
for (let i = 0; i < 10; i++) {
  if (i === 3) continue;   // skip this iteration
  if (i === 7) break;      // exit the loop
  console.log(i);          // 0,1,2,4,5,6
}

// labeled — for breaking outer loops
outer: for (let i=0;i<3;i++) {
  for (let j=0;j<3;j++) {
    if (j===2) break outer;
  }
}
```

---

## 5. Async loops — critical gotcha

```js
// ❌ forEach does NOT await
[1,2,3].forEach(async (id) => {
  await save(id);          // these all fire in parallel, no waiting
});

// ✅ for...of awaits each iteration (sequential)
for (const id of [1,2,3]) {
  await save(id);
}

// ✅ parallel + await all together
await Promise.all([1,2,3].map(id => save(id)));
```

---

## 6. Without the method — manual reduce

```js
// arr.reduce((acc, v) => acc + v, 0)  ← built-in

function reduce(arr, fn, init) {
  let acc = init, i = 0;
  if (acc === undefined) { acc = arr[0]; i = 1; }
  for (; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}
reduce([1,2,3,4], (a,v) => a+v, 0);  // 10
```

---

## Common interview questions

1. **`for...in` vs `for...of`?** → in = keys (object), of = values (iterable).
2. **Why doesn't `await` work inside `forEach`?** → forEach ignores the returned promise.
3. **`break` out of nested loops?** → use labels or refactor into a function with `return`.
4. **Best way to sum an array?** → `reduce` or a `for` loop; `forEach` works but mutates an outer var.
5. **`switch` without `break`?** → falls through to the next case (sometimes useful).
