# Phase 1: TypeScript for AI Engineering

As a JavaScript/MERN developer, learning TypeScript is critical because modern AI frameworks (Vercel AI SDK, LangChain, MCP SDK) rely heavily on strict typing, type narrowing, and runtime schema validation with libraries like **Zod**.

---

## 🎯 What You Need To Master

- [x] Basic & Complex Types (Primitives, Arrays, Objects, Tuples)
- [x] Interfaces vs Type Aliases
- [x] Generics (crucial for API response wrappers and model outputs)
- [x] Union Types, Discriminated Unions & Type Narrowing
- [x] Schema Validation with **Zod** (The standard for Structured AI Outputs)
- [x] Strongly Typed Error Handling with `Result<T, E>` patterns

---

## 1. Core Types & Generics for AI Applications

When querying LLMs, responses can be dynamic or structured. Generics allow you to write reusable LLM invocation wrappers:

```typescript
// types/ai.ts
export type Role = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface LLMResponse<TData = string> {
  success: boolean;
  data: TData;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}
```

---

## 2. Type Narrowing & Discriminated Unions for Tool Calls

AI responses often switch between simple text or tool execution requests. Discriminated unions make handling these completely type-safe:

```typescript
// types/agent.ts
export type AgentStep = 
  | { type: 'text_response'; message: string }
  | { type: 'tool_call'; toolName: string; parameters: Record<string, unknown> }
  | { type: 'error'; code: number; reason: string };

export function handleAgentStep(step: AgentStep) {
  switch (step.type) {
    case 'text_response':
      console.log('Bot says:', step.message);
      break;
    case 'tool_call':
      console.log(`Calling tool ${step.toolName} with args:`, step.parameters);
      break;
    case 'error':
      console.error(`Error (${step.code}):`, step.reason);
      break;
  }
}
```

---

## 3. Zod Schema Validation (Essential for Structured Output)

LLMs output raw strings. We use Zod to validate and parse raw LLM JSON into strict TypeScript types:

```typescript
import { z } from 'zod';

// 1. Define the schema
export const CustomerAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  score: z.number().min(0).max(100),
  keyTopics: z.array(z.string()),
  actionRequired: z.boolean(),
  recommendedReply: z.string().optional()
});

// 2. Infer the TypeScript type automatically
export type CustomerAnalysis = z.infer<typeof CustomerAnalysisSchema>;

// 3. Parser function
export function parseAIOutput(rawJsonString: string): CustomerAnalysis {
  try {
    const raw = JSON.parse(rawJsonString);
    return CustomerAnalysisSchema.parse(raw); // throws if schema doesn't match
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('LLM output failed validation:', err.flatten());
    }
    throw new Error('Invalid LLM output structure');
  }
}
```

---

## 🛠️ Practice Exercise

1. Create a `types/prompt.ts` file defining an interface for a Prompt Template that accepts dynamic variable keys.
2. Write a strongly typed function `validateJSON<T>(schema: z.ZodSchema<T>, jsonString: string): T` that guarantees type safety on any AI-generated JSON.

---

[⬅️ Back to Overview](../00-Overview/README.md) | [Next: Phase 2 - Next.js & Streaming ➡️](../02-Nextjs-AppRouter-Streaming/README.md)
