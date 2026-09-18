# Graphs

Non-linear collection of vertices (nodes) and edges.

## Representations
```javascript
// Adjacency list (preferred)
const graph = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D', 'E'],
  D: ['E'],
  E: []
};

// Adjacency matrix
const matrix = [
  [0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0],
  ...
];
```

## BFS (Breadth-First Search) — shortest path in unweighted graph
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

## DFS (Depth-First Search) — go deep first
```javascript
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  }
}
```

## When to use
- BFS: shortest path, level-order, social network “friends of friends”
- DFS: path finding, cycle detection, topological sort

## Practice
- LeetCode: 733. Flood Fill
- LeetCode: 200. Number of Islands
- LeetCode: 994. Rotting Oranges
