# Phase 5: Mastering the Vercel AI SDK

The **Vercel AI SDK** (`ai`) is the gold standard unified framework for building AI applications in the JavaScript/TypeScript ecosystem. It abstracts away model differences (OpenAI, Anthropic, Google, Mistral, Ollama) and handles streaming, structured data, and tools seamlessly.

---

## 📦 1. Installation

```bash
npm install ai @ai-sdk/openai @ai-sdk/google @ai-sdk/anthropic zod
```

---

## ⚡ 2. Core Functions: `generateText`, `streamText`, `generateObject`

### A. Simple Text Generation
```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text, usage } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: 'Give me 3 clean code tips for React developers.',
});

console.log(text);
```

### B. Streaming to Next.js Client
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### C. Structured Object Generation
```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const { object } = await generateObject({
  model: openai('gpt-4o-mini'),
  schema: z.object({
    recipeName: z.string(),
    prepTimeMinutes: z.number(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a healthy 15-minute breakfast recipe using eggs and avocado.',
});

console.log(object.recipeName);
console.log(object.ingredients);
```

---

## 🎨 3. Client UI with `useChat` hook

```tsx
// app/page.tsx
'use client';

import { useChat } from 'ai/react';

export default function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4 mb-8">
        {messages.map((m) => (
          <div key={m.id} className={`p-4 rounded-lg ${m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            <span className="font-bold">{m.role === 'user' ? 'You' : 'AI'}: </span>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md p-4 bg-white border-t">
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Ask anything..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

---

## 🛠️ Key Advantages

1. **Model Swapping**: Switch from `openai('gpt-4o')` to `anthropic('claude-3-5-sonnet-20240620')` or `google('gemini-1.5-pro')` by changing 1 line.
2. **Integrated Tool Calling**: Tools define parameters with Zod and are executed automatically.
3. **Data Stream Protocol**: Sends back text tokens, tool call statuses, and errors over a single streamlined connection.

---

[⬅️ Back: Phase 4 - LLM APIs with JS](../04-LLM-APIs-with-JavaScript/README.md) | [Next: Phase 6 - Embeddings & Similarity ➡️](../06-Embeddings-and-Similarity/README.md)
