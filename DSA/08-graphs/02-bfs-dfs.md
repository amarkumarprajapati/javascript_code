# BFS & DFS

## BFS (Breadth-First Search)
Uses a queue. Explores all neighbors before moving deeper.

```javascript
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
```

## DFS (Depth-First Search)
Uses a stack (explicit or call stack). Goes deep before backtracking.

```javascript
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  }
}

// iterative
function dfsIterative(graph, start) {
  const visited = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const node = stack.pop();
    console.log(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
}
```

## Comparison
| BFS | DFS |
|-----|-----|
| Queue | Stack / recursion |
| Shortest path (unweighted) | Cycle detection, paths |
| Level order | Deep search |
| More memory for wide graphs | More memory for deep trees |

## Practice
- LeetCode: 733. Flood Fill
- LeetCode: 200. Number of Islands
- LeetCode: 130. Surrounded Regions
- LeetCode: 1091. Shortest Path in Binary Matrix
