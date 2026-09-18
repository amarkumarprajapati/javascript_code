# Sorting Algorithms

## Bubble Sort — O(n²)
```javascript
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}
```

## Selection Sort — O(n²)
```javascript
function selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
    }
    [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}
```

## Insertion Sort — O(n²)
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

## Merge Sort — O(n log n)
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

## Quick Sort — O(n log n) average
```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x <= pivot);
  const right = arr.slice(1).filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

## When to use what
- Small / nearly sorted: Insertion Sort
- General purpose: Quick Sort / Merge Sort
- Need stable sort: Merge Sort
- In-place: Quick Sort / Heap Sort

## Practice
- LeetCode: 912. Sort an Array
- LeetCode: 75. Sort Colors
- LeetCode: 56. Merge Intervals
