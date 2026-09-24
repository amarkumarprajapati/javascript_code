# Array Basics

## What is an array?

An array is a **contiguous block of memory** that stores elements of the same type. In JavaScript, arrays can hold mixed types, but conceptually we think of them as homogeneous.

```
Index:    0   1   2   3   4
Array:  [10, 20, 30, 40, 50]
```

## Memory model

Arrays in most languages are stored **contiguously** in memory. This means:
- Index calculation is instant: `address = base_address + index * element_size`
- Random access is **O(1)**
- Inserting or deleting in the middle requires shifting elements — **O(n)**

## JavaScript arrays

JavaScript arrays are **dynamic arrays** backed by objects. They auto-resize, but the performance characteristics remain similar to fixed-size arrays for most operations.

```javascript
const arr = [1, 2, 3];
```

## Common operations and complexity

| Operation | Complexity | Description |
|-----------|-----------|-------------|
| `arr[i]` | O(1) | Access by index |
| `arr.push(x)` | O(1) amortized | Add to end |
| `arr.pop()` | O(1) | Remove from end |
| `arr.shift()` | O(n) | Remove from front (shifts all) |
| `arr.unshift(x)` | O(n) | Add to front (shifts all) |
| `arr.splice(i, 0, x)` | O(n) | Insert at index i |
| `arr.indexOf(x)` | O(n) | Linear search |
| `arr.includes(x)` | O(n) | Linear search |
| `arr.length` | O(1) | Size property |

## Iteration methods

### Classic for loop
```javascript
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

### for...of loop
```javascript
for (const item of arr) {
  console.log(item);
}
```

### forEach
```javascript
arr.forEach((item, index) => {
  console.log(item, index);
});
```

### for...in (avoid for arrays)
```javascript
// Works, but gives indices as strings and iterates inherited properties
for (const index in arr) {
  console.log(index, arr[index]);
}
```

## Multi-dimensional arrays

### 2D array (matrix)
```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
console.log(matrix[1][2]); // 6
```

### Iterate 2D array
```javascript
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(matrix[i][j]);
  }
}
```

## Array methods cheat sheet

```javascript
const arr = [3, 1, 4, 1, 5];

// Create/modify
arr.push(9);        // [3, 1, 4, 1, 5, 9]
arr.pop();          // [3, 1, 4, 1, 5]
arr.shift();        // [1, 4, 1, 5]
arr.unshift(0);     // [0, 3, 1, 4, 1, 5]
arr.splice(2, 0, 7); // [0, 3, 7, 1, 4, 1, 5]

// Search
arr.indexOf(4);     // 3
arr.lastIndexOf(1); // 5
arr.includes(7);    // true

// Transform
arr.slice(1, 4);    // [3, 7, 1] — does not modify original
arr.splice(1, 3);   // [3, 7, 1] — modifies original

// Combine
arr.concat([9, 9]); // [0, 3, 7, 1, 4, 1, 5, 9, 9]
arr.join('-');      // "0-3-7-1-4-1-5"

// Order
arr.sort((a, b) => a - b); // [0, 1, 1, 3, 4, 5, 7]
arr.reverse();      // [7, 5, 4, 3, 1, 1, 0]
```

## Edge cases to watch

```javascript
// Empty array
const empty = [];
empty.length; // 0

// Sparse array (holes)
const sparse = [1, , 3]; // index 1 is empty
sparse.length; // 3

// Array with undefined
const arr = [1, undefined, 3]; // index 1 has value undefined
```

## Practice

- LeetCode: 1. Two Sum
- LeetCode: 26. Remove Duplicates from Sorted Array
- LeetCode: 121. Best Time to Buy and Sell Stock
- LeetCode: 53. Maximum Subarray
- LeetCode: 238. Product of Array Except Self
