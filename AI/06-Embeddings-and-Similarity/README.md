# Phase 6: Vector Embeddings & Similarity Search

Embeddings are the backbone of **Semantic Search**, **Recommendation Systems**, and **RAG (Retrieval-Augmented Generation)**.

---

## 🔍 1. What are Embeddings?

An embedding converts a piece of text (sentence, paragraph, code) into an array of floating-point numbers (a vector) in high-dimensional space (e.g. 1536 dimensions for OpenAI `text-embedding-3-small`).

```text
"Puppy playing in the garden" ──> [ 0.024, -0.198, 0.841, 0.012, ... ] (1536 floats)
"Dog running on grass"        ──> [ 0.021, -0.185, 0.835, 0.015, ... ] (Very close distance)
"Quantum mechanics equation"  ──> [-0.742,  0.512, 0.043, -0.321, ...] (Far distance)
```

**Key property**: Texts with similar semantic meaning are mapped close to each other in vector space, even if they share zero identical keywords!

---

## 📐 2. Cosine Similarity in JavaScript

Cosine similarity measures the angle between two vectors:
$$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|}$$
- Value ranges from **-1.0** (opposite) to **+1.0** (identical meaning).

```typescript
// utils/similarity.ts
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

---

## 💻 3. Generating Embeddings in Node.js

```typescript
// scripts/generate-embeddings.ts
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity } from './utils/similarity';
import dotenv from 'dotenv';
dotenv.config();

async function runSemanticSearch() {
  const documents = [
    'Next.js is a React framework for building full-stack web applications.',
    'MongoDB Atlas is a cloud-native document database with built-in vector search.',
    'The golden retriever is a popular dog breed known for its gentle temperament.',
    'Node.js is an open-source, cross-platform JavaScript runtime environment.',
  ];

  // 1. Embed all documents
  const { embeddings: docEmbeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: documents,
  });

  // 2. Embed user query
  const query = 'How do I run JavaScript on the server?';
  const { embedding: queryEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: query,
  });

  // 3. Compute similarity against each document
  const results = documents.map((doc, idx) => ({
    text: doc,
    score: cosineSimilarity(queryEmbedding, docEmbeddings[idx]),
  }));

  // 4. Sort by highest similarity
  results.sort((a, b) => b.score - a.score);

  console.log(`Query: "${query}"\nTop Results:`);
  results.forEach((r, i) => {
    console.log(`${i + 1}. [Score: ${r.score.toFixed(4)}] ${r.text}`);
  });
}

runSemanticSearch();
```

---

## 🛠️ Practice Exercise

Build an in-memory FAQ search CLI where a user inputs a query and the system finds the top 2 closest FAQ answers using `text-embedding-3-small`.

---

[⬅️ Back: Phase 5 - Vercel AI SDK](../05-Vercel-AI-SDK/README.md) | [Next: Phase 7 - MongoDB Vector Search ➡️](../07-MongoDB-Vector-Search/README.md)
