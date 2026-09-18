# Segment Tree

Range queries and point updates in O(log n).

## Build
```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = Array(4 * this.n);
    this._build(arr, 0, 0, this.n - 1);
  }

  _build(arr, idx, l, r) {
    if (l === r) { this.tree[idx] = arr[l]; return; }
    const mid = Math.floor((l + r) / 2);
    this._build(arr, 2 * idx + 1, l, mid);
    this._build(arr, 2 * idx + 2, mid + 1, r);
    this.tree[idx] = this.tree[2 * idx + 1] + this.tree[2 * idx + 2];
  }

  query(qL, qR) { return this._query(0, 0, this.n - 1, qL, qR); }

  _query(idx, l, r, qL, qR) {
    if (qL > r || qR < l) return 0;
    if (qL <= l && r <= qR) return this.tree[idx];
    const mid = Math.floor((l + r) / 2);
    return this._query(2 * idx + 1, l, mid, qL, qR) + this._query(2 * idx + 2, mid + 1, r, qL, qR);
  }

  update(pos, val) { this._update(0, 0, this.n - 1, pos, val); }

  _update(idx, l, r, pos, val) {
    if (l === r) { this.tree[idx] = val; return; }
    const mid = Math.floor((l + r) / 2);
    if (pos <= mid) this._update(2 * idx + 1, l, mid, pos, val);
    else this._update(2 * idx + 2, mid + 1, r, pos, val);
    this.tree[idx] = this.tree[2 * idx + 1] + this.tree[2 * idx + 2];
  }
}
```

## Use cases
- Range sum / min / max queries
- Range updates (lazy propagation)
- Range modulo queries

## Practice
- LeetCode: 307. Range Sum Query - Mutable
- LeetCode: 315. Count of Smaller Numbers After Self
