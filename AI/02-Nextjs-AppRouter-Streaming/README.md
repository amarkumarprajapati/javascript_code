# Phase 2: Next.js App Router & Streaming for AI

Modern AI applications require fast, responsive interfaces. Waiting 10 seconds for an LLM to generate a full response creates a poor user experience. Streaming tokens over HTTP using Next.js App Router is the industry standard.

---

## 🎯 What You Need To Master

- [x] App Router structure (`app/api/.../route.ts` vs `page.tsx`)
- [x] Server Components vs Client Components (`'use client'`)
- [x] Server Actions for mutations
- [x] Web Streams API: `ReadableStream`, `TextEncoder`, `TextDecoder`
- [x] Server-Sent Events (SSE) & `fetch` with streaming reader

---

## 1. Streaming API Route Handler (`app/api/chat/route.ts`)

Here is how a native Next.js API Route streams text token-by-token without external libraries:

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Create an encoder to transform text to Uint8Array
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Simulate or call LLM streaming chunks
      const sampleResponse = `Hello! You asked about: "${prompt}". Here is your streamed response token by token...`;
      const words = sampleResponse.split(' ');

      for (const word of words) {
        // Enqueue word + space
        controller.enqueue(encoder.encode(word + ' '));
        // Simulate network/generation latency
        await new Promise((resolve) => setTimeout(resolve, 60));
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
```

---

## 2. Consuming the Stream in a React Client Component

```tsx
// app/chat/page.tsx
'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.body) throw new Error('ReadableStream not supported');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: !done });
        setResponse((prev) => prev + chunkValue);
      }
    } catch (err) {
      console.error('Streaming error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Next.js AI Streamer</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Streaming...' : 'Send'}
        </button>
      </form>
      <div className="p-4 bg-gray-50 border rounded-lg min-h-[150px] whitespace-pre-wrap">
        {response || (loading ? 'Generating...' : 'Response will appear here.')}
      </div>
    </div>
  );
}
```

---

## 🛠️ Practice Project

Build a chat interface in Next.js that maintains message history in client state (`messages: { role: string, content: string }[]`) and renders user and assistant message bubbles with auto-scrolling to the bottom.

---

[⬅️ Back: Phase 1 - TypeScript](../01-TypeScript-for-AI/README.md) | [Next: Phase 3 - LLM Fundamentals ➡️](../03-LLM-Fundamentals/README.md)
