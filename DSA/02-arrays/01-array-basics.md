# Arrays

Contiguous block of memory. Fast access by index, slower insert/delete in middle.

## Basics

```javascript
// declaration
const arr = [1, 2, 3];
const arr2 = new Array(5); // [empty × 5]

// common operations
arr.push(4);      // add to end — O(1)
arr.pop();        // remove from end — O(1)
arr.unshift(0);   // add to front — O(n)
arr.shift();      // remove from front — O(n)
arr.splice(1, 0, 99); // insert at index — O(n)
arr.includes(2);  // search — O(n)
```

## Common Patterns

### Two pointers (sorted array)
```javascript
function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
```

### Sliding window
```javascript
function maxSumSubArray(arr, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

### Prefix sum
```javascript
function buildPrefix(arr) {
  const prefix = [0];
  for (const num of arr) prefix.push(prefix[prefix.length - 1] + num);
  return prefix;
}

function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left];
}
```

## Practice
- LeetCode: 1. Two Sum
- LeetCode: 26. Remove Duplicates from Sorted Array
- LeetCode: 121. Best Time to Buy and Sell Stock
- LeetCode: 53. Maximum Subarray
- LeetCode: 238. Product of Array Except Self
