# Phase 4: LLM APIs with JavaScript & TypeScript

Learn to interact directly with official model providers (OpenAI, Anthropic, Google Gemini, Groq) using Node.js and TypeScript.

---

## 📦 1. Installation & Environment Setup

```bash
npm install openai @google/genai @anthropic-ai/sdk dotenv
```

Create a `.env` file:
```env
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GEMINI_API_KEY="AIza..."
GROQ_API_KEY="gsk_..."
```

---

## 🤖 2. Basic Text Generation & Chat Completion

```typescript
// scripts/openai-chat.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runChat() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful senior JavaScript tech lead.' },
      { role: 'user', content: 'Explain Event Loop in 2 sentences.' },
    ],
    temperature: 0.2,
  });

  console.log('Response:', response.choices[0].message.content);
  console.log('Token Usage:', response.usage);
}

runChat();
```

---

## ⚡ 3. Direct Streaming with SDK

```typescript
// scripts/openai-stream.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI();

async function streamResponse(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
  console.log('\n--- Stream Complete ---');
}

streamResponse('Write a TypeScript function to debounce an API call.');
```

---

## 📊 4. Structured JSON Output (Strict Mode)

Ensures the model returns strictly validated JSON adhering to a JSON Schema:

```typescript
// scripts/extract-json.ts
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI();

const UserProfileSchema = z.object({
  name: z.string(),
  age: z.number(),
  occupation: z.string(),
  skills: z.array(z.string()),
  contact: z.object({
    email: z.string().email().optional(),
    city: z.string(),
  }),
});

async function extractUserData(text: string) {
  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Extract structured information from the provided biography.' },
      { role: 'user', content: text },
    ],
    response_format: zodResponseFormat(UserProfileSchema, 'user_profile'),
  });

  const parsed = completion.choices[0].message.parsed;
  console.log('Structured Profile:', parsed);
  return parsed;
}

extractUserData(
  'Hi, I am Sarah Connor, 34 years old working as a Senior DevOps Engineer in Austin. I work with Docker, Kubernetes, and AWS.'
);
```

---

## 🛠️ Practice Projects to Build

1. **AI Text Summarizer**: CLI script taking any markdown/text file and returning a bulleted executive summary.
2. **AI Resume Parser**: Take raw resume text and output a strongly-typed JSON schema with work experience, education, and skills.
3. **Multi-Model Fallback Engine**: If OpenAI fails or rate limits (429), automatically catch the error and retry with Groq/Gemini.

---

[⬅️ Back: Phase 3 - LLM Fundamentals](../03-LLM-Fundamentals/README.md) | [Next: Phase 5 - Vercel AI SDK ➡️](../05-Vercel-AI-SDK/README.md)
