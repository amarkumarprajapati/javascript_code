# Type Coercion & Equality

> 📅 **Day 5** · ~10 min read · prevents 90% of "WTF" bugs

## Mental model — coercion table

```
                    →  string         →  number        →  boolean
  ────────────────────────────────────────────────────────────────
  ""               │  ""              │  0             │  false   ◀ falsy
  "0"              │  "0"             │  0             │  true    ⚠
  "abc"            │  "abc"           │  NaN           │  true
  0                │  "0"             │  0             │  false   ◀ falsy
  1                │  "1"             │  1             │  true
  NaN              │  "NaN"           │  NaN           │  false   ◀ falsy
  null             │  "null"          │  0             │  false   ◀ falsy
  undefined        │  "undefined"     │  NaN           │  false   ◀ falsy
  []               │  ""              │  0             │  true    ⚠ truthy!
  [1]              │  "1"             │  1             │  true
  [1,2]            │  "1,2"           │  NaN           │  true
  {}               │  "[object …]"    │  NaN           │  true    ⚠ truthy!
```

## == vs === flow

```
  a == b ?
     │
     ├─ same type? ──── yes ──▶ same as ===
     │
     └─ different type:
            number ↔ string  → string → number
            boolean involved → boolean → number
            object ↔ primitive → object → primitive (valueOf / toString)
            null == undefined → true (special case)
            NaN == anything → false (even NaN)
```

**Rule:** always use `===` (no surprises). The only acceptable `==` is `x == null` (catches both `null` and `undefined`).

## Primitive types (7)
`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.
Everything else is an `object` (incl. arrays, functions).

```js
typeof "a"        // "string"
typeof 1          // "number"
typeof true       // "boolean"
typeof undefined  // "undefined"
typeof null       // "object"  ← famous bug, kept for legacy
typeof function(){} // "function"
typeof []         // "object"  → use Array.isArray([])
```

## == vs ===
- **`===`** strict equality — no type conversion. Compare type AND value.
- **`==`** loose equality — coerces types first.

```js
1 === "1"   // false
1 == "1"    // true  (string → number)
0 == false  // true
null == undefined // true
null === undefined // false
NaN === NaN // false (use Number.isNaN)
```
> **Rule for interviews:** always use `===` unless intentionally checking `null`/`undefined` together with `== null`.

## Truthy / Falsy
**Falsy values (only 8):** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
Everything else is truthy — including `"0"`, `"false"`, `[]`, `{}`.

```js
if ([])  // truthy! empty array is an object
if ({})  // truthy!
if ("0") // truthy! non-empty string
```

## Coercion examples (classic tricky outputs)
```js
[] + []        // ""        (both → "")
[] + {}        // "[object Object]"
1 + "2"        // "12"      (number → string)
"5" - 2        // 3         (string → number with -)
true + 1       // 2         (true → 1)
null + 1       // 1         (null → 0)
undefined + 1  // NaN
```

## Pass by value vs reference
- **Primitives** → passed/copied **by value**.
- **Objects/arrays** → passed **by reference** (the reference is copied).

```js
let a = 10; let b = a; b++;        // a=10, b=11 (independent)

let o1 = { n: 1 }; let o2 = o1; o2.n = 5;
console.log(o1.n); // 5 (same reference)
```

## Spread / destructuring (shallow copy)
```js
const copy = { ...obj };      // shallow — nested objects still shared
const arrCopy = [...arr];
const { name, age } = user;   // destructuring
const [first, ...rest] = arr;
```

---

## Common interview questions
1. **`==` vs `===`?** → loose coerces, strict doesn't. Prefer `===`.
2. **List falsy values.** → false, 0, -0, 0n, "", null, undefined, NaN.
3. **`typeof null`?** → "object" (legacy bug).
4. **Why `NaN === NaN` is false?** → IEEE spec; use `Number.isNaN`.
5. **Pass by value vs reference?** → primitives by value, objects by reference.
