# Recursion

A function that calls itself until a base condition is met.

## Anatomy
- **Base case** — stops recursion
- **Recursive case** — calls itself with smaller input
- **Return value** — combine results

## Template

```javascript
function solve(input) {
  // base case
  if (baseCondition(input)) {
    return baseValue;
  }

  // modify input toward base case
  const smaller = modify(input);

  // recursive call
  return combine(smaller);
}
```

## Examples

### Count down
```javascript
function countDown(n) {
  if (n === 0) return;       // base case
  console.log(n);
  countDown(n - 1);           // recursive case
}
```

### Factorial
```javascript
function factorial(n) {
  if (n <= 1) return 1;      // base case: 0! = 1, 1! = 1
  return n * factorial(n - 1);
}
```

### Sum of array
```javascript
function sum(arr, index = 0) {
  if (index === arr.length) return 0;      // base case
  return arr[index] + sum(arr, index + 1); // recursive case
}
```

### Fibonacci (naive — O(2ⁿ))
```javascript
function fib(n) {
  if (n <= 1) return n;       // base case
  return fib(n - 1) + fib(n - 2);
}
```

### Fibonacci with memoization (O(n))
```javascript
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

## Recursion Tree (fibonacci)
```
fib(4)
├── fib(3)
│   ├── fib(2)
│   │   ├── fib(1) → 1
│   │   └── fib(0) → 0
│   └── fib(1) → 1
└── fib(2)
    ├── fib(1) → 1
    └── fib(0) → 0
```

## When to use recursion
- Tree/graph traversals
- Divide and conquer
- Backtracking
- DP (memoization / tabulation)

## Common mistakes
1. Forgetting base case → stack overflow
2. Not reducing input toward base case → infinite loop
3. Not returning the recursive call result

## Practice
- LeetCode: 70. Climbing Stairs
- LeetCode: 344. Reverse String (recursive)
- LeetCode: 104. Maximum Depth of Binary Tree
