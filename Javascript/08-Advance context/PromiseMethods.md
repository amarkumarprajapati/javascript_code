# Promise Methods

## Definition
`Promise` is an object representing the eventual completion or failure of an asynchronous operation. JavaScript provides several static methods to work with multiple Promises concurrently.

---

## `Promise.all()`

### Definition
Waits for **all** Promises to resolve. Returns a single Promise that resolves with an array of all resolved values. **Rejects immediately** if any Promise rejects.

### Syntax
```js
Promise.all([promise1, promise2, ...])
  .then(values => { /* all succeeded */ })
  .catch(error => { /* at least one failed */ });
```

### Example
```js
const p1 = fetch('/user');
const p2 = fetch('/posts');
const p3 = fetch('/comments');

Promise.all([p1, p2, p3])
  .then(responses => {
    console.log('All fetched:', responses);
  })
  .catch(error => {
    console.error('One failed:', error);
  });
```

### Use Case
- When you need **all** results before proceeding.
- **Fail-fast** behavior: one rejection stops everything.

---

## `Promise.allSettled()`

### Definition
Waits for **all** Promises to settle (resolve or reject). Returns an array of objects with `{status, value}` or `{status, reason}` for each Promise. **Never rejects**.

### Syntax
```js
Promise.allSettled([promise1, promise2, ...])
  .then(results => { /* inspect each result */ });
```

### Example
```js
const promises = [
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('another success')
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Value:', result.value);
      } else {
        console.log('Reason:', result.reason);
      }
    });
  });
```

### Use Case
- When you need results from **all** Promises regardless of individual failures.

---

## `Promise.race()`

### Definition
Returns a Promise that settles as soon as **any one** of the input Promises settles (resolves or rejects).

### Syntax
```js
Promise.race([promise1, promise2, ...])
  .then(value => { /* first one resolved */ })
  .catch(error => { /* first one rejected */ });
```

### Example
```js
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject('Timeout!'), 5000);
});

const fetchData = fetch('/api/data');

Promise.race([fetchData, timeout])
  .then(data => console.log('Data fetched'))
  .catch(err => console.error('Too slow'));
```

### Use Case
- Implementing **timeouts**.
- Responding to the fastest source.

---

## `Promise.any()`

### Definition
Returns a Promise that resolves when **any one** of the input Promises resolves. **Ignores rejections** unless all reject, in which case it rejects with an `AggregateError`.

### Syntax
```js
Promise.any([promise1, promise2, ...])
  .then(value => { /* first one resolved */ })
  .catch(error => { /* all rejected */ });
```

### Example
```js
const promises = [
  fetch('/mirror-1.com'),
  fetch('/mirror-2.com'),
  fetch('/mirror-3.com')
];

Promise.any(promises)
  .then(response => console.log('First mirror responded'))
  .catch(error => console.error('All mirrors failed'));
```

### Use Case
- Fetching from **multiple redundant sources**.

---

## Comparison Table

| Method | Resolves When | Rejects When | Behavior |
|--------|-------------|-------------|----------|
| `Promise.all` | All resolve | Any rejects | All or nothing |
| `Promise.allSettled` | All settle | Never | Inspect each result |
| `Promise.race` | First settles | First settles | Winner takes all |
| `Promise.any` | First resolves | All reject | Ignore rejections |

---

## `Promise.resolve()` and `Promise.reject()`

```js
// Creates an already resolved Promise
Promise.resolve(42).then(v => console.log(v)); // 42

// Creates an already rejected Promise
Promise.reject('Error').catch(e => console.error(e));
```

## Chaining
```js
fetch('/user')
  .then(res => res.json())
  .then(user => fetch(`/posts/${user.id}`))
  .then(res => res.json())
  .catch(err => console.error('Something went wrong'));
```
