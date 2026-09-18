# Time & Space Complexity (Big O)

## What is Big O?
It describes how runtime or space grows as input size `n` grows.

## Common Complexities (best → worst)

| Complexity | Name           | Example |
|------------|----------------|---------|
| O(1)       | Constant       | Access array by index |
| O(log n)   | Logarithmic    | Binary search |
| O(n)       | Linear         | Loop through array |
| O(n log n) | Linearithmic   | Merge sort, quick sort |
| O(n²)      | Quadratic      | Nested loops |
| O(2ⁿ)      | Exponential    | Recursive fibonacci |
| O(n!)      | Factorial      | Travelling salesman |

## JavaScript examples

```javascript
// O(1)
function getFirst(arr) {
  return arr[0];
}

// O(n)
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²)
function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
```

## Space Complexity
- Variables: O(1)
- Arrays/Objects created: O(n)
- Recursive call stack: O(depth)

```javascript
// Space: O(n) because new array is created
function doubleArray(arr) {
  return arr.map(x => x * 2);
}
```

## Rules of thumb
1. Drop constants: O(2n) → O(n)
2. Drop lower-order terms: O(n² + n) → O(n²)
3. Inputs are separate: O(a + b) for two arrays

## Practice
- Calculate Big O for your own code
- LeetCode: 1. Two Sum, 26. Remove Duplicates
