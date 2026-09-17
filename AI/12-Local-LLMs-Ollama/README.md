# Phase 12: Local LLMs with Ollama & Node.js

Running open-source models locally gives you **100% privacy**, **zero API costs**, and offline capability.

---

## 💻 1. Installing & Running Ollama

1. Download Ollama from [ollama.com](https://ollama.com).
2. Pull and run high-performance open-weight models:
```bash
# Pull Meta's Llama 3.1 8B (fast, versatile)
ollama run llama3.1

# Pull DeepSeek-R1 (advanced reasoning)
ollama run deepseek-r1:8b

# Pull Qwen 2.5 Coder (coding powerhouse)
ollama run qwen2.5-coder:7b
```

Ollama automatically runs a local HTTP server at `http://localhost:11434`.

---

## ⚡ 2. Calling Local Models from Node.js with Vercel AI SDK

Install the Ollama AI provider:
```bash
npm install ollama-ai-provider
```

```typescript
// scripts/local-chat.ts
import { streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';

const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

async function main() {
  console.log('🤖 Querying Local Llama 3.1...');

  const result = streamText({
    model: ollama('llama3.1'),
    prompt: 'Explain what happens when a browser parses HTML and CSS.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
}

main();
```

---

## 🔄 3. Using Ollama with the OpenAI SDK

Ollama natively supports OpenAI-compatible API routes at `http://localhost:11434/v1`:

```typescript
// scripts/ollama-openai-compat.ts
import OpenAI from 'openai';

const localClient = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // Any string works for local authentication
});

async function runLocal() {
  const response = await localClient.chat.completions.create({
    model: 'llama3.1',
    messages: [{ role: 'user', content: 'Give me 3 tips for optimizing MongoDB queries.' }],
  });

  console.log(response.choices[0].message.content);
}

runLocal();
```

---

## 📦 4. Quantization (GGUF) Explained

- Raw models use 16-bit floats (FP16), requiring ~16GB of VRAM for an 8B parameter model.
- **Quantization** compresses weights to 4-bit (Q4_K_M) or 8-bit (Q8_0) integers:
  - 8B model at Q4 takes only **~4.7 GB RAM/VRAM** with minimal accuracy degradation.
  - Allows full LLMs to run directly on standard laptops with CPU or Apple Silicon/NVIDIA GPUs.

---

[⬅️ Back: Phase 11 - Model Context Protocol (MCP)](../11-Model-Context-Protocol-MCP/README.md) | [Next: Phase 13 - Production AI Engineering ➡️](../13-Production-AI-Engineering/README.md)
