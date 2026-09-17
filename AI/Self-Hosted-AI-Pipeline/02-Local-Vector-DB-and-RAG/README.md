# Step 2: 100% Local RAG Pipeline in JavaScript / Node.js

Build an offline RAG system completely in **JavaScript / Node.js** using ChromaDB (or in-memory vector store) + local Ollama LLM.

---

## 🏗️ The Local JavaScript RAG Flow

```text
[Local Documents / Files]
         │
         ▼ (1. Ingestion in Node.js)
  Split into Chunks
         │
         ▼ (2. Local Embeddings via @xenova/transformers or Ollama)
  Vector Arrays
         │
         ▼ (3. Local Vector Store / ChromaDB)
  Persisted Vectors
═══════════════════════════════════════════════
(Query Time)
User Prompt: "What is our deployment process?"
         │
         ▼ (4. Local Query Vector)
  Query Embedding
         │
         ▼ (5. Similarity Search in JS)
  Top Matching Chunks
         │
         ▼ (6. Context Injected into Local LLM via Ollama JS)
  Prompt sent to localhost:11434 (llama3.1 / qwen2.5)
         │
         ▼
  100% Offline Grounded Answer!
```

---

## 💻 Complete Local RAG Implementation in Node.js (`local-rag.js`)

Install dependencies:
```bash
npm install chromadb @xenova/transformers ollama
```

```javascript
// local-rag.js
import { ChromaClient } from 'chromadb';
import { pipeline } from '@xenova/transformers';
import ollama from 'ollama';

// 1. Initialize local embedding extractor
const extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');

async function getEmbedding(text) {
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// 2. Initialize ChromaDB Client (connects to local Chroma instance)
const client = new ChromaClient();
const collection = await client.getOrCreateCollection({ name: 'company_knowledge' });

// 3. Ingest documents into Local Vector Store
const docs = [
  { id: '1', text: 'Our API authentication uses JWT tokens with a 7-day expiration time.' },
  { id: '2', text: 'To deploy to production, merge to the main branch and verify the GitHub Actions pipeline.' },
  { id: '3', text: 'The customer refund policy allows full returns within 30 days of delivery.' },
];

console.log('Indexing documents locally...');
for (const doc of docs) {
  const vector = await getEmbedding(doc.text);
  await collection.upsert({
    ids: [doc.id],
    embeddings: [vector],
    documents: [doc.text],
  });
}

// 4. Local RAG Retrieval & Answer Function
async function queryLocalRAG(userQuestion) {
  console.log(`\n🔍 Searching local knowledge for: "${userQuestion}"...`);

  // Step A: Embed query locally in JS
  const queryVector = await getEmbedding(userQuestion);

  // Step B: Query ChromaDB for top 2 matches
  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: 2,
  });

  const retrievedContext = results.documents[0].join('\n---\n');

  // Step C: Send Grounded Prompt to Local LLM in Ollama
  const prompt = `You are a helpful company assistant. Answer the user question using ONLY the provided context below.
If the answer cannot be found in the context, say "I cannot find this information in local documents."

Context:
${retrievedContext}

User Question: ${userQuestion}
Answer:`;

  const response = await ollama.chat({
    model: 'llama3.1',
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  });

  return response.message.content;
}

// 5. Test the Offline RAG pipeline
const question = 'What is the refund policy duration?';
const answer = await queryLocalRAG(question);

console.log('\n🤖 Local LLM Response:');
console.log(answer);
```

---

[⬅️ Back: Step 1 - Local Embeddings](../01-Local-Embeddings/README.md) | [Next: Step 3 - Dataset Prep in JavaScript ➡️](../03-Dataset-Preparation/README.md)
