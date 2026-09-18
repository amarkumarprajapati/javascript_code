# Minimum Spanning Tree (MST)

Connects all vertices with minimum total edge weight.

## Kruskal’s Algorithm — O(E log E)
```javascript
function kruskal(edges, V) {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: V }, (_, i) => i);
  const rank = Array(V).fill(0);

  function find(x) {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }

  function union(x, y) {
    const rx = find(x), ry = find(y);
    if (rx === ry) return false;
    if (rank[rx] < rank[ry]) parent[rx] = ry;
    else if (rank[rx] > rank[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rank[rx]++; }
    return true;
  }

  const mst = [];
  for (const [u, v, w] of edges) {
    if (union(u, v)) mst.push([u, v, w]);
  }
  return mst;
}
```

## Prim’s Algorithm — O((V + E) log V)
```javascript
function prim(graph, start) {
  const visited = new Set();
  const pq = new MinHeap();
  let mstWeight = 0;

  pq.push([start, 0]);
  while (pq.heap.length) {
    const [u, w] = pq.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    mstWeight += w;
    for (const [v, weight] of graph[u]) {
      if (!visited.has(v)) pq.push([v, weight]);
    }
  }
  return mstWeight;
}
```

## Practice
- LeetCode: 1584. Min Cost to Connect All Points
- LeetCode: 1135. Connecting Cities With Minimum Cost
