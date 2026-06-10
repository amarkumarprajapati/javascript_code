# Heap Memory

## Definition
The **Heap** is a region of memory used for **dynamic allocation** in JavaScript. Unlike the stack (which is managed automatically via push/pop), the heap stores objects, arrays, closures, and other complex data structures whose size and lifetime cannot be determined at compile time.

---

## Characteristics of Heap Memory

| Feature | Description |
|---------|-------------|
| **Structure** | Unstructured, no fixed order |
| **Size** | Large and expandable (until system limit) |
| **Access** | Slower than stack (requires pointer dereferencing) |
| **Lifetime** | Managed by Garbage Collector |
| **Contents** | Objects, arrays, functions, closures, strings |

---

## What Gets Stored in the Heap?

```js
// Primitives → Stack (or inline in some engines)
let age = 25;
let name = 'Alice';

// Objects, Arrays, Functions → Heap
let user = { name: 'Alice', age: 25 };     // Object in heap
let items = [1, 2, 3, 4];                   // Array in heap
let greet = function() { console.log('Hi'); }; // Function in heap

// The VARIABLES (references) are on the stack
// The VALUES they point to are on the heap
```

---

## How Heap Allocation Works

```
Stack                        Heap
+-----------+               +------------------+
| user      | ----ref----> | { name: 'Alice' }|
| (ref)     |               +------------------+
+-----------+               +------------------+
| items     | ----ref----> | [1, 2, 3, 4]     |
| (ref)     |               +------------------+
+-----------+
```

1. JS engine allocates memory in the heap for an object.
2. A **reference** (pointer/address) to that memory is stored on the stack.
3. When the reference is lost, the heap memory becomes eligible for GC.

---

## Heap vs Stack

| Aspect | Stack | Heap |
|--------|-------|------|
| Data Type | Primitives, references, frames | Objects, arrays, closures |
| Size | Fixed, limited | Dynamic, larger |
| Speed | Fast | Slower |
| Management | Automatic (LIFO) | Garbage Collected |
| Access | Direct | Via reference |
| Scope | Function/block lifetime | Until garbage collected |

---

## Memory Layout in V8 Engine

V8 (Chrome, Node.js) divides heap memory into:

```
┌─────────────────────────────────────────┐
│            JS Heap                      │
├─────────────────────────────────────────┤
│  New Space (Young Generation)           │
│  ├─ From Space                         │
│  └─ To Space                             │
├─────────────────────────────────────────┤
│  Old Space (Old Generation)             │
│  ├─ Old Pointer Space                    │
│  ├─ Old Data Space                       │
│  └─ Large Object Space                   │
├─────────────────────────────────────────┤
│  Code Space                             │
│  Map Space                              │
└─────────────────────────────────────────┘
```

- **New Space**: Short-lived objects. Fast, frequent GC (Scavenge).
- **Old Space**: Long-lived objects. Slower, infrequent GC (Mark-Sweep-Compact).
- **Large Object Space**: Objects too big for other spaces.

---

## Heap Memory Example

```js
function createUser(name) {
  const user = { name, createdAt: new Date() };
  return user;
}

const u1 = createUser('Alice'); // Object allocated in heap
const u2 = createUser('Bob');   // Another object in heap

u1.friend = u2; // Heap object references another heap object
```

**Heap after execution:**
```
Heap:
┌──────────────┐     ┌──────────────┐
│ { name:      │────>│ { name:      │
│   'Alice',   │     │   'Bob',     │
│   friend     │     │   createdAt  │
│   ref }      │     │ }            │
└──────────────┘     └──────────────┘
```

---

## Heap Size Limits

### Browser
- Varies by browser and device.
- Typically ~1.4GB for 64-bit systems.

### Node.js
```bash
node --max-old-space-size=4096 app.js
# Increases heap limit to 4GB
```

---

## Key Takeaways
- The **heap** is where JS stores all objects and complex data.
- Variables on the **stack** hold **references** to heap data.
- Heap memory is managed by the **Garbage Collector**.
- Understanding heap vs stack helps diagnose memory issues.
