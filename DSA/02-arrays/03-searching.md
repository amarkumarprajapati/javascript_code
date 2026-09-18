# Searching

## Linear Search — O(n)
```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

## Binary Search — O(log n)
Array must be sorted.

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

### Binary search variations
```javascript
// Find first occurrence
function firstOccurrence(arr, target) {
  let left = 0, right = arr.length - 1, ans = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      ans = mid;
      right = mid - 1; // keep searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return ans;
}
```

## Practice
- LeetCode: 704. Binary Search
- LeetCode: 35. Search Insert Position
- LeetCode: 33. Search in Rotated Sorted Array
- LeetCode: 34. Find First and Last Position of Element
