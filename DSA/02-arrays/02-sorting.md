# Sorting Algorithms

Sorting arranges elements in a specific order (usually ascending). It is a fundamental operation used in search, merge, and data processing.

## Complexity comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Built-in sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Depends |

**Stable sort**: Equal elements maintain their relative order after sorting.

## Bubble Sort

Repeatedly swap adjacent elements if they are in the wrong order.

```javascript
function bubbleSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // optimization: already sorted
  }
  return a;
}
```

**When to use:** Educational purposes only. Rarely used in practice.

## Selection Sort

Find the minimum element and swap it to the front. Repeat.

```javascript
function selectionSort(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}
```

**When to use:** Educational. Minimizes writes (useful in embedded systems).

## Insertion Sort

Build the sorted array one element at a time by inserting each element into its correct position.

```javascript
function insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j] < a[j - 1]) {
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      j--;
    }
  }
  return a;
}
```

**When to use:** Small arrays or nearly sorted data. O(n) best case.

## Merge Sort

Divide the array in half, recursively sort each half, then merge.

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

**When to use:** General purpose, stable sort needed, external sorting (data too big for memory).

## Quick Sort

Pick a pivot, partition elements into smaller/larger, recursively sort partitions.

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x <= pivot);
  const right = arr.slice(1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

**When to use:** General purpose, in-place sort needed, average O(n log n).

## JavaScript built-in sort

```javascript
const arr = [3, 1, 4, 1, 5];
arr.sort((a, b) => a - b); // [1, 1, 3, 4, 5]
```

In JavaScript, `Array.prototype.sort()` uses an optimized quicksort/mergesort hybrid (implementation dependent).

## Counting sort (bonus)

For integers in a small range, counting sort runs in O(n + k).

```javascript
function countingSort(arr, max) {
  const count = new Array(max + 1).fill(0);
  for (const num of arr) count[num]++;
  const result = [];
  for (let i = 0; i < count.length; i++) {
    while (count[i]--) result.push(i);
  }
  return result;
}
```

## Practice

- LeetCode: 912. Sort an Array
- LeetCode: 75. Sort Colors
- LeetCode: 56. Merge Intervals
- LeetCode: 215. Kth Largest Element in an Array
