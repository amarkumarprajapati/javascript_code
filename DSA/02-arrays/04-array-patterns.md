# Array Patterns

Arrays are the most common data structure in interviews. Master these patterns and you can solve most array problems.

## Pattern 1: Two Pointers

Use when: **sorted array** and you need a pair/triplet with a specific property.

### Two Sum (sorted array)
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

### Remove duplicates (in-place)
```javascript
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < arr.length; read++) {
    if (arr[read] !== arr[read - 1]) {
      arr[write++] = arr[read];
    }
  }
  return write;
}
```

### Squares of sorted array
```javascript
function sortedSquares(arr) {
  let left = 0, right = arr.length - 1;
  const result = [];
  while (left <= right) {
    const leftSq = arr[left] * arr[left];
    const rightSq = arr[right] * arr[right];
    if (leftSq > rightSq) {
      result.unshift(leftSq);
      left++;
    } else {
      result.unshift(rightSq);
      right--;
    }
  }
  return result;
}
```

## Pattern 2: Sliding Window

Use when: **subarray or substring** of fixed or variable size.

### Fixed size: maximum sum subarray of size k
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

### Variable size: longest substring without repeating characters
```javascript
function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

## Pattern 3: Prefix Sum

Use when: you need **range sums** or cumulative data answered in O(1).

### Build prefix array
```javascript
function buildPrefix(arr) {
  const prefix = [0];
  for (const num of arr) prefix.push(prefix[prefix.length - 1] + num);
  return prefix;
}

// Range sum from index left to right (inclusive)
function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left];
}
```

### Subarray sum equals k
```javascript
function subarraySum(nums, k) {
  const prefixCount = { 0: 1 };
  let prefix = 0, count = 0;
  for (const num of nums) {
    prefix += num;
    if (prefixCount[prefix - k]) count += prefixCount[prefix - k];
    prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
  }
  return count;
}
```

## Pattern 4: Fast & Slow Pointers (Floyd's Cycle)

Use when: **detecting cycles** in linked lists or arrays.

```javascript
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

## Pattern 5: In-place Modification

Use when: you need **O(1) extra space** and can overwrite the input.

### Move zeros to end
```javascript
function moveZeroes(arr) {
  let insertPos = 0;
  for (const num of arr) {
    if (num !== 0) arr[insertPos++] = num;
  }
  while (insertPos < arr.length) arr[insertPos++] = 0;
}
```

## Pattern 6: Modified Binary Search

Use when: array is **sorted but rotated** or you need boundary values.

```javascript
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}
```

## When to use which pattern

| Pattern | Best for |
|---------|----------|
| Two Pointers | Sorted arrays, pair/triplet search |
| Sliding Window | Subarray/substring of fixed or variable size |
| Prefix Sum | Range sum queries, cumulative data |
| Fast & Slow | Cycle detection |
| In-place | Space optimization |
| Modified Binary Search | Sorted/rotated arrays, boundaries |

## Practice

- LeetCode: 1. Two Sum
- LeetCode: 15. 3Sum
- LeetCode: 26. Remove Duplicates
- LeetCode: 53. Maximum Subarray
- LeetCode: 121. Best Time to Buy and Sell Stock
- LeetCode: 238. Product of Array Except Self
- LeetCode: 3. Longest Substring Without Repeating Characters
- LeetCode: 33. Search in Rotated Sorted Array
