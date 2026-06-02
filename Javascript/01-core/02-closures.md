# Closures

## Definition
A **closure** is a function that remembers and accesses variables from its **lexical scope** even after the outer function has returned.

```js
function outer() {
  let count = 0;            // private variable
  return function inner() {
    count++;                // inner "closes over" count
    return count;
  };
}

const counter = outer();
counter(); // 1
counter(); // 2  → count is preserved between calls
```

## Why it works
`inner` keeps a reference to `outer`'s variable environment. Even after `outer()` returns, that environment is kept alive in memory because `inner` still needs it.

## The classic loop trap (very common question)
```js
// Problem: var is function-scoped → all callbacks share the SAME i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Fix 1: let (block-scoped → new binding each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// Fix 2: IIFE captures the current value
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i); // 0, 1, 2
}
```

## Real-world use cases (mention these in interviews)
1. **Data privacy / encapsulation** — private variables (module pattern).
2. **Function factories** — generate customized functions.
3. **Memoization / caching** — store results in a closed-over cache.
4. **Event handlers & callbacks** — retain state.
5. **Debounce / throttle** — store timer in closure.

### Module pattern (private state)
```js
const bankAccount = (() => {
  let balance = 0;                       // truly private
  return {
    deposit: (amt) => (balance += amt),
    getBalance: () => balance,
  };
})();

bankAccount.deposit(100);
bankAccount.getBalance(); // 100
// balance is not accessible from outside
```

### Function factory
```js
const multiplier = (factor) => (num) => num * factor;
const double = multiplier(2);
const triple = multiplier(3);
double(5); // 10
triple(5); // 15
```

---

## Common interview questions
1. **What is a closure?** → Function + its lexical environment retained after outer fn returns.
2. **Give a real use case.** → Private variables, debounce, memoization.
3. **Fix the `var` loop logging.** → use `let` or IIFE.
4. **Do closures cause memory leaks?** → Can, if you keep references to large objects unnecessarily. GC collects when no references remain.
