# Stack & Queue

## Stack (LIFO — Last In First Out)
```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}
```

## Queue (FIFO — First In First Out)
```javascript
class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(val) { this.items.push(val); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}
```

## Deque (double-ended queue)
```javascript
class Deque {
  constructor() { this.items = []; }
  addFront(val) { this.items.unshift(val); }
  addRear(val) { this.items.push(val); }
  removeFront() { return this.items.shift(); }
  removeRear() { return this.items.pop(); }
}
```

## Use cases
- Stack: undo/redo, parentheses validation, DFS, expression evaluation
- Queue: BFS, task scheduling, printer queue

## Practice
- LeetCode: 20. Valid Parentheses
- LeetCode: 232. Implement Queue using Stacks
- LeetCode: 225. Implement Stack using Queues
- LeetCode: 150. Evaluate Reverse Polish Notation
