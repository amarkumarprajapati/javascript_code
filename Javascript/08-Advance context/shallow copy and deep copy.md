# Shallow Copy and Deep Copy

## Definition
When copying objects in JavaScript, there are two fundamental approaches based on how nested data is handled:
- **Shallow Copy**: Duplicates the object's top-level properties. Nested objects are copied by **reference**.
- **Deep Copy**: Creates a fully independent duplicate. All nested objects are recursively copied by **value**.

---

## Shallow Copy

### Definition
A shallow copy creates a new object but copies nested objects by reference. Changes to nested properties in the copy will affect the original.

### Methods to Create Shallow Copies
```js
const original = { a: 1, b: { c: 2 } };

// 1. Spread operator
const copy1 = { ...original };

// 2. Object.assign()
const copy2 = Object.assign({}, original);

// 3. Array methods (for arrays)
const arrCopy = originalArray.slice();
const arrCopy2 = [...originalArray];
const arrCopy3 = Array.from(originalArray);
```

### Shallow Copy Demonstration
```js
const user = {
  name: 'Alice',
  details: { age: 25, city: 'NYC' }
};

const shallow = { ...user };

shallow.name = 'Bob';            // Original NOT affected (top-level)
shallow.details.age = 30;        // Original IS affected (nested!)

console.log(user.name);          // 'Alice' (unchanged)
console.log(user.details.age);   // 30 (changed!)
```

---

## Deep Copy

### Definition
A deep copy creates a completely independent clone. Nested objects are recursively duplicated, so changes to the copy never affect the original.

### Methods to Create Deep Copies

#### 1. `structuredClone()` (Recommended)
```js
const original = { a: 1, b: { c: 2 } };
const deep = structuredClone(original);

deep.b.c = 99;
console.log(original.b.c); // 2 (unchanged)
```

**Supported Types**: Objects, arrays, Dates, Maps, Sets, ArrayBuffers, and more.
**Limitations**: Cannot clone functions, DOM nodes, or prototype chains.

#### 2. JSON Method (Limited)
```js
const original = { a: 1, b: { c: 2 } };
const deep = JSON.parse(JSON.stringify(original));
```

**Limitations**:
- Loses functions, `undefined`, `Symbol`, `Date` objects, `Map`, `Set`
- Does not handle circular references
- Converts `NaN`, `Infinity`, `-Infinity` to `null`

#### 3. Manual Recursive Function
```js
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Map) {
    const cloned = new Map();
    obj.forEach((value, key) => cloned.set(key, deepClone(value)));
    return cloned;
  }
  if (obj instanceof Set) {
    const cloned = new Set();
    obj.forEach(value => cloned.add(deepClone(value)));
    return cloned;
  }
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}
```

---

## Comparison Table

| Aspect | Shallow Copy | Deep Copy |
|--------|-------------|-----------|
| Top-level properties | Copied by value | Copied by value |
| Nested objects | Copied by reference | Recursively copied by value |
| Performance | Faster | Slower |
| Memory usage | Less | More |
| Independence | Partial | Complete |
| Best for | Flat objects, immutable patterns | Complex nested structures |

---

## When to Use What?

### Use Shallow Copy When:
- The object is **flat** (no nested objects).
- You need **performance** over complete isolation.
- You are working with **immutable state patterns** (Redux, React setState).

### Use Deep Copy When:
- The object has **nested structures**.
- You need **complete independence** between original and copy.
- You are passing data to **external libraries** and want to prevent mutations.

---

## Quick Test
```js
const obj = { a: { b: { c: 1 } } };
const shallow = { ...obj };
const deep = structuredClone(obj);

shallow.a.b.c = 99;
deep.a.b.c = 42;

console.log(obj.a.b.c);       // 99 (affected by shallow)
console.log(deep.a.b.c);      // 42 (independent)
```

---

## Key Takeaways
- **Shallow copy**: Only the surface level is duplicated.
- **Deep copy**: Everything is recursively duplicated.
- Prefer `structuredClone()` for modern deep copying.
- Avoid `JSON.parse(JSON.stringify())` for complex objects.
