// 01-stack-queue.js

class Stack {
  constructor() { this.items = []; }
  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

class Queue {
  constructor() { this.items = []; }
  enqueue(val) { this.items.push(val); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
}

class Deque {
  constructor() { this.items = []; }
  addFront(val) { this.items.unshift(val); }
  addRear(val) { this.items.push(val); }
  removeFront() { return this.items.shift(); }
  removeRear() { return this.items.pop(); }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop());

const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue());
