# HEAP and Call Stack

## Definition
JavaScript uses a **memory model** with two main regions to manage execution:
- **Call Stack**: Tracks function execution and local variables.
- **HEAP**: Stores objects, closures, and dynamically allocated memory.

---

## Call Stack

### Definition
The Call Stack is a **LIFO (Last In, First Out)** data structure that keeps track of function calls. Every time a function is invoked, a **stack frame** is pushed onto the stack. When the function completes, the frame is popped off.

### How It Works
```js
function first() {
  console.log('First');
  second();
}

function second() {
  console.log('Second');
  third();
}

function third() {
  console.log('Third');
}

first();
```

**Stack execution order:**
1. `first()` pushed
2. `second()` pushed
3. `third()` pushed
4. `third()` popped
5. `second()` popped
6. `first()` popped

### Stack Overflow
- Occurs when the call stack exceeds its limit.
- Common cause: **infinite recursion**.
```js
function infiniteRecursion() {
  infiniteRecursion(); // RangeError: Maximum call stack size exceeded
}
```

---

## HEAP

### Definition
The HEAP is a large, unstructured region of memory used for **dynamic memory allocation**. Objects, arrays, and closures are stored here. Unlike the stack, the heap does not follow LIFO order.

### Characteristics
- **Unstructured**: No fixed order; memory is allocated as needed.
- **Slower access**: Requires pointer dereferencing.
- **Garbage collected**: JS engine automatically frees unused heap memory.

### Example
```js
let user = { name: 'Alice', age: 25 };
// The object { name: 'Alice', age: 25 } is stored in HEAP.
// The variable `user` (reference) is stored in the stack.
```

---

## Comparison

| Feature | Call Stack | HEAP |
|---------|-----------|------|
| Structure | LIFO | Unstructured |
| Stores | Primitives, references, function calls | Objects, arrays, closures |
| Size | Limited (causes overflow) | Larger, expandable |
| Speed | Fast | Slower |
| Management | Automatic (push/pop) | Garbage Collected |

---

## Visual Representation
```
Call Stack                    HEAP
+------------+               +------------------+
| third()    |               | { name: 'Alice' }|
+------------+               +------------------+
| second()   |               | [1, 2, 3, 4]     |
+------------+               +------------------+
| first()    |               | function() {...} |
+------------+               +------------------+
| main()     |
+------------+
```

## Key Takeaways
- The **stack** manages **where** the program is in execution.
- The **heap** manages **what data** the program is working with.
- Understanding this helps debug memory issues and optimize performance.
