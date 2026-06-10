# Closures and Hoisting

---

## Closures

### Definition
A **Closure** is a function that **remembers** and can access variables from its **lexical scope** even when the function is executed outside that scope. In other words, a closure gives you access to an outer function's scope from an inner function.

### How It Works
```js
function outer() {
  const secret = 'I am hidden';

  function inner() {
    console.log(secret); // Accesses outer's variable
  }

  return inner;
}

const myFunc = outer();
myFunc(); // 'I am hidden' — closure preserves access to `secret`
```

### Key Characteristics
- The inner function retains access to the outer function's variables.
- Those variables are **not garbage collected** as long as the closure exists.
- Each call to the outer function creates a **new, independent closure**.

### Practical Example: Private Variables
```js
function createCounter() {
  let count = 0; // "Private" variable

  return {
    increment() { count++; },
    decrement() { count--; },
    getValue() { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getValue()); // 2
console.log(counter.count);      // undefined (not accessible)
```

### Common Pitfall: Loop Closures
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 (wrong!)
}

// Fix with IIFE or let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 (correct)
}
```

---

## Hoisting

### Definition
**Hoisting** is JavaScript's default behavior of moving **declarations** to the top of their containing scope (script or function) during the compilation phase. Only declarations are hoisted, not initializations.

### `var` Hoisting
```js
console.log(x); // undefined (not ReferenceError!)
var x = 5;

// JS interprets this as:
var x;        // declaration hoisted
console.log(x);
x = 5;        // initialization stays in place
```

### `function` Hoisting
```js
sayHello(); // Works! Function declarations are fully hoisted

function sayHello() {
  console.log('Hello!');
}
```

### `let` and `const` Hoisting (Temporal Dead Zone)
```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

console.log(z); // ReferenceError
const z = 20;
```

- `let` and `const` are technically hoisted but remain in a **Temporal Dead Zone (TDZ)** until their declaration is reached.

---

## Hoisting Comparison Table

| Declaration | Hoisted? | Initialized? | Scope |
|-------------|----------|--------------|-------|
| `var` | Yes | No (`undefined`) | Function |
| `let` | Yes (TDZ) | No | Block |
| `const` | Yes (TDZ) | No | Block |
| `function` | Yes | Yes | Function |
| `function expression` | Yes (var/let rules apply) | No | Depends on keyword |

---

## Function Declaration vs Expression

```js
// Declaration — fully hoisted
greet(); // Works
function greet() { console.log('Hi'); }

// Expression — NOT hoisted as a function
sayBye(); // TypeError: sayBye is not a function
var sayBye = function() { console.log('Bye'); };
// `var sayBye` is hoisted (undefined), assignment stays in place
```

---

## Key Takeaways
- **Closures** allow functions to "remember" their birth environment.
- **Hoisting** moves declarations, not initializations, to the top.
- Prefer `let`/`const` over `var` to avoid hoisting confusion.
