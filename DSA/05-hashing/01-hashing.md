# Hashing (Hash Tables, Maps & Sets)

Hashing maps arbitrary keys to fixed-size values using a hash function. It enables average $O(1)$ time complexity for search, insert, and delete.

## 1. JavaScript Built-in Hashing: Map and Set

### `Map` (Key-Value pairs)
```javascript
const map = new Map();

// O(1) Operations
map.set('a', 1);
map.get('a');       // 1
map.has('a');       // true
map.delete('a');
map.size;           // 0
```

### `Set` (Unique values)
```javascript
const set = new Set();

// O(1) Operations
set.add(5);
set.has(5);         // true
set.delete(5);
set.size;           // 0
```

---

## 2. Common Patterns

### Frequency Counter Pattern
```javascript
function getFrequency(arr) {
  const freq = new Map();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}
```

### Two Sum with Hash Map — O(n) Time, O(n) Space
```javascript
function twoSum(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
```

## Practice Problems
- LeetCode 1: Two Sum
- LeetCode 242: Valid Anagram
- LeetCode 217: Contains Duplicate
- LeetCode 49: Group Anagrams
- LeetCode 128: Longest Consecutive Sequence
