// 01-graph-basics.js — BFS & DFS

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

function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);
  }
}

const graph = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D', 'E'],
  D: ['E'],
  E: []
};

console.log('BFS:', bfs(graph, 'A'));
dfs(graph, 'A');
