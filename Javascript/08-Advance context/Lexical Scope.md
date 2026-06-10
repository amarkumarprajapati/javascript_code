# Lexical Scope

## Definition
**Lexical Scope** (also called Static Scope) means that the accessibility of variables is determined by the **physical placement** of functions and blocks in the source code at the time of writing. A function's scope chain is fixed at the point where the function is defined, not where it is called.

---

## How Lexical Scope Works
```js
const globalVar = 'I am global';

function outer() {
  const outerVar = 'I am outer';

  function inner() {
    const innerVar = 'I am inner';
    console.log(innerVar);  // Accessible
    console.log(outerVar);  // Accessible (from parent)
    console.log(globalVar); // Accessible (from global)
  }

  inner();
}

outer();
```

**Rule**: Inner functions have access to variables in their outer (enclosing) scopes.

---

## Scope Chain
The **Scope Chain** is the hierarchical chain of scopes that JavaScript traverses to resolve a variable.

```js
const a = 'global';

function first() {
  const b = 'first';

  function second() {
    const c = 'second';
    console.log(a); // global (goes up to global scope)
    console.log(b); // first (goes up to first scope)
    console.log(c); // second (found in current scope)
  }

  second();
}
```

**Lookup order**: Local → Parent → Global

---

## Lexical vs Dynamic Scope

| Lexical Scope (JS) | Dynamic Scope |
|--------------------|---------------|
| Scope determined at **write time** | Scope determined at **call time** |
| Function remembers its birthplace | Function looks at caller's scope |
| More predictable and debuggable | Less predictable |

```js
const x = 'global';

function foo() {
  console.log(x); // Lexical: looks at where foo is DEFINED
}

function bar() {
  const x = 'local';
  foo(); // Still prints 'global' because of lexical scope
}

bar();
```

---

## Practical Example: Closure & Lexical Scope
```js
function createCounter() {
  let count = 0; // Enclosed variable

  return function() {
    count++; // Accesses `count` from lexical parent
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

The returned function **remembers** `count` because of lexical scope.

---

## Key Takeaways
- Scope is determined by **where functions are written**, not called.
- Inner functions have access to outer scope variables.
- This enables **closures** — one of JS's most powerful features.
