# Async/Await in JavaScript

## What is Async/Await?
- **Async/Await** is syntactic sugar over Promises, introduced in ES2017 (ES8).
- It makes asynchronous code look and behave like synchronous code.
- `async` declares a function that returns a Promise implicitly.
- `await` pauses execution until the Promise resolves, only inside `async` functions.

## Syntax
```js
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
```

## Key Rules
- `await` only works inside `async` functions.
- An `async` function **always returns a Promise**.
- If you return a non-promise value, it is wrapped in `Promise.resolve()`.
- If an error is thrown inside an `async` function, the returned Promise rejects.

## Error Handling
```js
async function getUser() {
  try {
    const res = await fetch('/user');
    const user = await res.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
}
```

## Parallel Execution with Promise.all
```js
async function fetchMultiple() {
  const [users, posts] = await Promise.all([
    fetch('/users'),
    fetch('/posts')
  ]);
}
```

## Common Mistakes
- Forgetting `await` before an async call.
- Using `await` in non-async functions (syntax error).
- Sequential awaiting when parallel is possible.

## Quick Summary
| Feature | Behavior |
|---------|----------|
| `async function` | Always returns a Promise |
| `await` | Pauses until Promise settles |
| Error inside async | Rejects the returned Promise |
