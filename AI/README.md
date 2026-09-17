# 🤖 Complete AI Engineering Curriculum (Local Self-Hosted & Full-Stack)

A complete, practical study guide built for developers who want to **take raw open-source models, prepare custom datasets, generate local embeddings, build offline RAG, fine-tune models, quantize to GGUF, and run locally** without any paid cloud APIs.

---

## 🌟 Track 1: 100% Self-Hosted, Local Embeddings, Local RAG & Fine-Tuning (Recommended)

> **Zero Cloud APIs required**. Everything runs locally on your machine / GPU.

```text
                               100% LOCAL & FREE AI PIPELINE
                                              │
    ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
    │                                         │                                         │
    ▼                                         ▼                                         ▼
1. LOCAL EMBEDDINGS                       2. LOCAL RAG                            3. TRAIN / FINE-TUNE
• Hugging Face sentence-transformers     • Local Vector DB (Chroma/FAISS)        • Raw Base Model (Llama 3 / Qwen)
• Nomadic / BGE-small / MiniLM           • Document Chunking & Ingestion         • Custom Dataset Prep (JSONL)
• 100% Offline in Python & JS            • Offline Grounded Retrieval            • PyTorch + QLoRA (4-bit)
    │                                         │                                         │
    └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                              │
                                              ▼
                             4. QUANTIZE & RUN LOCALLY
                             • Merge LoRA Adapters
                             • Convert to GGUF Format (4-bit / 8-bit)
                             • Run in Ollama / llama.cpp
                             • Connect to your Node.js / React Web App
```

| Step | Folder | Focus |
| :--- | :--- | :--- |
| **01** | [01-Local-Embeddings/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/Self-Hosted-AI-Pipeline/01-Local-Embeddings/README.md) | Local vector embeddings (Python `sentence-transformers`, JS `@xenova/transformers`, Ollama `nomic-embed-text`) |
| **02** | [02-Local-Vector-DB-and-RAG/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/Self-Hosted-AI-Pipeline/02-Local-Vector-DB-and-RAG/README.md) | Offline RAG with local ChromaDB / FAISS + local LLM context grounding |
| **03** | [03-Dataset-Preparation/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/Self-Hosted-AI-Pipeline/03-Dataset-Preparation/README.md) | Preparing & formatting custom data into `JSONL`, `Alpaca`, and `ChatML` formats |
| **04** | [04-Train-FineTune-LLM/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/Self-Hosted-AI-Pipeline/04-Train-FineTune-LLM/README.md) | Fine-tuning raw open-source base models with PyTorch, QLoRA, PEFT, and `SFTTrainer` |
| **05** | [05-Quantize-and-Deploy-Local/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/Self-Hosted-AI-Pipeline/05-Quantize-and-Deploy-Local/README.md) | Merging LoRA weights, converting to GGUF (4-bit), loading into Ollama & querying from Node.js/React |

---

## 🧭 Track 2: Full-Stack JavaScript / TypeScript AI Foundations

| Phase | Directory | Description |
| :--- | :--- | :--- |
| **00** | [00-Overview/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/00-Overview/README.md) | Roadmap Overview & Progress Checklist |
| **01** | [01-TypeScript-for-AI/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/01-TypeScript-for-AI/README.md) | Generics, Zod Schema Typing, Error Handling |
| **02** | [02-Nextjs-AppRouter-Streaming/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/02-Nextjs-AppRouter-Streaming/README.md) | App Router, Server Actions, `ReadableStream` Chat UI |
| **03** | [03-LLM-Fundamentals/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/03-LLM-Fundamentals/README.md) | Tokens, Context Windows, Temperature, System Prompts |
| **04** | [04-LLM-APIs-with-JavaScript/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/04-LLM-APIs-with-JavaScript/README.md) | Direct SDK calling & Structured JSON Extraction |
| **05** | [05-Vercel-AI-SDK/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/05-Vercel-AI-SDK/README.md) | Unified AI SDK (`streamText`, `useChat`, Generative UI) |
| **06** | [06-Embeddings-and-Similarity/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/06-Embeddings-and-Similarity/README.md) | Vector Math, Cosine Similarity |
| **07** | [07-MongoDB-Vector-Search/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/07-MongoDB-Vector-Search/README.md) | MongoDB Atlas Vector Search & `$vectorSearch` |
| **08** | [08-RAG-Full-Pipeline/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/08-RAG-Full-Pipeline/README.md) | Document chunking, retrieval & citations |
| **09** | [09-Tool-Calling/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/09-Tool-Calling/README.md) | Function calling schemas & DB/API tools |
| **10** | [10-AI-Agents/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/10-AI-Agents/README.md) | Autonomous ReAct loops & memory |
| **11** | [11-Model-Context-Protocol-MCP/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/11-Model-Context-Protocol-MCP/README.md) | Model Context Protocol architecture & servers |
| **12** | [12-Local-LLMs-Ollama/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/12-Local-LLMs-Ollama/README.md) | Ollama setup, Quantization, Local Llama 3 / DeepSeek |
| **13** | [13-Production-AI-Engineering/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/13-Production-AI-Engineering/README.md) | Security guardrails, caching, rate limiting |
| **14** | [14-Python-for-JS-Devs/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/14-Python-for-JS-Devs/README.md) | Python syntax cheat sheet, venv, PyTorch tensors |
| **15** | [15-PyTorch-Transformers-FineTuning/](file:///c:/Users/Dell/Documents/Per/javascript_code/AI/15-PyTorch-Transformers-FineTuning/README.md) | Hugging Face, LoRA, QLoRA, SFTTrainer |
