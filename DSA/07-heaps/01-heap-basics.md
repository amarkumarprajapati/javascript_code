# Heaps & Priority Queues

A Heap is a specialized tree-based data structure satisfying the heap property:
- **Min-Heap**: Parent $\le$ Children (Root is the minimum).
- **Max-Heap**: Parent $\ge$ Children (Root is the maximum).

Frequently stored in an array:
- Left child of index $i$: `2 * i + 1`
- Right child of index $i$: `2 * i + 2`
- Parent of index $i$: `Math.floor((i - 1) / 2)`

---

## Min-Heap Implementation in JavaScript

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(val) {
    this.heap.push(val);
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parent = this.getParentIndex(index);
      if (this.heap[parent] > this.heap[index]) {
        this.swap(parent, index);
        index = parent;
      } else {
        break;
      }
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return min;
  }

  bubbleDown() {
    let index = 0;
    const length = this.heap.length;

    while (this.getLeftChildIndex(index) < length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      let rightChildIndex = this.getRightChildIndex(index);

      if (rightChildIndex < length && this.heap[rightChildIndex] < this.heap[smallerChildIndex]) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[index] > this.heap[smallerChildIndex]) {
        this.swap(index, smallerChildIndex);
        index = smallerChildIndex;
      } else {
        break;
      }
    }
  }

  peek() { return this.heap[0] ?? null; }
  size() { return this.heap.length; }
}
```

## Practice Problems
- LeetCode 215: Kth Largest Element in an Array
- LeetCode 347: Top K Frequent Elements
- LeetCode 23: Merge k Sorted Lists
- LeetCode 295: Find Median from Data Stream
