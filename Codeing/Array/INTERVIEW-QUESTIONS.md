# Array Interview Questions — Categorized

> 📅 **Day 19+** · pick 2–3 per session · companion to `PATTERNS.md`

> **How to use:** read the problem → try yourself for 10 min → check the approach → study the code. The **pattern tag** tells you which technique applies.

## Difficulty key
- 🟢 Easy — basics, single pass / one method
- 🟡 Medium — pattern recognition needed
- 🔴 Hard — multiple patterns / tricky edge cases

---

## 📑 Index

| # | Question | Difficulty | Pattern |
|---|----------|-----------|---------|
| 1  | Reverse an array | 🟢 | Two pointers |
| 2  | Find max / min | 🟢 | Linear scan |
| 3  | Sum of all elements | 🟢 | Reduce |
| 4  | Remove duplicates | 🟢 | Set / Hash |
| 5  | Check if sorted | 🟢 | Linear scan |
| 6  | Rotate array by K | 🟡 | Reverse trick |
| 7  | Two Sum (unsorted) | 🟢 | Hash map |
| 8  | Two Sum (sorted) | 🟢 | Two pointers |
| 9  | Three Sum | 🟡 | Sort + 2-ptr |
| 10 | Maximum subarray sum (Kadane) | 🟡 | DP |
| 11 | Best time to buy/sell stock | 🟡 | One pass + min |
| 12 | Move zeroes to end | 🟢 | Two pointers |
| 13 | Contains duplicate | 🟢 | Set |
| 14 | Find missing number (1..N) | 🟢 | Math / XOR |
| 15 | Find duplicate number | 🟡 | Floyd / Hash |
| 16 | Single number (rest twice) | 🟡 | XOR |
| 17 | Merge two sorted arrays | 🟢 | Two pointers |
| 18 | Merge intervals | 🟡 | Sort + sweep |
| 19 | Product of array except self | 🟡 | Prefix/suffix |
| 20 | Container with most water | 🟡 | Two pointers |
| 21 | Trapping rain water | 🔴 | Two pointers / stack |
| 22 | Subarray sum equals K | 🟡 | Prefix sum + hash |
| 23 | Longest consecutive sequence | 🟡 | Hash set |
| 24 | Majority element | 🟢 | Boyer-Moore |
| 25 | Find peak element | 🟡 | Binary search |
| 26 | Search in rotated sorted array | 🟡 | Modified binary search |
| 27 | Find first & last position | 🟡 | Binary search |
| 28 | Kth largest element | 🟡 | Heap / quickselect |
| 29 | Top K frequent elements | 🟡 | Hash + heap/bucket |
| 30 | Group anagrams | 🟡 | Hash by sorted key |
| 31 | Spiral matrix | 🟡 | Layer simulation |
| 32 | Rotate matrix 90° | 🟡 | Transpose + reverse |
| 33 | Set matrix zeroes | 🟡 | In-place flags |
| 34 | Flatten nested array | 🟢 | Recursion |
| 35 | Chunk an array | 🟢 | Loop slice |
| 36 | Intersection of arrays | 🟢 | Set |
| 37 | Sliding window max | 🔴 | Deque |
| 38 | Longest substring w/o repeating | 🟡 | Sliding window |
| 39 | Minimum window substring | 🔴 | Sliding window |
| 40 | Sort 0s, 1s, 2s (Dutch flag) | 🟡 | Three pointers |

---

# 🟢 EASY

## 1. Reverse an array
```js
// in-place, two-pointer
function reverse(arr) {
  for (let l = 0, r = arr.length - 1; l < r; l++, r--) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
  }
  return arr;
}
// O(n) time, O(1) space
// built-in: arr.reverse()
```

## 2. Find max / min
```js
const max = Math.max(...arr);                   // simple
// for huge arrays (stack-safe):
let max = arr[0];
for (const v of arr) if (v > max) max = v;
// O(n), O(1)
```

## 3. Sum of all elements
```js
const sum = arr.reduce((a, v) => a + v, 0);
```

## 4. Remove duplicates
```js
// preserves order
[...new Set(arr)];                              // O(n)

// without Set
function uniq(arr) {
  const seen = {}, out = [];
  for (const v of arr) if (!seen[v]) { seen[v] = 1; out.push(v); }
  return out;
}
```

## 5. Check if sorted (ascending)
```js
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}
// O(n), O(1)
```

## 12. Move zeroes to end (preserve order)
```js
function moveZeroes(arr) {
  let write = 0;
  for (let read = 0; read < arr.length; read++) {
    if (arr[read] !== 0) { [arr[write], arr[read]] = [arr[read], arr[write]]; write++; }
  }
  return arr;
}
// O(n), O(1)
```

## 13. Contains duplicate
```js
const hasDup = arr => new Set(arr).size !== arr.length;
```

## 14. Find the missing number (array of 1..N with one missing)
```js
// math: expected sum - actual sum
function missing(arr, n) {
  const expected = (n * (n + 1)) / 2;
  return expected - arr.reduce((a, v) => a + v, 0);
}

// XOR variant (overflow-safe)
function missingXor(arr) {
  let x = arr.length;                    // include n
  for (let i = 0; i < arr.length; i++) x ^= i ^ arr[i];
  return x;
}
```

## 17. Merge two sorted arrays
```js
function merge(a, b) {
  const out = []; let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}
// O(n+m), O(n+m)
```

## 24. Majority element (> n/2 times) — Boyer-Moore
```js
function majority(arr) {
  let candidate = null, count = 0;
  for (const v of arr) {
    if (count === 0) candidate = v;
    count += (v === candidate) ? 1 : -1;
  }
  return candidate;
}
// O(n), O(1) — beautiful trick
```

## 34. Flatten a nested array
```js
// built-in
arr.flat(Infinity);

// manual recursion
function flatten(arr) {
  const out = [];
  for (const v of arr) {
    Array.isArray(v) ? out.push(...flatten(v)) : out.push(v);
  }
  return out;
}

// iterative (stack)
function flattenIter(arr) {
  const stack = [...arr], out = [];
  while (stack.length) {
    const v = stack.pop();
    Array.isArray(v) ? stack.push(...v) : out.unshift(v);
  }
  return out;
}
```

## 35. Chunk an array
```js
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
chunk([1,2,3,4,5], 2);                  // [[1,2],[3,4],[5]]
```

## 36. Intersection of two arrays
```js
const intersect = (a, b) => [...new Set(a)].filter(v => new Set(b).has(v));
// O(n+m), O(n+m)
```

---

# 🟡 MEDIUM

## 6. Rotate array by K (right rotation)
**Trick:** reverse whole, then reverse two halves.
```js
function rotate(arr, k) {
  k = k % arr.length;
  reverse(arr, 0, arr.length - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, arr.length - 1);
  return arr;
}
function reverse(a, l, r) {
  while (l < r) { [a[l], a[r]] = [a[r], a[l]]; l++; r--; }
}
// O(n), O(1)
```

## 7. Two Sum — unsorted, return indices
```js
function twoSum(arr, target) {
  const seen = new Map();
  for (let i = 0; i < arr.length; i++) {
    const need = target - arr[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(arr[i], i);
  }
  return [];
}
// O(n), O(n)
```

## 8. Two Sum — sorted array
```js
function twoSumSorted(arr, target) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const s = arr[l] + arr[r];
    if (s === target) return [l, r];
    s < target ? l++ : r--;
  }
  return [];
}
// O(n), O(1)
```

## 9. Three Sum — all unique triplets summing to 0
```js
function threeSum(arr) {
  arr.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < arr.length - 2; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue;           // skip dup i
    let l = i + 1, r = arr.length - 1;
    while (l < r) {
      const s = arr[i] + arr[l] + arr[r];
      if (s === 0) {
        res.push([arr[i], arr[l], arr[r]]);
        while (l < r && arr[l] === arr[l + 1]) l++;          // skip dups
        while (l < r && arr[r] === arr[r - 1]) r--;
        l++; r--;
      } else if (s < 0) l++;
      else r--;
    }
  }
  return res;
}
// O(n²), O(1) extra
```

## 10. Maximum subarray sum — Kadane's algorithm
```js
function maxSubArray(arr) {
  let cur = arr[0], best = arr[0];
  for (let i = 1; i < arr.length; i++) {
    cur = Math.max(arr[i], cur + arr[i]);
    best = Math.max(best, cur);
  }
  return best;
}
// O(n), O(1) — classic DP
```

## 11. Best time to buy/sell stock (one transaction)
```js
function maxProfit(prices) {
  let min = Infinity, profit = 0;
  for (const p of prices) {
    if (p < min) min = p;
    else if (p - min > profit) profit = p - min;
  }
  return profit;
}
// O(n), O(1)
```

## 15. Find duplicate number (1..N, one duplicate)
```js
// Floyd's tortoise & hare (treat array as linked list)
function findDup(arr) {
  let slow = arr[0], fast = arr[0];
  do { slow = arr[slow]; fast = arr[arr[fast]]; } while (slow !== fast);
  slow = arr[0];
  while (slow !== fast) { slow = arr[slow]; fast = arr[fast]; }
  return slow;
}
// O(n), O(1) — no mutation
```

## 16. Single number (every other element appears twice) — XOR
```js
function singleNumber(arr) {
  let x = 0;
  for (const v of arr) x ^= v;            // a^a=0, a^0=a
  return x;
}
// O(n), O(1)
```

## 18. Merge intervals
```js
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = out[out.length - 1], curr = intervals[i];
    if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]);
    else out.push(curr);
  }
  return out;
}
// O(n log n)
```

## 19. Product of array except self (no division)
```js
function productExceptSelf(arr) {
  const n = arr.length, out = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { out[i] = left; left *= arr[i]; }     // prefix
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= arr[i]; } // suffix
  return out;
}
// O(n) time, O(1) extra (output doesn't count)
```

## 20. Container with most water
```js
function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l));
    h[l] < h[r] ? l++ : r--;                  // move the shorter side
  }
  return best;
}
// O(n), O(1)
```

## 22. Subarray sum equals K (count)
```js
function subarraySum(arr, k) {
  const map = new Map([[0, 1]]);              // prefix sum frequency
  let sum = 0, count = 0;
  for (const v of arr) {
    sum += v;
    if (map.has(sum - k)) count += map.get(sum - k);
    map.set(sum, (map.get(sum) ?? 0) + 1);
  }
  return count;
}
// O(n), O(n)
```

## 23. Longest consecutive sequence (unsorted)
```js
function longestConsecutive(arr) {
  const s = new Set(arr); let best = 0;
  for (const v of s) {
    if (!s.has(v - 1)) {                      // only start at the beginning of a run
      let cur = v, len = 1;
      while (s.has(cur + 1)) { cur++; len++; }
      best = Math.max(best, len);
    }
  }
  return best;
}
// O(n) — the inner while only runs once across all starts
```

## 25. Find peak element
```js
function findPeak(arr) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] > arr[mid + 1]) hi = mid; else lo = mid + 1;
  }
  return lo;
}
// O(log n) — binary search even on unsorted!
```

## 26. Search in rotated sorted array
```js
function search(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[lo] <= arr[mid]) {                // left half sorted
      if (target >= arr[lo] && target < arr[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                  // right half sorted
      if (target > arr[mid] && target <= arr[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
// O(log n)
```

## 27. Find first & last position of target (sorted)
```js
function searchRange(arr, t) {
  const find = (leftBias) => {
    let lo = 0, hi = arr.length - 1, ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] === t) { ans = mid; leftBias ? hi = mid - 1 : lo = mid + 1; }
      else if (arr[mid] < t) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };
  return [find(true), find(false)];
}
// O(log n)
```

## 28. Kth largest element — quickselect (or sort)
```js
// simple: sort
function kthLargest(arr, k) {
  return arr.sort((a, b) => b - a)[k - 1];                  // O(n log n)
}

// optimal: quickselect O(n) avg
function kth(arr, k) {
  const target = arr.length - k;
  function qs(lo, hi) {
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (arr[j] <= pivot) { [arr[i], arr[j]] = [arr[j], arr[i]]; i++; }
    }
    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    if (i === target) return arr[i];
    return i < target ? qs(i + 1, hi) : qs(lo, i - 1);
  }
  return qs(0, arr.length - 1);
}
```

## 29. Top K frequent elements — bucket sort
```js
function topKFrequent(arr, k) {
  const freq = new Map();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);

  const buckets = Array.from({ length: arr.length + 1 }, () => []);
  for (const [val, f] of freq) buckets[f].push(val);

  const out = [];
  for (let i = buckets.length - 1; i >= 0 && out.length < k; i--) {
    out.push(...buckets[i]);
  }
  return out.slice(0, k);
}
// O(n)
```

## 30. Group anagrams
```js
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');       // OR char-count signature
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}
// O(n · k log k)  where k = avg string length
```

## 31. Spiral matrix
```js
function spiralOrder(m) {
  const out = [];
  let top = 0, bot = m.length - 1, left = 0, right = m[0].length - 1;
  while (top <= bot && left <= right) {
    for (let c = left; c <= right; c++) out.push(m[top][c]);   top++;
    for (let r = top;  r <= bot;   r++) out.push(m[r][right]); right--;
    if (top <= bot)    for (let c = right; c >= left; c--) out.push(m[bot][c]);   bot--;
    if (left <= right) for (let r = bot;   r >= top;  r--) out.push(m[r][left]);  left++;
  }
  return out;
}
```

## 32. Rotate matrix 90° clockwise (in place)
```js
function rotate(m) {
  const n = m.length;
  // transpose
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      [m[i][j], m[j][i]] = [m[j][i], m[i][j]];
  // reverse each row
  for (const row of m) row.reverse();
}
// O(n²), O(1)
```

## 33. Set matrix zeroes — in-place
```js
function setZeroes(m) {
  const rows = m.length, cols = m[0].length;
  let firstRowZero = m[0].includes(0);
  let firstColZero = m.some(r => r[0] === 0);

  // use first row/col as markers
  for (let i = 1; i < rows; i++)
    for (let j = 1; j < cols; j++)
      if (m[i][j] === 0) { m[i][0] = 0; m[0][j] = 0; }

  for (let i = 1; i < rows; i++)
    for (let j = 1; j < cols; j++)
      if (m[i][0] === 0 || m[0][j] === 0) m[i][j] = 0;

  if (firstRowZero) for (let j = 0; j < cols; j++) m[0][j] = 0;
  if (firstColZero) for (let i = 0; i < rows; i++) m[i][0] = 0;
}
// O(m·n), O(1)
```

## 38. Longest substring without repeating characters
```js
function lengthOfLongestSubstring(s) {
  const seen = new Map(); let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    if (seen.has(s[r]) && seen.get(s[r]) >= l) l = seen.get(s[r]) + 1;
    seen.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}
// O(n), O(min(n, alphabet))
```

## 40. Sort 0s, 1s, 2s — Dutch national flag
```js
function sortColors(arr) {
  let lo = 0, mid = 0, hi = arr.length - 1;
  while (mid <= hi) {
    if (arr[mid] === 0)      { [arr[lo], arr[mid]] = [arr[mid], arr[lo]]; lo++; mid++; }
    else if (arr[mid] === 2) { [arr[mid], arr[hi]] = [arr[hi], arr[mid]]; hi--;        }
    else                       mid++;
  }
  return arr;
}
// O(n), O(1)
```

---

# 🔴 HARD

## 21. Trapping rain water
```js
function trap(h) {
  let l = 0, r = h.length - 1, lMax = 0, rMax = 0, ans = 0;
  while (l < r) {
    if (h[l] < h[r]) {
      h[l] >= lMax ? (lMax = h[l]) : (ans += lMax - h[l]);
      l++;
    } else {
      h[r] >= rMax ? (rMax = h[r]) : (ans += rMax - h[r]);
      r--;
    }
  }
  return ans;
}
// O(n), O(1)
```

## 37. Sliding window maximum (window size k)
```js
function maxSlidingWindow(arr, k) {
  const dq = [], out = [];                  // dq stores INDICES, values decreasing
  for (let i = 0; i < arr.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();              // drop out-of-window
    while (dq.length && arr[dq[dq.length - 1]] < arr[i]) dq.pop(); // keep monotonic
    dq.push(i);
    if (i >= k - 1) out.push(arr[dq[0]]);
  }
  return out;
}
// O(n), O(k)
```

## 39. Minimum window substring
```js
function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let have = 0, required = need.size;
  let l = 0, best = [-1, -1], bestLen = Infinity;
  const have_cnt = new Map();

  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    have_cnt.set(c, (have_cnt.get(c) ?? 0) + 1);
    if (need.has(c) && have_cnt.get(c) === need.get(c)) have++;

    while (have === required) {
      if (r - l + 1 < bestLen) { best = [l, r]; bestLen = r - l + 1; }
      have_cnt.set(s[l], have_cnt.get(s[l]) - 1);
      if (need.has(s[l]) && have_cnt.get(s[l]) < need.get(s[l])) have--;
      l++;
    }
  }
  return bestLen === Infinity ? '' : s.slice(best[0], best[1] + 1);
}
// O(n+m)
```

---

## ⚡ Quick JS-specific tips for these problems

- **Number sort:** `arr.sort((a, b) => a - b)` — default is lexicographic!
- **Stack / queue:** array works fine. `pop()` / `push()` are O(1), `shift()` is O(n) — use index pointer for queue if perf matters.
- **Hash map:** `Map` for non-string keys; `{}` is fine for strings. `?? 0` for default counts: `m.set(k, (m.get(k) ?? 0) + 1)`.
- **Bit XOR:** `^` only on safe integers (≤ 2³¹).
- **Integer division:** `(a / b) | 0` or `Math.floor` or `>> 0` (only for 32-bit).
- **Swap:** `[a[i], a[j]] = [a[j], a[i]]` (destructuring, no temp var).
- **Array of N filled with x:** `new Array(N).fill(x)` (warning: `fill({})` shares refs!) or `Array.from({length: N}, () => ({}))`.

---

## 📈 Suggested study order
1. Day 1–2 → easy linear scans (#1–5, #12–13, #17, #24, #34, #35)
2. Day 3–4 → hashing + two-pointer (#7–9, #20, #22, #23, #36, #40)
3. Day 5–6 → DP + windowing (#10, #11, #38)
4. Day 7+ → binary search variants (#25–28)
5. Day 8+ → matrix (#31–33)
6. Day 9+ → hard (#21, #37, #39)
