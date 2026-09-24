# Time & Space Complexity (Big O)

## Why analyze complexity?

When you compare two solutions, complexity tells you which one scales better as input grows. A solution that works for `n = 10` may fail for `n = 100000`.

## What is Big O?

Big O describes the **upper bound** of growth rate. It answers: *How does runtime or space grow as input size `n` increases?*

We ignore constants and smaller terms because they do not matter for large inputs.

## Common Complexities (best → worst)

| Complexity | Name           | Example |
|------------|----------------|---------|
| O(1)       | Constant       | Access array by index |
| O(log n)   | Logarithmic    | Binary search |
| O(n)       | Linear         | Loop through array once |
| O(n log n) | Linearithmic   | Merge sort, quick sort |
| O(n²)      | Quadratic      | Nested loops |
| O(2ⁿ)      | Exponential    | Recursive fibonacci |
| O(n!)      | Factorial      | Travelling salesman |

## Visual intuition

```
O(1)    ──────────────── (flat)
O(log n) ────────      (grows very slowly)
O(n)    ────────────   (straight line)
O(n²)   ─────────────── (curve, steep)
O(2ⁿ)   ──────────────────── (explodes)
```

## Time Complexity rules

1. **Drop constants**: O(2n) → O(n)
2. **Drop lower-order terms**: O(n² + n) → O(n²)
3. **Separate inputs**: O(a + b) for two different arrays

## JavaScript examples

### O(1) — Constant
```javascript
function getFirst(arr) {
  return arr[0];
}
```
No matter the array size, this takes the same time.

### O(n) — Linear
```javascript
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
```
We touch each element once.

### O(n²) — Quadratic
```javascript
function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
```
Nested loops multiply the work.

### O(log n) — Logarithmic
```javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```
We halve the search space each step.

## Space Complexity

| Source | Space |
|--------|-------|
| Primitive variables | O(1) |
| Arrays / objects created | O(n) |
| Recursive call stack | O(depth) |

### Examples
```javascript
// Space: O(1) — only one variable
function sum(arr) {
  let total = 0;
  for (const num of arr) total += num;
  return total;
}

// Space: O(n) — new array created
function doubleArray(arr) {
  return arr.map(x => x * 2);
}

// Space: O(n) — call stack depth
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

## How to analyze

1. Count the number of operations relative to input size
2. Identify the dominant term (the one that grows fastest)
3. Drop constants and lower-order terms
4. Separate space for auxiliary data vs input space

### Practice analysis

```javascript
// What is the Big O?
function mystery(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
    for (let j = 0; j < 100; j++) {
      console.log(j);
    }
  }
}
// Answer: O(n) — inner loop is constant (100), dropped
```

## Practice

- Calculate Big O for your own code
- LeetCode: 1. Two Sum
- LeetCode: 26. Remove Duplicates from Sorted Array
- LeetCode: 121. Best Time to Buy and Sell Stock
