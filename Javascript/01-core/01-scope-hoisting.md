# Scope & Hoisting

## 1. Execution Context
Every time JS runs code, it creates an **execution context** (EC):
- **Global EC** — created once, `this` = `window`/`globalThis`.
- **Function EC** — created on every function call.

Each EC has 2 phases:
1. **Creation (memory) phase** — variables/functions are allocated memory. `var` → `undefined`, function declarations → full function, `let`/`const` → uninitialized (TDZ).
2. **Execution phase** — code runs line by line, values assigned.

## 2. Hoisting
Hoisting = JS moves declarations to the top of their scope during the creation phase.

```js
console.log(a); // undefined  (var hoisted, initialized as undefined)
var a = 10;

greet();        // "hi" (function declaration fully hoisted)
function greet() { console.log("hi"); }

console.log(b); // ReferenceError (let is in TDZ)
let b = 5;
```

- **`var`** → hoisted + initialized as `undefined`.
- **`let` / `const`** → hoisted but NOT initialized → **Temporal Dead Zone (TDZ)** until the line runs.
- **function declarations** → fully hoisted (callable before definition).
- **function expressions / arrow fns** → follow their variable's rule.

## 3. Scope types
- **Global scope** — accessible everywhere.
- **Function scope** — `var` is function-scoped.
- **Block scope** — `let`/`const` live only inside `{ }`.

```js
function test() {
  if (true) {
    var x = 1;   // function scoped → visible below
    let y = 2;   // block scoped → only inside if
  }
  console.log(x); // 1
  console.log(y); // ReferenceError
}
```

## 4. var vs let vs const

| Feature | var | let | const |
| --- | --- | --- | --- |
| Scope | function | block | block |
| Hoisting | yes (undefined) | yes (TDZ) | yes (TDZ) |
| Re-declare | yes | no | no |
| Re-assign | yes | yes | no |

> `const` prevents re-assignment, NOT mutation. `const arr = []; arr.push(1)` is valid.

## 5. Scope chain
When a variable isn't found in the current scope, JS looks **up** the chain (lexical/static scope) until global, else `ReferenceError`.

---

## Common interview questions
1. **What is hoisting?** → Declarations moved to top during creation phase; `var`=undefined, `let/const`=TDZ.
2. **Why does `let` give ReferenceError before declaration?** → TDZ.
3. **Difference between function and block scope?** → `var` ignores blocks; `let/const` respect them.
4. **Output of a `var` inside a loop with setTimeout?** → all print the final value (classic closure trap, see closures notes).
