# Common Problem Patterns

Mastering patterns allows you to solve dozens of unseen problems with the same core strategy.

---

## 1. Sliding Window
Used for contiguous subarrays or substrings satisfying a condition.
- **Fixed size**: Move window by adding next and removing leftmost.
- **Dynamic size**: Expand right pointer until invalid, shrink left pointer until valid again.

```javascript
// Longest substring without repeating characters
function lengthOfLongestSubstring(s) {
  let set = new Set();
  let left = 0, maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
```

---

## 2. Two Pointers
Used on sorted arrays or palindromes (opposite ends converging or same direction fast/slow).

```javascript
// Check palindrome
function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

---

## 3. Fast & Slow Pointers (Tortoise & Hare)
Used for cycle detection and finding middle elements in linked lists.

---

## 4. Modified Binary Search
Used when array is rotated, searching in infinite streams, or finding peak elements.

```javascript
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;

    // Left half sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else { // Right half sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
```

## Practice Problems
- LeetCode 3: Longest Substring Without Repeating Characters
- LeetCode 11: Container With Most Water
- LeetCode 33: Search in Rotated Sorted Array
- LeetCode 76: Minimum Window Substring
