# How to Use Free AI Models

## Overview

This guide covers practical steps to access and use AI models without paying for expensive services.

## Quick Start Options

### 1. Web Interfaces (No Coding Required)

**Hugging Face Spaces**
- Visit hf.co/spaces
- Find demos of popular models
- Interact directly in browser
- Examples: Chat with Llama, generate images with Stable Diffusion

**Google AI Studio**
- Go to aistudio.google.com
- Free access to Gemini models
- Chat interface and API key generation

### 2. API Access (For Developers)

#### Option A: Hugging Face Inference API

```python
import requests

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
headers = {"Authorization": "Bearer YOUR_HF_TOKEN"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({
    "inputs": "Explain quantum computing in simple terms",
    "parameters": {"max_new_tokens": 250}
})
print(output)
```

#### Option B: Local with Ollama

```bash
# Install Ollama (one command)
curl -fsSL https://ollama.com/install.sh | sh

# Run a model
ollama run llama3.2
ollama run mistral
ollama run codellama:7b
```

**Python Example:**
```python
import ollama

response = ollama.chat(model='llama3.2', messages=[
    {'role': 'system', 'content': 'You are a helpful assistant.'},
    {'role': 'user', 'content': 'Write a Python function to reverse a string'}
])
print(response['message']['content'])
```

#### Option C: Groq (Fast Inference)

```python
from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

chat_completion = client.chat.completions.create(
    messages=[{"role": "user", "content": "Explain RAG"}],
    model="llama-3.1-70b-versatile"
)
print(chat_completion.choices[0].message.content)
```

### 3. Run Locally with Python

```python
# Install required packages
pip install transformers torch accelerate

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "mistralai/Mistral-7B-Instruct-v0.3"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

inputs = tokenizer("Explain RAG:", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=200)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

## Comparison of Free Options

| Option | Cost | Speed | Quality | Setup |
|--------|------|-------|---------|-------|
| Hugging Face API | Free tier | Medium | Good | Easy |
| Ollama (local) | Free | Fast | Good | Medium |
| Groq | Free tier | Very Fast | Excellent | Easy |
| Google AI Studio | Free tier | Fast | Excellent | Easy |
| Local Python | Free | Medium | Excellent | Complex |

## Best Practices

1. **Start simple**: Use web interfaces first, then move to APIs
2. **Monitor usage**: Free tiers have rate limits
3. **Choose right model**: Smaller models for simple tasks, larger for complex reasoning
4. **Use system prompts**: Guide model behavior effectively
5. **Test locally**: Build with free APIs, deploy with local models if needed
