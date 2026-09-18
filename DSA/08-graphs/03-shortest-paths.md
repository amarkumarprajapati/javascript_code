# Shortest Path Algorithms

## Dijkstra (weighted, non-negative edges) — O((V + E) log V)
```javascript
function dijkstra(graph, start) {
  const dist = {};
  const pq = new MinHeap(); // use custom MinHeap with [node, weight]

  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;
  pq.push([start, 0]);

  while (pq.heap.length) {
    const [u, d] = pq.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([v, dist[v]]);
      }
    }
  }
  return dist;
}
```

## Bellman-Ford (negative edges allowed) — O(V * E)
```javascript
function bellmanFord(edges, V, start) {
  const dist = Array(V).fill(Infinity);
  dist[start] = 0;

  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  // detect negative cycle
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null; // negative cycle
  }
  return dist;
}
```

## Floyd Warshall (all pairs shortest path) — O(V³)
```javascript
function floydWarshall(graph) {
  const V = graph.length;
  const dist = graph.map(row => [...row]);

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}
```

## Practice
- LeetCode: 743. Network Delay Time
- LeetCode: 787. Cheapest Flights Within K Stops
