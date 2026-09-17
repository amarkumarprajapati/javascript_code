# Step 1: Local Embeddings with JavaScript / Node.js (No Cloud APIs)

Generate vector embeddings **100% locally in JavaScript/TypeScript** without any cloud APIs.

---

## 📦 1. Method A: Local In-Memory Embeddings via `@xenova/transformers`

Run Hugging Face models directly inside Node.js via ONNX Runtime:

```bash
npm install @xenova/transformers
```

```javascript
// local-embeddings.js
import { pipeline } from '@xenova/transformers';

// Cosine similarity in pure JavaScript
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return normA === 0 || normB === 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function runLocalEmbeddings() {
  console.log('Loading local embedding model (BAAI/bge-small-en-v1.5)...');
  
  // Downloads model locally once to cache
  const pipe = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');

  const documents = [
    'MongoDB is a document-based NoSQL database.',
    'PostgreSQL is an advanced relational SQL database.',
    'React is a JavaScript front-end library for building user interfaces.',
    'Docker packages software into standardized containers.'
  ];

  // 1. Generate embeddings for all documents
  const docVectors = [];
  for (const doc of documents) {
    const output = await pipe(doc, { pooling: 'mean', normalize: true });
    docVectors.push(Array.from(output.data));
  }

  // 2. Generate embedding for query
  const query = 'How do I query JSON documents in a database?';
  const queryOutput = await pipe(query, { pooling: 'mean', normalize: true });
  const queryVector = Array.from(queryOutput.data);

  // 3. Rank documents by similarity
  const results = documents.map((doc, idx) => ({
    text: doc,
    similarity: cosineSimilarity(queryVector, docVectors[idx])
  })).sort((a, b) => b.similarity - a.similarity);

  console.log(`\nQuery: "${query}"\nTop Results:`);
  results.forEach((r, i) => console.log(`${i + 1}. [Score: ${r.similarity.toFixed(4)}] ${r.text}`));
}

runLocalEmbeddings();
```

---

## 🦙 2. Method B: Local Embeddings via Ollama (`ollama` NPM package)

```bash
ollama pull nomic-embed-text
npm install ollama
```

```javascript
// ollama-embed.js
import ollama from 'ollama';

async function generateVector(text) {
  const response = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  });
  
  console.log('Vector Length:', response.embedding.length); // 768 floats
  return response.embedding;
}

generateVector('Offline semantic search powered by local models.');
```

---

[⬅️ Back: Master Overview](../README.md) | [Next: Step 2 - Local RAG in JavaScript ➡️](../02-Local-Vector-DB-and-RAG/README.md)
