# Recursion

## What is recursion?

A function that calls **itself** until it reaches a **base case** — a condition where it stops calling itself.

Think of it like Russian nesting dolls: you open one, find another inside, and keep going until you reach the smallest one.

## Why use recursion?

- Problems with **self-similar structure** (trees, graphs, fractals)
- **Divide and conquer** — break a problem into smaller subproblems
- **Backtracking** — explore choices and undo them
- Cleaner code for certain problems (e.g., tree traversals)

## Anatomy of a recursive function

1. **Base case** — the condition that stops recursion
2. **Recursive case** — the function calls itself with a **smaller input**
3. **Return value** — combine results from recursive calls

## Template

```javascript
function solve(input) {
  // 1. Base case: stop condition
  if (baseCondition(input)) {
    return baseValue;
  }

  // 2. Modify input toward base case
  const smaller = modify(input);

  // 3. Recursive call
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
countDown(5); // prints: 5, 4, 3, 2, 1
```

### Factorial
```javascript
function factorial(n) {
  if (n <= 1) return 1;      // base case: 0! = 1, 1! = 1
  return n * factorial(n - 1);
}
factorial(5); // 120
```

### Sum of array
```javascript
function sum(arr, index = 0) {
  if (index === arr.length) return 0;      // base case
  return arr[index] + sum(arr, index + 1); // recursive case
}
sum([1, 2, 3, 4, 5]); // 15
```

### Reverse a string
```javascript
function reverse(str) {
  if (str === "") return "";              // base case
  return reverse(str.slice(1)) + str[0];  // recursive case
}
reverse("hello"); // "olleh"
```

### Check palindrome
```javascript
function isPalindrome(str) {
  if (str.length <= 1) return true;       // base case
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}
isPalindrome("racecar"); // true
```

## Recursion tree (Fibonacci)

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

Notice how `fib(2)` is computed twice — this is why naive recursion can be slow. We fix this with **memoization**.

### Fibonacci with memoization — O(n)
```javascript
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];     // check cache
  if (n <= 1) return n;              // base case

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
fibMemo(50); // fast, no recomputation
```

## Iteration vs Recursion

```javascript
// Iterative factorial
function factorialIter(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Recursive factorial
function factorialRec(n) {
  if (n <= 1) return 1;
  return n * factorialRec(n - 1);
}
```

Both give the same answer. Recursion is often more elegant but uses the call stack.

## When to use recursion

- Tree / graph traversals
- Divide and conquer algorithms
- Backtracking (permutations, combinations)
- Dynamic programming (memoization / tabulation)

## Common mistakes

1. **Forgetting base case** → stack overflow
2. **Not reducing input** → infinite recursion
3. **Not returning the recursive call** → `undefined` result
4. **Off-by-one** in base case → wrong answer

## Practice

- LeetCode: 70. Climbing Stairs
- LeetCode: 344. Reverse String (recursive)
- LeetCode: 104. Maximum Depth of Binary Tree
- LeetCode: 206. Reverse Linked List (recursive)
