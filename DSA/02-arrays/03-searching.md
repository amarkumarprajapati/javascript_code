# Searching

Searching is the process of finding a specific element in a data structure. The choice of algorithm depends on whether the data is sorted.

## Linear Search — O(n)

Check every element one by one. Works on **any** array.

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

**When to use:** Unsorted data, or data is too small to matter.

## Binary Search — O(log n)

Array **must be sorted**. Repeatedly divide the search interval in half.

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

**Visual walkthrough**

```
Search for 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]

Step 1: mid = 4 (value 16), 23 > 16 → search right half
Step 2: mid = 7 (value 56), 23 < 56 → search left half
Step 3: mid = 5 (value 23) → found!
```

## Binary search variations

### Find first occurrence
```javascript
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

### Find last occurrence
```javascript
function lastOccurrence(arr, target) {
  let left = 0, right = arr.length - 1, ans = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      ans = mid;
      left = mid + 1; // keep searching right
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return ans;
}
```

### Search insert position
```javascript
function searchInsert(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return left; // insert position
}
```

## Jump search — O(√n)

For sorted arrays, jump ahead in fixed steps, then linear search the block.

```javascript
function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  return arr[prev] === target ? prev : -1;
}
```

## Interpolation search — O(log log n) average

For uniformly distributed sorted data. Estimates position instead of always using midpoint.

```javascript
function interpolationSearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right && target >= arr[left] && target <= arr[right]) {
    const pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) left = pos + 1;
    else right = pos - 1;
  }
  return -1;
}
```

## Exponential search — O(log n)

Search in unbounded/infinite arrays, or when target is near the beginning.

```javascript
function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < arr.length && arr[i] <= target) i *= 2;
  let left = i / 2, right = Math.min(i, arr.length - 1);
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

## Choosing the right search

| Scenario | Algorithm |
|----------|-----------|
| Unsorted array | Linear search |
| Sorted array | Binary search |
| Sorted + uniform data | Interpolation search |
| Very large / unknown size | Exponential search |
| Small range integers | Counting sort + lookup |

## Practice

- LeetCode: 704. Binary Search
- LeetCode: 35. Search Insert Position
- LeetCode: 33. Search in Rotated Sorted Array
- LeetCode: 34. Find First and Last Position of Element
- LeetCode: 278. First Bad Version
- LeetCode: 162. Find Peak Element
