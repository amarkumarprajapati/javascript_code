# async / await

> 📅 **Day 8** · ~10 min read · the modern way (built on Day 7's Promises)

Syntactic sugar over promises → write async code that reads like sync.

## How `await` actually works

```
  async function load() {
    console.log('A');
    const x = await fetch('/api');   ◀── PAUSE: function suspends here
    console.log('B');                     stack is free → event loop runs
    return x;                             other stuff
  }                                       ▼
                                          when fetch settles, microtask
                                          resumes load() and continues with 'B'
```

```
   Call stack ─▶ async fn runs sync code (A)
                 hits `await` ─▶ returns a pending promise
                                  the rest of the fn is scheduled as a microtask
   Call stack ─▶ EMPTY ─▶ other code runs
                                  ▼
                  network done ─▶ microtask queue: resume(load, value)
   Call stack ─▶ runs B + return
```

**Key point:** `await` doesn't block the thread — it suspends just the async function and lets the event loop continue.

## Basics
- `async` function **always returns a promise**.
- `await` pauses the function until the promise settles (only inside `async`).

```js
async function getUser() {
  return "Amar";          // wrapped → Promise.resolve("Amar")
}
getUser().then(console.log); // "Amar"

async function load() {
  const res = await fetch("/user");
  const user = await res.json();
  return user;
}
```

## Error handling — try/catch
```js
async function load() {
  try {
    const res = await fetch("/user");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error("Failed:", err.message);
    throw err; // re-throw if caller should handle
  } finally {
    console.log("done");
  }
}
```

## Sequential vs parallel (common mistake)
```js
// ❌ SLOW — runs one after another (sum of both times)
const a = await fetchA();
const b = await fetchB();

// ✅ FAST — run in parallel, await together
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

## Loops with await
```js
// Sequential (waits each iteration)
for (const id of ids) {
  await process(id);
}

// Parallel
await Promise.all(ids.map((id) => process(id)));
```
> `forEach` does NOT await — use `for...of` or `map + Promise.all`.

## Mixing
`await` works on any thenable, so you can await `Promise.all`, etc.

---

## Common interview questions
1. **What does an async function return?** → always a promise.
2. **How to handle errors?** → try/catch (or `.catch` on the returned promise).
3. **Run async tasks in parallel?** → `Promise.all` instead of sequential awaits.
4. **Why doesn't `await` work in `forEach`?** → callback isn't awaited; use `for...of`.
5. **Is async/await blocking?** → No, it yields control back to the event loop while waiting.
