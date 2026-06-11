# Currying & Partial Application



## Mental model

```
   Normal:                      Curried:
   ────────                     ────────
   add(1, 2, 3)                 add(1)(2)(3)
        │                            │
        ▼                            ▼
   ┌──────────┐                 ┌──────────┐
   │ add fn   │                 │ add(1)   │ ──▶ returns fn waiting for b
   │ a b c    │                 └────┬─────┘
   └──────────┘                      │ call with 2
                                     ▼
                                ┌──────────┐
                                │ add(2)   │ ──▶ returns fn waiting for c
                                └────┬─────┘
                                     │ call with 3
                                     ▼
                                    6
```

**Why?** Reuse partially-applied versions: `const addFive = add(5);` then `addFive(2)(3)` later.

## Currying
Transform a function with multiple args into a sequence of functions each taking **one** arg.

```js
// normal
const add = (a, b, c) => a + b + c;
add(1, 2, 3); // 6

// curried
const curryAdd = (a) => (b) => (c) => a + b + c;
curryAdd(1)(2)(3); // 6
```

## Why use it?
- Reusable, specialized functions.
- Function composition.
- Cleaner config (e.g., `multiply(2)` → a doubler).

```js
const multiply = (a) => (b) => a * b;
const double = multiply(2);
double(10); // 20
```

## Generic curry (infinite args) — common interview ask
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

const sum = (a, b, c) => a + b + c;
const cs = curry(sum);
cs(1)(2)(3);   // 6
cs(1, 2)(3);   // 6
cs(1)(2, 3);   // 6
```

## Partial application
Fix some args now, supply the rest later. (`bind` does this.)
```js
const greet = (greeting, name) => `${greeting}, ${name}`;
const hello = greet.bind(null, "Hello");
hello("Amar"); // "Hello, Amar"
```

---

## Common interview questions
1. **Currying vs partial application?** → Currying = one arg at a time; partial = fix some, call once with the rest.
2. **Write a generic curry.** → see above (`fn.length` is arity).
3. **Real use?** → reusable configured functions, composition.
