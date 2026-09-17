# Phase 15: PyTorch, Hugging Face & Fine-Tuning (LoRA / QLoRA)

Fine-tuning adapts an existing pre-trained base model (e.g. Llama 3, Mistral 7B) on your own custom domain-specific dataset (specialized tone, custom syntax, niche company domain).

---

## 🔬 1. When to Fine-Tune vs RAG

| Criteria | Use **RAG** when... | Use **Fine-Tuning** when... |
| :--- | :--- | :--- |
| **Goal** | Injecting factual knowledge & fresh docs | Changing model style, tone, format, or task syntax |
| **Knowledge Updates** | Frequently changing daily data | Static patterns and specialized domain behaviors |
| **Hallucination Rate** | Lowest (Strict context grounding) | Can still hallucinate facts if not paired with RAG |
| **Cost / Complexity** | Low to Medium | High (GPU compute required) |

> 💡 **Best Practice**: In enterprise systems, **RAG + Fine-Tuning** are combined: fine-tune for domain dialect/schema adherence, and use RAG for factual grounding.

---

## ⚡ 2. Parameter-Efficient Fine-Tuning: LoRA & QLoRA

- **Full Fine-Tuning**: Updates all 8+ billion weights. Requires multiple expensive datacenter GPUs (A100/H100).
- **LoRA (Low-Rank Adaptation)**: Freezes 99% of original model weights and injects small trainable low-rank adapter matrices ($A \times B$).
- **QLoRA (Quantized LoRA)**: Quantizes base model to 4-bit, allowing fine-tuning of an 8B model on a single consumer GPU (e.g. RTX 3090/4090 or Google Colab T4)!

```text
  [Input X]
    │
    ├───────────────────────────────────┐
    ▼ (Frozen Base Model 4-bit)         ▼ (Trainable Adapter Matrices)
  [Frozen Pre-Trained Weights W₀]     [Matrix A] ──> [Matrix B]
    │                                   │
    └───────────────┬───────────────────┘
                    ▼
               Output (W₀·X + B·A·X)
```

---

## 🐍 3. Fine-Tuning with Hugging Face `trl` and `peft`

```python
# train_lora.py
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer

# 1. Base Model ID
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"

# 2. 4-bit Quantization Config (QLoRA)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

# 3. Load Tokenizer & Model
tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto"
)
model = prepare_model_for_kbit_training(model)

# 4. Configure LoRA
peft_config = LoraConfig(
    r=16,                         # Rank dimension
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 5. Training Arguments
training_args = TrainingArguments(
    output_dir="./lora_finetuned_model",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    logging_steps=10,
    max_steps=100,
    fp16=True,
    optim="paged_adamw_8bit"
)

# 6. SFT Trainer (Supervised Fine-Tuning)
# Note: Provide your instruction-formatted dataset JSON
# dataset = load_dataset("json", data_files="training_data.jsonl")

print("Ready to start LoRA Fine-Tuning with SFTTrainer!")
```

---

## 🎯 Final Milestone

Export your fine-tuned LoRA weights, merge them with the base model, quantize to GGUF format, and run your custom trained model in **Ollama** or **Node.js**!

---

[⬅️ Back: Phase 14 - Python for JS Devs](../14-Python-for-JS-Devs/README.md) | [Back to Master Index 🏠](../README.md)
