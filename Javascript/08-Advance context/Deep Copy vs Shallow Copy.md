# Deep Copy vs Shallow Copy

## Shallow Copy
- Copies only the **top-level** properties.
- Nested objects are copied by **reference**, not by value.
- Changes to nested objects affect both original and copy.

### Methods for Shallow Copy
```js
const original = { a: 1, b: { c: 2 } };

// 1. Spread operator
const copy1 = { ...original };

// 2. Object.assign
const copy2 = Object.assign({}, original);

// 3. Array methods (for arrays)
const arrCopy = originalArray.slice();
const arrCopy2 = [...originalArray];
```

### Shallow Copy Demo
```js
const obj = { name: 'John', details: { age: 30 } };
const shallow = { ...obj };

shallow.details.age = 40;
console.log(obj.details.age); // 40 (affected!)
```

## Deep Copy
- Creates a completely independent copy, including all nested objects.
- Changes to nested objects do **not** affect the original.

### Methods for Deep Copy
```js
const original = { a: 1, b: { c: 2 } };

// 1. Structured Clone (modern, recommended)
const deep1 = structuredClone(original);

// 2. JSON method (limited: no functions, dates, undefined, circular refs)
const deep2 = JSON.parse(JSON.stringify(original));

// 3. Manual recursive function
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
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

## Comparison Table
| Aspect | Shallow Copy | Deep Copy |
|--------|-------------|-----------|
| Top-level | Copied by value | Copied by value |
| Nested objects | Copied by reference | Copied by value |
| Performance | Faster | Slower |
| Memory | Less | More |

## When to Use What?
- **Shallow**: Flat objects, performance-critical code, immutable updates.
- **Deep**: Complex nested objects, need full independence.
