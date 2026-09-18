# Advanced Dynamic Programming

## State Machine DP — Stock Problems
```javascript
function maxProfit(prices) {
  let hold = -Infinity, cash = 0;
  for (const p of prices) {
    hold = Math.max(hold, cash - p);
    cash = Math.max(cash, hold + p);
  }
  return cash;
}
```

## Matrix DP — Unique Paths
```javascript
function uniquePaths(m, n) {
  const dp = Array(m).fill(null).map(() => Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
```

## Min Path Sum
```javascript
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array(m).fill(null).map(() => Array(n).fill(0));
  dp[0][0] = grid[0][0];
  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0];
  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j];
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
}
```

## Practice
- LeetCode: 64. Minimum Path Sum
- LeetCode: 62. Unique Paths
- LeetCode: 188. Best Time to Buy and Sell Stock IV
- LeetCode: 416. Partition Equal Subset Sum
- LeetCode: 279. Perfect Squares
