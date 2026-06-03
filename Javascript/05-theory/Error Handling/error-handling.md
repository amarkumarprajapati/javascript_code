# Error Handling

> 📅 **Day 14** · ~10 min read · robust code lives or dies here

## Mental model — try/catch/finally flow

```
                ┌────────────────┐
                │  try {  ... }  │
                └────────┬───────┘
                         │
              error? ────┼──── no
                ▼                ▼
        ┌────────────┐    (skip catch)
        │  catch(e)  │           │
        └─────┬──────┘           │
              │                  │
              └────────┬─────────┘
                       ▼
              ┌─────────────────┐
              │  finally { ... }│   ◀── ALWAYS runs (success, error, even return)
              └─────────────────┘
```

---

## Definition

An **error** in JS is a thrown value (usually an `Error` instance) that interrupts normal flow. `try/catch` lets you intercept it; `finally` runs cleanup either way.

## Built-in error types

```
Error                       generic
├─ TypeError                wrong type (null.foo, calling non-fn)
├─ ReferenceError           undeclared variable
├─ SyntaxError              parser failure (caught only by eval/JSON.parse)
├─ RangeError               value out of allowed range
├─ URIError                 bad encodeURI/decodeURI input
└─ AggregateError           multiple errors (Promise.any rejections)
```

---

## 1. Basic try / catch / finally

```js
function getJSON(str) {
  try {
    return JSON.parse(str);            // may throw SyntaxError
  } catch (err) {
    console.error('parse failed:', err.message);
    return null;
  } finally {
    console.log('attempted parse');    // runs regardless
  }
}
```

## 2. Throwing errors

```js
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  if (typeof a !== 'number') throw new TypeError('a must be number');
  return a / b;
}

// throw anything (but prefer Error so you get stack trace)
throw 'plain string';        // ❌ no stack
throw new Error('boom');     // ✅
```

## 3. Custom error classes

```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// usage
try {
  throw new HttpError(404, 'Not found');
} catch (e) {
  if (e instanceof HttpError) console.log(e.status, e.message);
  else throw e;                                  // rethrow unknown
}
```

## 4. Error cause chaining (ES2022)

```js
try {
  JSON.parse('bad json');
} catch (low) {
  throw new Error('Failed to load config', { cause: low });
}
// stack will show both errors
```

## 5. Async errors

```js
// promise
fetch('/api')
  .then(r => r.json())
  .catch(err => console.error(err))      // catches ANY error in the chain
  .finally(() => spinner.hide());

// async/await — use try/catch
async function load() {
  try {
    const res = await fetch('/api');
    if (!res.ok) throw new HttpError(res.status, res.statusText);
    return await res.json();
  } catch (e) {
    console.error('load failed:', e);
    throw e;                              // re-throw if caller should see it
  } finally {
    console.log('done');
  }
}
```

## 6. Global handlers (last line of defence)

```js
// Browser
window.addEventListener('error', (e) => console.error('Uncaught:', e.error));
window.addEventListener('unhandledrejection', (e) => console.error('Promise:', e.reason));

// Node
process.on('uncaughtException', (err) => { /* log + graceful shutdown */ });
process.on('unhandledRejection', (reason) => { /* log */ });
```

---

## ⚠️ Common pitfalls

| Pitfall | Why it bites |
|---------|--------------|
| `catch` swallows error silently | Always log or rethrow |
| Throwing strings/numbers | No stack trace, harder to debug |
| `try/catch` around async code without `await` | Promise rejects asynchronously — catch misses it |
| `finally` returning a value | Overrides the try/catch return! |
| Comparing errors by message | Brittle — use `instanceof` or `error.code` |

```js
// finally gotcha
function f() {
  try { return 1; }
  finally { return 2; }   // ⚠️ returns 2, not 1
}
```

---

## Pattern — Result type (avoid throw for expected errors)

```js
function parseJSON(str) {
  try { return { ok: true, value: JSON.parse(str) }; }
  catch (err) { return { ok: false, error: err }; }
}

const r = parseJSON(input);
if (r.ok) use(r.value); else handle(r.error);
```

---

## Common interview questions

1. **try/catch vs .catch?** → catch is for sync throws; `.catch` is for promise rejections.
2. **Can `finally` swallow a return?** → yes, if `finally` itself returns/throws.
3. **How to handle unhandled rejections?** → global `unhandledrejection` listener.
4. **Custom error best practice?** → `extends Error`, set `name`, attach context.
5. **Difference between throw and reject?** → throw is sync; `reject` is for promise APIs (or `throw` inside `async` = reject).
