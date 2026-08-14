# How to Use Free AI Models

## Overview

You don't need expensive GPUs or paid APIs to work with AI. Here are the best free options.

## Open Source Models

### Popular Free Models

| Model | Parameters | Use Case |
|-------|-----------|----------|
| LLaMA 2/3 | 7B-70B | General purpose, instruction following |
| Mistral | 7B-12B | Efficient, high performance |
| Falcon | 7B-180B | General purpose, open weights |
| Gemma | 2B-9B | Lightweight, Google's open model |
| Phi-3 | 3.8B | Small but powerful |
| Qwen | 7B-72B | Multilingual support |
| Yi-34B | 34B | Strong reasoning capabilities |

### Hugging Face Hub
- Repository for thousands of open-source models
- Free to use with `transformers` library
- Many models available under permissive licenses

## Local Inference

### Ollama
Run LLMs locally with a simple command-line interface.

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull and run a model
ollama run llama3.2
ollama run mistral
ollama run codellama
```

**Python API:**
```python
import ollama
response = ollama.chat(model='llama3.2', messages=[
    {'role': 'user', 'content': 'Hello!'}
])
```

### Llama.cpp
Run models efficiently on CPU/GPU with GGUF format.

```bash
# Install
brew install llama.cpp  # macOS
# or build from source

# Run a model
llama-cli -m model.gguf -p "Hello, how are you?"
```

### vLLM
High-throughput serving for large models.

```bash
pip install vllm
python -m vllm.entrypoints.openai.api_server --model mistralai/Mistral-7B
```

## Free Cloud APIs

### Hugging Face Inference API
- Free tier available
- Supports most popular models
- Rate limits apply

```python
import requests
API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf"
headers = {"Authorization": "Bearer YOUR_TOKEN"}
response = requests.post(API_URL, headers=headers, json={"inputs": "Hello!"})
```

### Groq
- Free tier with fast inference
- Supports Llama, Mixtral, Gemma
- Extremely low latency

### Google AI Studio
- Free tier for Gemini models
- Generous rate limits
- Easy API access

### Together AI
- Free credits for new users
- Access to many open models
- OpenAI-compatible API

## Hardware Requirements

### CPU Only
- Models up to 7B parameters: 8GB RAM minimum
- Models up to 13B parameters: 16GB RAM minimum
- Quantization (4-bit, 8-bit) reduces requirements

### GPU
- 4GB VRAM: 7B models (quantized)
- 8GB VRAM: 7B models (full precision), 13B (quantized)
- 16GB VRAM: 13B models (full precision), 34B (quantized)
- 24GB+ VRAM: 70B models (quantized)

## Tips

1. **Use quantization**: 4-bit quantization reduces memory by ~75% with minimal quality loss
2. **Choose the right model size**: Smaller models are faster and cheaper
3. **Batch requests**: Process multiple inputs together when possible
4. **Cache results**: Avoid recomputing the same prompts
5. **Monitor rate limits**: Free tiers have usage restrictions
