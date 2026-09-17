# Phase 8: Full-Stack RAG (Retrieval-Augmented Generation)

RAG is the most important commercial AI pattern today. It connects an LLM to private, up-to-date company data, PDFs, and documentation without re-training the model.

---

## 🏗️ 1. The End-to-End RAG Architecture

```text
[PDF / Markdown / HTML]
         │
         ▼ (1. Parse text)
   Raw Text Data
         │
         ▼ (2. Chunking: 500-1000 tokens with 10% overlap)
   [Chunk 1] [Chunk 2] [Chunk 3]
         │
         ▼ (3. Embedding Model)
   Vector Embeddings
         │
         ▼ (4. Storage)
  MongoDB Vector DB
  ═══════════════════════════════════════════════
  (Query Time)
  User Query: "What is our company refund policy?"
         │
         ▼ (5. Embed Query)
  Query Vector
         │
         ▼ (6. Top-K Vector Search)
  Retrieved Chunks: [Chunk #4: "Refunds issued within 30 days..."]
         │
         ▼ (7. Context Injection + System Prompt)
  Prompt: "Answer the user using only the provided context below..."
         │
         ▼ (8. LLM Generation)
  Grounded, Factual Answer with Exact Citations!
```

---

## ✂️ 2. Recursive Text Chunking in TypeScript

```typescript
// utils/chunker.ts
export function chunkText(
  text: string,
  chunkSize: number = 800,
  chunkOverlap: number = 100
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;

    // If not at the end of the text, break at nearest sentence or space
    if (endIndex < text.length) {
      const lastPeriod = text.lastIndexOf('.', endIndex);
      if (lastPeriod > startIndex + chunkSize / 2) {
        endIndex = lastPeriod + 1;
      }
    }

    const chunk = text.slice(startIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    startIndex = endIndex - chunkOverlap;
  }

  return chunks;
}
```

---

## 🤖 3. RAG Query Execution Pipeline with Citations

```typescript
// app/api/rag/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { searchSimilarDocuments } from '@/services/vectorSearch';

export async function POST(req: Request) {
  const { question, userId } = await req.json();

  // 1. Retrieve the most relevant chunks from MongoDB
  const contextChunks = await searchSimilarDocuments(question, userId, 3);

  // 2. Format context with source indices
  const contextText = contextChunks
    .map((chunk, index) => `[Source ${index + 1}]:\n${chunk.content}`)
    .join('\n\n');

  // 3. Formulate the RAG prompt with strict grounding instructions
  const systemPrompt = `You are a knowledgeable document assistant.
Use ONLY the context provided below to answer the user question.
If the context does not contain the answer, politely respond: "I cannot find information regarding this in the uploaded documents."
Always cite the source number (e.g. [Source 1]) when referencing facts.

--- CONTEXT START ---
${contextText}
--- CONTEXT END ---`;

  // 4. Stream grounded answer
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question },
    ],
  });

  return result.toDataStreamResponse();
}
```

---

## 🌟 4. Advanced RAG Optimization Checklist

- [ ] **Chunk Overlap**: Always preserve 10-15% overlap between adjacent chunks to prevent context splitting.
- [ ] **Metadata Filtering**: Store document ID, author, and timestamp alongside the vector for filtered queries.
- [ ] **Reranking**: Use a reranker model (like Cohere Rerank) to re-order top 20 search candidates to top 4 before feeding them to LLM.

---

[⬅️ Back: Phase 7 - MongoDB Vector Search](../07-MongoDB-Vector-Search/README.md) | [Next: Phase 9 - Tool Calling ➡️](../09-Tool-Calling/README.md)
