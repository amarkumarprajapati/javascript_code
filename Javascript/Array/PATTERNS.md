# DSA Pattern Cheat Sheet (JS)

> You already have 60+ array problems here. This file is the **pattern map** — recognize the pattern, pick the tool. Master these 8 patterns and you cover most mid-level rounds.

## Big-O quick reference
| Structure / op | Time |
| --- | --- |
| Array access by index | O(1) |
| Array search (unsorted) | O(n) |
| Binary search (sorted) | O(log n) |
| Hash map get/set | O(1) avg |
| Sort | O(n log n) |
| Nested loops | O(n²) |

---

## 1. Two Pointers
Use on **sorted arrays** or pairs from both ends.
> Signs: "pair that sums to", "remove duplicates", "palindrome".
```js
function twoSumSorted(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const sum = arr[l] + arr[r];
    if (sum === target) return [l, r];
    sum < target ? l++ : r--;
  }
  return [];
}
```

## 2. Sliding Window
Contiguous subarray/substring with a condition.
> Signs: "longest/shortest substring", "max sum of k elements".
```js
function maxSubarraySum(arr, k) {
  let sum = 0, max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= k - 1) { max = Math.max(max, sum); sum -= arr[i - k + 1]; }
  }
  return max;
}
```

## 3. Hashing (Map/Set)
O(1) lookups → trade space for time.
> Signs: "has duplicate", "count frequency", "two sum (unsorted)".
```js
function twoSum(arr, target) {
  const seen = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (seen.has(target - arr[i])) return [seen.get(target - arr[i]), i];
    seen.set(arr[i], i);
  }
}
```

## 4. Binary Search
Sorted data; halve search space each step.
```js
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    arr[mid] < target ? (lo = mid + 1) : (hi = mid - 1);
  }
  return -1;
}
```

## 5. Recursion & Backtracking
> Signs: permutations, combinations, subsets, "all possible".
```js
function subsets(nums) {
  const res = [];
  function bt(start, path) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      bt(i + 1, path);
      path.pop(); // backtrack
    }
  }
  bt(0, []);
  return res;
}
```

## 6. Stack
> Signs: "valid parentheses", "next greater element", "monotonic".
```js
function isValidParens(s) {
  const stack = [], map = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch in map) { if (stack.pop() !== map[ch]) return false; }
    else stack.push(ch);
  }
  return stack.length === 0;
}
```

## 7. Linked List (two pointers / fast-slow)
> Signs: cycle detection, find middle, reverse.
```js
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

## 8. Trees / BFS & DFS
```js
// DFS (recursive)
function inorder(node, res = []) {
  if (!node) return res;
  inorder(node.left, res);
  res.push(node.val);
  inorder(node.right, res);
  return res;
}
// BFS (queue)
function bfs(root) {
  const q = [root], res = [];
  while (q.length) {
    const n = q.shift();
    res.push(n.val);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return res;
}
```

---

## Must-do problem list (do 2–3 per study session)
- [ ] Two Sum / Three Sum
- [ ] Best time to buy/sell stock
- [ ] Maximum subarray (Kadane's)
- [ ] Move zeroes / remove duplicates
- [ ] Valid anagram / group anagrams
- [ ] Longest substring without repeating chars
- [ ] Valid parentheses
- [ ] Merge intervals
- [ ] Binary search + rotated array search
- [ ] Reverse linked list / detect cycle
- [ ] Level order traversal (BFS)
- [ ] Fibonacci / climbing stairs (intro DP)

> JS tip: `arr.sort((a,b)=>a-b)` for numbers (default sort is lexicographic!).
