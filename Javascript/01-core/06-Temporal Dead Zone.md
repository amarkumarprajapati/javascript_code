# Temporal Dead Zone (TDZ)

## What is TDZ?

The **Temporal Dead Zone** is the period between when a `let` or `const` variable is hoisted and when it is actually declared/initialized. During this time, accessing the variable results in a `ReferenceError`.

## Key Points

- Only affects `let` and `const` declarations
- `var` declarations do **not** have a TDZ — they are hoisted with `undefined`
- The TDZ starts at the beginning of the scope and ends when the declaration is reached

## Example

```javascript
console.log(x); // undefined (hoisted, var)
console.log(y); // ReferenceError: Cannot access 'y' before initialization

var x = 10;
let y = 20;
```

## TDZ with Block Scope

```javascript
{
  // TDZ for 'a' starts here
  console.log(a); // ReferenceError
  // TDZ ends here
  let a = 5;
  console.log(a); // 5
}
```

## TDZ in Functions

```javascript
function test() {
  console.log(foo); // ReferenceError (TDZ)
  let foo = 'bar';
}
test();
```

## Temporal Dead Zone with `typeof`

```javascript
console.log(typeof undeclaredVar); // "undefined" — safe for truly undeclared variables

console.log(typeof tdzVar); // ReferenceError! TDZ affects typeof too
let tdzVar = 1;
```

> **Note:** `typeof` is normally safe for undeclared variables, but **not** during the TDZ.

## TDZ with Default Parameters

```javascript
function foo(arg = bar, bar) {
  console.log(arg, bar);
}
foo(); // ReferenceError: Cannot access 'bar' before initialization
```

Here `bar` is in TDZ when used as a default for `arg`.

## Why Does TDZ Exist?

- Prevents use of variables before declaration
- Makes it easier to catch bugs caused by hoisting
- Encourages cleaner, more predictable code

## Summary Table

| Declaration | Hoisted | Initial Value | Access Before Declaration |
|-------------|---------|---------------|---------------------------|
| `var`       | Yes     | `undefined`   | `undefined`               |
| `let`       | Yes     | TDZ           | `ReferenceError`          |
| `const`     | Yes     | TDZ           | `ReferenceError`          |

## Common Interview Questions

1. **What happens if you access a `let` variable before its declaration?**
   - `ReferenceError` due to TDZ.

2. **Does TDZ apply to `var`?**
   - No. `var` is hoisted and initialized with `undefined`.

3. **Can `typeof` be used safely in TDZ?**
   - No. It throws a `ReferenceError`.
