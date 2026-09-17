# Step 4: Fine-Tune the Base Model with Python & PyTorch (QLoRA)

Now that you prepared `dataset_train.jsonl` using JavaScript, we use **Python** for the GPU training process using **PyTorch**, **Hugging Face Transformers**, and **PEFT (QLoRA)**.

---

## 🐍 1. Python Environment Setup for JS Developers

```bash
# 1. Create a Python virtual environment
python -m venv .venv

# 2. Activate virtual environment (Windows PowerShell)
.venv\Scripts\Activate.ps1

# 3. Install GPU training dependencies
pip install torch transformers datasets peft bitsandbytes trl accelerate
```

---

## 🚀 2. The Complete Training Script (`train_model.py`)

Save the following as `train_model.py`:

```python
# train_model.py
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments
)
from peft import LoraConfig, prepare_model_for_kbit_training
from trl import SFTTrainer

# 1. Select Base Open-Source Model
model_id = "unsloth/llama-3-8b-Instruct-bnb-4bit"

print("1. Loading Tokenizer & 4-bit Base Model...")
tokenizer = AutoTokenizer.from_pretrained(model_id)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto"
)
model = prepare_model_for_kbit_training(model)

# 2. Configure LoRA (Freezes 99% weights, trains fast low-rank adapters)
peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

# 3. Load your JSONL dataset created by Node.js!
print("2. Loading dataset_train.jsonl...")
dataset = load_dataset("json", data_files="dataset_train.jsonl", split="train")

# 4. Configure Training Parameters
training_args = TrainingArguments(
    output_dir="./finetuned_output",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    logging_steps=5,
    save_strategy="epoch",
    fp16=not torch.cuda.is_bf16_supported(),
    bf16=torch.cuda.is_bf16_supported(),
    optim="paged_adamw_8bit",
    report_to="none"
)

# 5. Initialize SFT Trainer
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    peft_config=peft_config,
    tokenizer=tokenizer,
    args=training_args,
    max_seq_length=1024,
)

# 6. Run Training
print("🚀 Training started...")
trainer.train()

# 7. Save Adapter Weights
trainer.model.save_pretrained("./my_custom_lora_adapters")
tokenizer.save_pretrained("./my_custom_lora_adapters")
print("✅ Done! Custom LoRA weights saved in ./my_custom_lora_adapters")
```

Run training:
```bash
python train_model.py
```

---

[⬅️ Back: Step 3 - Dataset Prep in JS](../03-Dataset-Preparation/README.md) | [Next: Step 5 - Quantize & Run in JS ➡️](../05-Quantize-and-Deploy-Local/README.md)
