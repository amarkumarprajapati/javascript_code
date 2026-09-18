# Linked Lists

A linear data structure where elements are not stored at contiguous memory locations. Instead, elements (nodes) are linked using pointers/references.

## 1. Singly Linked List
Each node contains `data` and a `next` pointer.

```javascript
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
  }

  // Insert at end — O(n) or O(1) with tail pointer
  append(val) {
    const newNode = new ListNode(val);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let curr = this.head;
    while (curr.next) {
      curr = curr.next;
    }
    curr.next = newNode;
  }

  // Insert at beginning — O(1)
  prepend(val) {
    const newNode = new ListNode(val, this.head);
    this.head = newNode;
  }

  // Delete node by value — O(n)
  delete(val) {
    if (!this.head) return;
    if (this.head.val === val) {
      this.head = this.head.next;
      return;
    }
    let curr = this.head;
    while (curr.next && curr.next.val !== val) {
      curr = curr.next;
    }
    if (curr.next) {
      curr.next = curr.next.next;
    }
  }
}
```

## 2. Doubly Linked List
Each node contains `data`, `next`, and `prev` pointers.

```javascript
class DoublyListNode {
  constructor(val, prev = null, next = null) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}
```

## 3. Essential Patterns & Algorithms

### Reverse a Linked List (Iterative) — O(n) Time, O(1) Space
```javascript
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}
```

### Fast & Slow Pointers (Floyd's Cycle Detection)
```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

## Practice Problems
- LeetCode 206: Reverse Linked List
- LeetCode 141: Linked List Cycle
- LeetCode 21: Merge Two Sorted Lists
- LeetCode 19: Remove Nth Node From End of List
- LeetCode 234: Palindrome Linked List
