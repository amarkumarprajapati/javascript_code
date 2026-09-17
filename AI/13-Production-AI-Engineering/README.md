# Phase 13: Production AI Engineering & Operations

Moving an AI prototype to production requires security, rate limiting, caching, latency optimization, and cost tracking.

---

## 🛡️ 1. Prompt Injection Protection & Guardrails

Never trust user inputs directly inside system instructions.

```typescript
// utils/guardrails.ts
const SUSPICIOUS_PATTERNS = [
  /ignore previous instructions/i,
  /system prompt/i,
  /reveal your instructions/i,
  /act as an unrestricted/i,
];

export function sanitizeUserPrompt(input: string): string {
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      throw new Error('Input flagged by security policy');
    }
  }
  // Trim excessive character padding
  return input.slice(0, 4000).trim();
}
```

---

## ⚡ 2. Semantic Caching with Redis

Why pay for identical LLM queries twice? Cache answers based on prompt hashes or semantic embedding similarity:

```typescript
// services/cache.ts
import crypto from 'crypto';
// Example in-memory or Redis key-value store
const cache = new Map<string, { response: string; expiresAt: number }>();

export function getPromptHash(prompt: string, model: string): string {
  return crypto.createHash('sha256').update(`${model}:${prompt.trim().toLowerCase()}`).digest('hex');
}

export function getCachedResponse(hash: string): string | null {
  const item = cache.get(hash);
  if (!item || Date.now() > item.expiresAt) {
    return null;
  }
  return item.response;
}

export function setCachedResponse(hash: string, response: string, ttlSeconds: number = 3600) {
  cache.set(hash, { response, expiresAt: Date.now() + ttlSeconds * 1000 });
}
```

---

## 💰 3. Cost & Token Monitoring

Always track token consumption per user and route to prevent unexpected API bills:

```typescript
export interface TokenUsageEvent {
  userId: string;
  endpoint: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  timestamp: Date;
}

export function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  // Example rates for GPT-4o-mini ($0.15/1M in, $0.60/1M out)
  if (model === 'gpt-4o-mini') {
    return (promptTokens / 1_000_000) * 0.15 + (completionTokens / 1_000_000) * 0.60;
  }
  return 0;
}
```

---

## 📊 4. Production Checklist

- [ ] Implement rate limiting per IP / User ID using `@upstash/ratelimit`.
- [ ] Set `max_tokens` limits on all model completions.
- [ ] Log prompt latency, time-to-first-token (TTFT), and error rates to OpenTelemetry or Datadog.
- [ ] Add background retry queues (BullMQ) for non-interactive document batch embedding.

---

[⬅️ Back: Phase 12 - Local LLMs (Ollama)](../12-Local-LLMs-Ollama/README.md) | [Next: Phase 14 - Python for JS Devs ➡️](../14-Python-for-JS-Devs/README.md)
