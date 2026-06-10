# Stack Memory

## Definition
The **Call Stack** is a region of memory that stores **execution context** for function calls. It is a **LIFO (Last In, First Out)** data structure where each entry (stack frame) represents a function call with its local variables and parameters.

---

## Characteristics of Stack Memory

| Feature | Description |
|---------|-------------|
| **Structure** | LIFO (Last In, First Out) |
| **Size** | Fixed and limited per thread |
| **Speed** | Very fast (simple push/pop) |
| **Management** | Automatic — compiler/VM handles it |
| **Contents** | Primitive values, references to heap objects, return addresses |

---

## What Gets Stored on the Stack?

```js
function greet(name) {
  const message = `Hello, ${name}`; // `message` stored on stack
  console.log(message);
}

function main() {
  const user = 'Alice';       // Primitive on stack
  greet(user);                // Call pushes new frame
}

main(); // Pushes `main` frame onto stack
```

**Execution flow:**
```
Step 1: main() called
  Stack: [ main frame ]

Step 2: greet('Alice') called
  Stack: [ main frame ][ greet frame ]

Step 3: greet returns
  Stack: [ main frame ]

Step 4: main returns
  Stack: [ empty ]
```

---

## Stack Frames

### Definition
A **stack frame** is a block of memory created for each function call. It contains:
- **Parameters** passed to the function
- **Local variables** declared inside the function
- **Return address** (where to continue after function completes)
- **Previous frame pointer** (to restore caller's context)

```
Stack Frame for greet('Alice'):
┌─────────────────┐
│ Return Address  │ → Where to go back in main()
├─────────────────┤
│ Parameter: name │ → 'Alice'
├─────────────────┤
│ Local: message  │ → 'Hello, Alice'
├─────────────────┤
│ Previous Frame  │ → Points to main's frame
└─────────────────┘
```

---

## Stack Overflow

### Definition
**Stack Overflow** occurs when the call stack exceeds its maximum size. This usually happens with **infinite recursion** or extremely deep recursion.

```js
function infiniteRecursion() {
  infiniteRecursion(); // Keeps pushing frames until stack is full
}

// RangeError: Maximum call stack size exceeded
```

### Recursive Function with Stack Overflow Risk
```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Each call adds a frame
}

factorial(100000); // May overflow on large inputs
```

### Fix: Tail Call Optimization (limited browser support)
```js
function factorial(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorial(n - 1, n * accumulator); // Tail position
}
```

---

## Stack vs Heap

| Aspect | Stack | Heap |
|--------|-------|------|
| Data | Primitives, references, frames | Objects, arrays, closures |
| Structure | LIFO | Unstructured |
| Size | Small, fixed | Large, dynamic |
| Speed | Very fast | Slower |
| Management | Automatic push/pop | Garbage Collected |
| Lifetime | Function execution | Until GC runs |

---

## Primitive vs Reference Types on Stack

```js
// Primitives: Value stored directly on stack
let a = 10;
let b = 'hello';
let c = true;

// Objects: Reference stored on stack, value in heap
let obj = { x: 1 };  // Stack: `obj` → ref | Heap: { x: 1 }
let arr = [1, 2, 3]; // Stack: `arr` → ref | Heap: [1, 2, 3]
```

---

## Visual: Stack and Heap Together
```
Call Stack                    Heap
+--------------+            +------------------+
| greet()      |            | { name: 'Alice' }|
|   name: ref  | ---------> +------------------+
|   message    |            | [1, 2, 3, 4, 5]  |
+--------------+            +------------------+
| main()       |
|   user: ref  | ---------> Same object in heap
+--------------+
```

---

## Key Takeaways
- The **stack** tracks **where** your program is in execution.
- Each function call creates a **stack frame**.
- The stack is **fast but limited** in size.
- **Stack overflow** happens from infinite or very deep recursion.
- Objects live in the **heap**; the stack only holds **references** to them.
