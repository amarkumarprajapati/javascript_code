# Phase 7: MongoDB Atlas Vector Search

As a MERN stack developer, you do **not** need to install a completely separate vector database to start building production AI. MongoDB Atlas has a built-in, highly optimized **Vector Search Index** using HNSW (Hierarchical Navigable Small World).

---

## 🏗️ 1. MongoDB Atlas Vector Index Definition

In the MongoDB Atlas UI under **Search & Vector Search**, create an index (e.g. named `vector_index`) on your collection (e.g., `knowledge_docs`):

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "category"
    },
    {
      "type": "filter",
      "path": "userId"
    }
  ]
}
```

---

## 💾 2. Inserting Vectorized Documents in Mongoose / MongoDB Driver

```typescript
// models/Document.ts
import mongoose, { Schema } from 'mongoose';

export interface IDocument {
  content: string;
  category: string;
  userId: string;
  embedding: number[];
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  content: { type: String, required: true },
  category: { type: String, required: true },
  userId: { type: String, required: true },
  embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
```

---

## 🔎 3. Querying with the `$vectorSearch` Aggregation Pipeline

```typescript
// services/vectorSearch.ts
import { DocumentModel } from '../models/Document';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function searchSimilarDocuments(
  query: string,
  userId: string,
  limit: number = 4
) {
  // 1. Convert user question to vector
  const { embedding: queryVector } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  });

  // 2. Perform Atlas Vector Search aggregation
  const pipeline = [
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryVector,
        numCandidates: limit * 10, // how many nearest candidates to evaluate
        limit: limit,
        filter: {
          userId: { $eq: userId }, // Pre-filtering by user
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        category: 1,
        score: { $meta: 'vectorSearchScore' }, // Returns cosine score
      },
    },
  ];

  const results = await DocumentModel.aggregate(pipeline);
  return results;
}
```

---

## 🚀 Key Advantages for MERN Devs
1. **Single Database**: Store users, sessions, orders, and vector embeddings in the same cluster.
2. **ACID Transactions**: Update documents and embeddings atomically.
3. **Hybrid Search**: Combine traditional keyword `$text` search and `$vectorSearch` in single pipelines.

---

[⬅️ Back: Phase 6 - Embeddings & Similarity](../06-Embeddings-and-Similarity/README.md) | [Next: Phase 8 - RAG Full Pipeline ➡️](../08-RAG-Full-Pipeline/README.md)
