# Array Problems

Curated problems from easy to medium. Read the problem, try to solve it, then compare with the approach.

## Problem 1: Two Sum

**Difficulty:** Easy  
**Pattern:** Hash Map  
**Link:** LeetCode 1

Given an array and a target, return indices of two numbers that add up to target.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
```

**Time:** O(n), **Space:** O(n)

## Problem 2: Best Time to Buy and Sell Stock

**Difficulty:** Easy  
**Pattern:** One Pass / Sliding Window  
**Link:** LeetCode 121

Find the maximum profit from one buy and one sell.

```javascript
function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}
```

**Time:** O(n), **Space:** O(1)

## Problem 3: Contains Duplicate

**Difficulty:** Easy  
**Pattern:** Hash Set  
**Link:** LeetCode 217

Return true if any value appears at least twice.

```javascript
function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
```

**Time:** O(n), **Space:** O(n)

## Problem 4: Maximum Subarray

**Difficulty:** Medium  
**Pattern:** Kadane's Algorithm  
**Link:** LeetCode 53

Find the contiguous subarray with the largest sum.

```javascript
function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
```

**Time:** O(n), **Space:** O(1)

## Problem 5: Product of Array Except Self

**Difficulty:** Medium  
**Pattern:** Prefix & Suffix Products  
**Link:** LeetCode 238

Return an array where each element is the product of all other elements.

```javascript
function productExceptSelf(nums) {
  const result = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}
```

**Time:** O(n), **Space:** O(1) excluding output

## Problem 6: 3Sum

**Difficulty:** Medium  
**Pattern:** Sorting + Two Pointers  
**Link:** LeetCode 15

Find all unique triplets that sum to zero.

```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}
```

**Time:** O(n²), **Space:** O(1) excluding output

## Problem 7: Rotate Array

**Difficulty:** Medium  
**Pattern:** In-place / Reverse  
**Link:** LeetCode 189

Rotate the array to the right by k steps.

```javascript
function rotate(nums, k) {
  k %= nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(arr, left, right) {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}
```

**Time:** O(n), **Space:** O(1)

## Problem 8: Subarray Sum Equals K

**Difficulty:** Medium  
**Pattern:** Prefix Sum + Hash Map  
**Link:** LeetCode 560

Find the total number of subarrays whose sum equals k.

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

**Time:** O(n), **Space:** O(n)

## How to practice

1. Try solving without looking at the solution
2. Time yourself (aim for 20-30 minutes per medium problem)
3. Write brute force first, then optimize
4. Analyze time and space complexity after solving
5. Revisit problems after 1 week to reinforce patterns
