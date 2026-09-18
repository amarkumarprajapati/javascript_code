# Fenwick Tree (Binary Indexed Tree — BIT)

Supports point updates and prefix sum queries in O(log n). Less memory than segment tree.

## Structure
For index `i`, it manages range `(i - lowbit(i) + 1)` to `i`.

## Implementation
```javascript
class FenwickTree {
  constructor(n) {
    this.n = n;
    this.tree = Array(n + 1).fill(0);
  }

  _lowbit(x) { return x & -x; }

  update(idx, delta) {
    while (idx <= this.n) {
      this.tree[idx] += delta;
      idx += this._lowbit(idx);
    }
  }

  query(idx) {
    let sum = 0;
    while (idx > 0) {
      sum += this.tree[idx];
      idx -= this._lowbit(idx);
    }
    return sum;
  }

  rangeQuery(l, r) { return this.query(r) - this.query(l - 1); }
}
```

## Use cases
- Prefix sum with updates
- Count of smaller numbers after self
- Inversion count

## Practice
- LeetCode: 307. Range Sum Query - Mutable
- LeetCode: 315. Count of Smaller Numbers After Self
- LeetCode: 1649. Create Sorted Array through Instructions
