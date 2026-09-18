# Greedy Algorithms

A greedy algorithm always makes the choice that looks best at the moment, with the hope that this local optimal choice will lead to a globally optimal solution.

---

## Key Conditions for Greedy
1. **Greedy Choice Property**: A global optimum can be arrived at by selecting a local optimum.
2. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to subproblems.

---

## Example: Coin Change (Greedy for standard denominations)
*Note: Greedy works for denominations like standard US/Indian currency, but DP is required for arbitrary coin systems.*

```javascript
function minCoinsGreedy(coins, amount) {
  // Sort descending
  coins.sort((a, b) => b - a);
  let count = 0;
  for (const coin of coins) {
    if (amount === 0) break;
    count += Math.floor(amount / coin);
    amount %= coin;
  }
  return amount === 0 ? count : -1;
}
```

---

## Example: Activity Selection / Interval Scheduling
Sort by end time to maximize non-overlapping intervals:

```javascript
function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  // Sort by end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let end = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      count++; // Overlapping interval removed
    } else {
      end = intervals[i][1];
    }
  }
  return count;
}
```

## Practice Problems
- LeetCode 435: Non-overlapping Intervals
- LeetCode 55: Jump Game
- LeetCode 134: Gas Station
- LeetCode 455: Assign Cookies
