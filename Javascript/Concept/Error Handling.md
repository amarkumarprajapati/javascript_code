# Error Handling in JavaScript

## Definition
**Error Handling** is the process of catching, managing, and responding to runtime errors in a program. JavaScript provides built-in mechanisms (`try...catch`, `throw`, `finally`) to gracefully handle unexpected situations without crashing the application.

---

## Error Types in JavaScript

| Error Type | Description | Example |
|------------|-------------|---------|
| `Error` | Generic error | `new Error('Something went wrong')` |
| `SyntaxError` | Invalid syntax | `eval('1 ++ 2')` |
| `ReferenceError` | Undefined variable | `console.log(x)` |
| `TypeError` | Wrong type operation | `null.toString()` |
| `RangeError` | Out of range | `new Array(-1)` |
| `URIError` | Invalid URI encoding | `decodeURIComponent('%')` |

---

## `try...catch`

### Definition
The `try...catch` statement lets you test a block of code for errors and handle them in the `catch` block.

```js
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
}
```

### How It Works
1. Code in `try` block executes normally.
2. If an error occurs, execution jumps to `catch`.
3. The `catch` block receives the error object.
4. If no error, `catch` is skipped entirely.

---

## `finally` Block

### Definition
The `finally` block executes **regardless** of whether an error occurred. Useful for cleanup operations.

```js
try {
  const file = openFile('data.txt');
  processFile(file);
} catch (error) {
  console.error('Failed to process file:', error.message);
} finally {
  closeFile(file); // Always runs, even if error occurred
  console.log('Cleanup complete');
}
```

---

## `throw` Statement

### Definition
The `throw` statement lets you create and throw custom errors.

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (error) {
  console.error(error.name + ':', error.message);
  // Error: Cannot divide by zero
}
```

### Custom Error Classes
```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('email', 'Email is required');
  }
}

try {
  validateUser({ name: 'John' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(`${err.field}: ${err.message}`);
  }
}
```

---

## Error Object Properties

```js
try {
  throw new Error('Something broke');
} catch (error) {
  console.log(error.name);       // 'Error'
  console.log(error.message);    // 'Something broke'
  console.log(error.stack);      // Full stack trace
}
```

| Property | Description |
|----------|-------------|
| `name` | Error type name |
| `message` | Human-readable error description |
| `stack` | Stack trace at the point of error |

---

## Async Error Handling

### With Promises
```js
fetch('/api/data')
  .then(response => response.json())
  .catch(error => {
    console.error('Fetch failed:', error.message);
    return { default: true };
  });
```

### With Async/Await
```js
async function loadData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load data:', error.message);
    return null;
  }
}
```

### Unhandled Promise Rejections
```js
// Catches all unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});
```

---

## Global Error Handling

### `window.onerror` (Browser)
```js
window.onerror = function(message, source, lineno, colno, error) {
  console.error(`Error at ${source}:${lineno}:${colno}:`, message);
  return true; // Prevents default browser error handling
};
```

### `process.on('uncaughtException')` (Node.js)
```js
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Graceful shutdown
});
```

---

## Best Practices

1. **Don't swallow errors silently**
```js
// Bad
try { riskyOp(); } catch(e) { /* empty */ }

// Good
try {
  riskyOp();
} catch (error) {
  console.error('Operation failed:', error);
  showUserFriendlyMessage();
}
```

2. **Catch specific errors**
```js
try {
  JSON.parse(userInput);
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('Invalid JSON format');
  } else {
    throw error; // Re-throw unexpected errors
  }
}
```

3. **Always clean up in `finally`**
```js
let connection;
try {
  connection = await db.connect();
  await connection.query('SELECT * FROM users');
} finally {
  connection?.close(); // Always close, even on error
}
```

---

## Key Takeaways
- `try...catch` handles synchronous errors.
- `finally` runs cleanup code unconditionally.
- `throw` creates custom errors for your domain logic.
- Use `async/await` with `try...catch` for clean async error handling.
- Never silently swallow errors — always log or report them.
