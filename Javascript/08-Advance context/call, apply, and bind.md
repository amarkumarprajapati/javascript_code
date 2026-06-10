# call, apply, and bind

## Definition
`call`, `apply`, and `bind` are methods on the `Function.prototype` that allow you to explicitly set the value of `this` when calling a function. They are essential for controlling function context.

---

## `call()`

### Definition
Invokes a function with a given `this` value and arguments provided **individually**.

### Syntax
```js
func.call(thisArg, arg1, arg2, ...)
```

### Example
```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };

greet.call(person, 'Hello', '!'); // 'Hello, Alice!'
```

### Common Use Case: Borrowing Methods
```js
const arr = Array.prototype.slice.call(arguments);
// Converts array-like objects to real arrays
```

---

## `apply()`

### Definition
Invokes a function with a given `this` value and arguments provided as an **array**.

### Syntax
```js
func.apply(thisArg, [arg1, arg2, ...])
```

### Example
```js
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Bob' };

greet.apply(person, ['Hi', '.']); // 'Hi, Bob.'
```

### Common Use Case: Spreading Arrays
```js
const numbers = [5, 2, 8, 1];
const max = Math.max.apply(null, numbers); // 8
// Modern equivalent: Math.max(...numbers)
```

---

## `bind()`

### Definition
Returns a **new function** with `this` permanently bound to the provided value. Does **not** invoke the function immediately.

### Syntax
```js
const boundFunc = func.bind(thisArg, arg1, arg2, ...)
```

### Example
```js
function greet() {
  console.log(`Hello, ${this.name}`);
}

const person = { name: 'Charlie' };
const greetCharlie = greet.bind(person);

greetCharlie(); // 'Hello, Charlie'
greetCharlie(); // 'Hello, Charlie' (always bound)
```

### Partial Application (Currying)
```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(5)); // 10
console.log(double(10)); // 20
```

---

## Comparison Table

| Method | Invokes Immediately? | Arguments Format | Returns |
|--------|---------------------|------------------|---------|
| `call` | Yes | Individual (`a, b, c`) | Function result |
| `apply` | Yes | Array `([a, b, c])` | Function result |
| `bind` | No | Individual (`a, b, c`) | New bound function |

---

## Practical Example: Event Listeners

```js
class Counter {
  constructor() {
    this.count = 0;
    // Without bind, `this` would be the button element
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}

const counter = new Counter();
document.querySelector('button').addEventListener('click', counter.increment);
```

## Modern Alternative: Arrow Functions
```js
class Counter {
  count = 0;

  // Arrow function auto-binds `this`
  increment = () => {
    this.count++;
    console.log(this.count);
  }
}
```

---

## Key Takeaways
- `call` and `apply` are for **one-time** context setting.
- `bind` creates a **permanently bound** function.
- All three are fundamental for method borrowing and context control.
