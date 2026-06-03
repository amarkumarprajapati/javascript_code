# Promises

> 📅 **Day 7** · ~12 min read · prerequisite for async/await (Day 8)

A **Promise** is an object representing the eventual result of an async operation.

## State diagram

```
                ┌─────────────┐
                │   PENDING   │   ◀── initial state
                └──────┬──────┘
            resolve()  │  reject()
              ┌────────┴────────┐
              ▼                 ▼
       ┌─────────────┐   ┌─────────────┐
       │  FULFILLED  │   │  REJECTED   │
       │ (has value) │   │  (has err)  │
       └──────┬──────┘   └──────┬──────┘
              │                 │
            .then()           .catch()
              │                 │
              └────────┬────────┘
                       ▼
                    .finally()
```

**Key rule:** once settled (fulfilled OR rejected) → **immutable**. Cannot transition again.

## Chaining flow

```
  fetch(url)  ──▶ Promise<Response>
       .then(r => r.json())     ──▶ Promise<JSON>
       .then(data => render(data))   ──▶ Promise<void>
       .catch(err => log(err))   ◀── catches ANY error in the chain above
       .finally(() => spinner.hide())   ◀── always runs
```

## States (recap)
- **pending** → initial.
- **fulfilled** → resolved with a value.
- **rejected** → failed with a reason.

Once settled (fulfilled/rejected), it never changes.

## Creating & consuming
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});

p.then((val) => console.log(val))      // "done"
 .catch((err) => console.error(err))
 .finally(() => console.log("cleanup"));
```

## Chaining
Each `.then` returns a **new promise** → enables sequential async.
```js
fetch("/user")
  .then((res) => res.json())
  .then((user) => fetch(`/orders/${user.id}`))
  .then((res) => res.json())
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err)); // one catch handles the whole chain
```

## Combinators (know all 4)

| Method | Resolves when | Rejects when |
| --- | --- | --- |
| `Promise.all` | ALL fulfill (array of results) | ANY rejects (fail fast) |
| `Promise.allSettled` | ALL settle | never (gives status of each) |
| `Promise.race` | first to SETTLE (fulfill or reject) | first rejects |
| `Promise.any` | first to FULFILL | ALL reject (AggregateError) |

```js
const a = Promise.resolve(1);
const b = Promise.reject("err");
const c = Promise.resolve(3);

await Promise.all([a, c]);        // [1, 3]
await Promise.allSettled([a, b]); // [{status:"fulfilled",value:1},{status:"rejected",reason:"err"}]
await Promise.race([a, b]);       // 1 (whichever first)
await Promise.any([b, c]);        // 3 (first fulfilled)
```

## Common pitfalls
- **Forgetting `return`** in a `.then` breaks the chain.
- **Not handling rejection** → unhandled promise rejection.
- **`Promise.all` fails fast** — use `allSettled` if you want all results.

## Error handling
```js
Promise.reject(new Error("boom")).catch((e) => console.log(e.message)); // "boom"
```

## Build it yourself — `Promise.all` polyfill

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('array required'));
    const results = []; let done = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        val => {
          results[i] = val;                  // preserve order
          if (++done === promises.length) resolve(results);
        },
        reject                                // fail fast on any reject
      );
    });
  });
}
```

### `Promise.allSettled` polyfill
```js
function allSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p).then(
        value  => ({ status: 'fulfilled', value }),
        reason => ({ status: 'rejected',  reason })
      )
    )
  );
}
```

---

## Common interview questions
1. **Promise states?** → pending, fulfilled, rejected.
2. **all vs allSettled vs race vs any?** → see table above.
3. **What does `.then` return?** → a new promise (chaining).
4. **Callback hell — how do promises help?** → flatten nested callbacks into chains.
