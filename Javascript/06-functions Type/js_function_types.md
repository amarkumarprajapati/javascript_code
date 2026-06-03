# Types of Functions in JavaScript

> 📅 **Day 12** · ~10 min read · pick the right tool for each job

*A concise reference for JS developers*

## At a glance

```
                       ┌──────────────────────────────────────┐
                       │   ALL FUNCTIONS IN JAVASCRIPT        │
                       └──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
   BY SYNTAX                     BY BEHAVIOUR                  BY ROLE
   ─────────                     ───────────                   ───────
   Declaration   fn(){}           Sync         normal           Method (in obj/class)
   Expression    const f=fn(){}   Async        async fn(){}     Callback (passed to fn)
   Arrow         () => {}         Generator    function*(){}    Higher-order (returns/takes fn)
   Method        { fn(){} }       IIFE         (function(){})() Constructor (new Fn())
```

## Decision flow — "which kind do I use?"

```
   Need to call before declaration?       ──▶ Function Declaration
   Need own `this` / `arguments`?         ──▶ Regular function
   Short callback inside another fn?      ──▶ Arrow function
   Need to await something inside?        ──▶ async function
   Want a lazy/pausable sequence?         ──▶ Generator (function*)
   Run once, create isolated scope?       ──▶ IIFE
   Returns a fn, or takes one as arg?     ──▶ Higher-order
```

## 1. Function Declaration
Hoisted to the top of its scope — can be called before it's defined.

- ✓ Hoisted
- ✓ Own `this`

```js
function greet(name) {
  return 'Hello ' + name;
}
```

## 2. Function Expression
Assigned to a variable. Not hoisted — must be defined before use.

- ✗ Not hoisted
- ✓ Own `this`

```js
const greet = function(name) {
  return 'Hello ' + name;
};
```

## 3. Arrow Function
Shorter syntax. No own `this`, `arguments`, or `super`. Best for callbacks.

- ✗ Not hoisted
- ✗ No own `this`

```js
const greet = (name) => 'Hello ' + name;
```

## 4. Anonymous Function
A function without a name, commonly used inline as a callback.

Used inline — no name binding

```js
setTimeout(function() {
  console.log('runs after 1s');
}, 1000);
```

## 5. IIFE (Immediately Invoked Function Expression)
Runs immediately after definition. Creates its own isolated scope.

Useful for avoiding global scope pollution

```js
(function() {
  console.log('runs immediately');
})();
```

## 6. Higher-Order Function
Takes one or more functions as arguments, or returns a function.

Examples: `map`, `filter`, `reduce`

```js
const nums = [1, 2, 3];
nums.map(n => n * 2); // [2, 4, 6]
```

## 7. Callback Function
Passed as an argument to another function, called at a later time.

Foundation of async patterns in JS

```js
function doSomething(cb) {
  cb();
}

doSomething(() => console.log('called!'));
```

## 8. Recursive Function
Calls itself until a base condition is met. Used for trees, factorials, etc.

Always define a base case to prevent infinite loops

```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
```

## 9. Generator Function
Pauseable function using `yield`. Returns an iterator object.

Useful for lazy sequences and custom iterators

```js
function* counter() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = counter();
gen.next(); // { value: 1, done: false }
```

## 10. Async Function
Always returns a Promise. Use `await` inside to handle async operations.

- ✗ Not hoisted
- ✓ Own `this`
- Returns Promise

```js
const fetchData = async () => {
  const data = await fetch('https://api.example.com');
  return data.json();
};
```

## Quick Reference

| Type | Hoisted | Own this | Use Case |
|------|----------|----------|----------|
| Declaration | Yes | Yes | General purpose |
| Expression | No | Yes | Conditional definitions |
| Arrow | No | No | Callbacks, short logic |
| IIFE | No | Yes | Isolated scope |
| Generator | No | Yes | Lazy sequences |
| Async | No | Yes | API calls, async logic |
