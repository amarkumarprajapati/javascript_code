# Backtracking

Backtracking is an algorithmic paradigm that tries to construct a solution incrementally, one piece at a time, removing solutions that fail to satisfy constraints at any point (pruning).

---

## The General Template

```javascript
function backtrack(candidate, state, result) {
  if (isSolution(state)) {
    result.push([...state]);
    return;
  }

  for (const choice of getChoices(candidate, state)) {
    if (isValid(choice, state)) {
      state.push(choice);          // Make choice
      backtrack(candidate, state, result); // Recurse
      state.pop();                 // Undo choice (backtrack)
    }
  }
}
```

---

## 1. Subsets (Power Set)
Generate all possible subsets of an array of distinct integers:

```javascript
function subsets(nums) {
  const result = [];

  function dfs(index, current) {
    result.push([...current]);

    for (let i = index; i < nums.length; i++) {
      current.push(nums[i]);
      dfs(i + 1, current);
      current.pop(); // backtrack
    }
  }

  dfs(0, []);
  return result;
}
```

---

## 2. Permutations
Generate all permutations of distinct integers:

```javascript
function permute(nums) {
  const result = [];
  const visited = new Set();

  function dfs(current) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }

    for (const num of nums) {
      if (visited.has(num)) continue;
      visited.add(num);
      current.push(num);
      dfs(current);
      current.pop();
      visited.delete(num);
    }
  }

  dfs([]);
  return result;
}
```

## Practice Problems
- LeetCode 78: Subsets
- LeetCode 46: Permutations
- LeetCode 39: Combination Sum
- LeetCode 51: N-Queens
- LeetCode 79: Word Search
