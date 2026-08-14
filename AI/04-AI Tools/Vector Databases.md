# Vector Databases

## What Are Vector Databases?

Databases optimized for storing, indexing, and querying high-dimensional vector embeddings used in AI/ML applications.

## How They Work

### Vector Search
```
Query: "machine learning"
→ Embedding: [0.1, 0.3, -0.2, ...]
→ Search for nearest vectors
→ Return most similar documents
```

### Distance Metrics
- **Cosine Similarity**: Measures angle between vectors (most common)
- **Euclidean Distance**: Straight-line distance
- **Dot Product**: Magnitude and direction combined
- **Manhattan Distance**: Sum of absolute differences

## Popular Vector Databases

### Pinecone
- Fully managed
- Serverless option available
- Easy to use, great for production

```python
import pinecone

pinecone.init(api_key="your-key", environment="us-west1-gcp")
index = pinecone.Index("your-index")

# Upsert vectors
index.upsert([
    ("id1", [0.1, 0.2, ...], {"metadata": "value"}),
    ("id2", [0.3, 0.4, ...], {"metadata": "value"})
])

# Query
results = index.query(
    vector=[0.1, 0.2, ...],
    top_k=5,
    include_metadata=True
)
```

### Weaviate
- Open source + managed cloud
- Built-in vectorization modules
- GraphQL API

```python
import weaviate

client = weaviate.connect_to_local()
collection = client.collections.get("Documents")

response = collection.query.near_vector(
    near_vector=[0.1, 0.2, ...],
    limit=5
)
```

### ChromaDB
- Open source, lightweight
- Easy local setup
- Great for development

```python
import chromadb

client = chromadb.PersistentClient(path="./db")
collection = client.get_or_create_collection("documents")

collection.add(
    documents=["doc1", "doc2"],
    embeddings=[[0.1, 0.2], [0.3, 0.4]],
    ids=["id1", "id2"]
)

results = collection.query(
    query_embeddings=[[0.1, 0.2]],
    n_results=2
)
```

### Qdrant
- Open source, high performance
- Written in Rust
- Supports filtering

```python
from qdrant_client import QdrantClient

client = QdrantClient("localhost", port=6333)

client.upsert(
    collection_name="documents",
    points=[{"id": 1, "vector": [0.1, 0.2], "payload": {"text": "doc1"}}]
)

results = client.search(
    collection_name="documents",
    query_vector=[0.1, 0.2],
    limit=5
)
```

### FAISS
- Library by Meta
- Extremely fast
- No server needed (in-memory)

```python
import faiss
import numpy as np

# Create index
index = faiss.IndexFlatL2(768)  # 768-dimensional vectors
vectors = np.random.rand(1000, 768).astype('float32')
index.add(vectors)

# Search
distances, indices = index.search(np.random.rand(1, 768).astype('float32'), k=5)
```

## Key Features

### Metadata Filtering
```python
# Filter by metadata during search
results = index.query(
    vector=query_vector,
    filter={"category": "technology"},
    top_k=10
)
```

### Hybrid Search
Combine vector search with keyword search for best results.

### HNSW Indexing
Hierarchical Navigable Small World - the most common indexing algorithm for approximate nearest neighbor search.

## Choosing a Vector Database

| Database | Type | Best For | Learning Curve |
|----------|------|----------|----------------|
| Pinecone | Managed | Production, startups | Low |
| Weaviate | Open source | Self-hosted, modules | Medium |
| ChromaDB | Open source | Development, prototyping | Low |
| Qdrant | Open source | Production, performance | Medium |
| FAISS | Library | Research, batch processing | Medium-High |

## Best Practices

1. **Choose the right dimension**: Match embedding model output
2. **Use appropriate distance metric**: Cosine for normalized embeddings
3. **Index properly**: Use HNSW or IVF for large datasets
4. **Batch operations**: Upsert in batches for better performance
5. **Monitor performance**: Track query latency and recall
