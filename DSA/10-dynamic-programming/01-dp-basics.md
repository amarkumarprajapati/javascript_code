# Dynamic Programming (DP)

Break problem into overlapping subproblems, store results, reuse them.

## Core idea
1. Identify state
2. State transition
3. Base case
4. Memoize or tabulate

## Fibonacci — memoization (top-down)
```javascript
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}
```

## Fibonacci — tabulation (bottom-up)
```javascript
function fibTab(n) {
  if (n <= 1) return n;
  const dp = Array(n + 1);
  dp[0] = 0; dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
```

## Climbing Stairs
```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
```

## 0/1 Knapsack
```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}
```

## Longest Common Subsequence
```javascript
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}
```

## Common DP patterns
- 0/1 Knapsack, Subset Sum
- LCS, LPS
- Coin Change, Unbounded Knapsack
- Matrix DP (unique paths, min path sum)
- State machine DP (buy/sell stock)

## Practice
- LeetCode: 70. Climbing Stairs
- LeetCode: 322. Coin Change
- LeetCode: 1143. Longest Common Subsequence
- LeetCode: 198. House Robber
- LeetCode: 300. Longest Increasing Subsequence
