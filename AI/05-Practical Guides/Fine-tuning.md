# Fine-tuning LLMs

## What is Fine-tuning?

Adapting a pre-trained model to a specific task or dataset by training it further on domain-specific data.

## When to Fine-tune?

### Good Candidates
- Consistent output format needed
- Domain-specific terminology
- Style or tone requirements
- High volume of similar queries
- Need for specialized knowledge

### When NOT to Fine-tune
- You can solve it with prompting
- Limited training data (<100 examples)
- Task changes frequently
- Need real-time information (use RAG instead)

## Fine-tuning Methods

### Full Fine-tuning
- Update all model weights
- Best quality, highest cost
- Requires significant compute

### Parameter-Efficient Fine-tuning (PEFT)

#### LoRA (Low-Rank Adaptation)
- Freeze original weights
- Train small adapter layers
- Much cheaper, nearly same quality

```python
from peft import LoraConfig, get_peft_model, TaskType

lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 4.7M || all params: 7B || 0.067%
```

#### QLoRA
- LoRA + 4-bit quantization
- Fine-tune 7B model on single GPU
- Minimal quality loss

## Data Preparation

### Dataset Format
```json
[
    {
        "instruction": "Translate to French",
        "input": "Hello world",
        "output": "Bonjour le monde"
    },
    {
        "instruction": "Summarize",
        "input": "Long text here...",
        "output": "Short summary..."
    }
]
```

### Best Practices
- **Quality over quantity**: 100 high-quality examples > 1000 noisy ones
- **Diverse examples**: Cover edge cases
- **Consistent format**: Same structure for all examples
- **Validation set**: 10-20% of data for evaluation
- **Balance classes**: Equal representation if classification

## Training Process

### Basic Fine-tuning with Hugging Face
```python
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from datasets import load_dataset

# Load model and tokenizer
model_id = "meta-llama/Llama-2-7b-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

# Load dataset
dataset = load_dataset("json", data_files="data.json")

# Tokenize
def tokenize_function(examples):
    return tokenizer(examples["instruction"] + "\n" + examples["input"] + "\n" + examples["output"])

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_strategy="epoch"
)

# Train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
)

trainer.train()
```

### LoRA Fine-tuning Example
```python
from trl import SFTTrainer
from peft import LoraConfig

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    peft_config=lora_config,
    max_seq_length=512,
    dataset_text_field="text",
)

trainer.train()
```

## Training Tips

### Hyperparameters
- **Learning rate**: 2e-4 to 5e-4 for LoRA, 1e-5 to 5e-5 for full
- **Batch size**: As large as memory allows (use gradient accumulation)
- **Epochs**: 3-10 (watch for overfitting)
- **Warmup**: 10% of training steps

### Monitoring
- Track training loss
- Validate on held-out set
- Monitor for overfitting
- Save checkpoints regularly

## Evaluation

### Metrics
- **Perplexity**: Lower is better
- **BLEU/ROUGE**: For text generation
- **Exact match**: For Q&A
- **Human evaluation**: Most important

### Benchmarking
```python
# Test on held-out examples
for example in test_set:
    prompt = f"Instruction: {example['instruction']}\nInput: {example['input']}\nOutput:"
    generated = model.generate(prompt)
    # Compare with reference
```

## Deployment

### Merge LoRA Weights
```python
from peft import PeftModel

# Load base model
base_model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")

# Load fine-tuned adapter
model = PeftModel.from_pretrained(base_model, "./lora_adapter")

# Merge and save
model = model.merge_and_unload()
model.save_pretrained("./fine_tuned_model")
```

### Quantization for Deployment
```python
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

model = AutoModelForCausalLM.from_pretrained(
    "./fine_tuned_model",
    quantization_config=bnb_config,
    device_map="auto"
)
```

## Tools and Platforms

### Open Source
- **Hugging Face Transformers**: Core library
- **TRL**: Transformer Reinforcement Learning (SFT, PPO, DPO)
- **Axolotl**: Simplified fine-tuning framework
- **Unsloth**: Fast LoRA fine-tuning

### Cloud Platforms
- **Hugging Face AutoTrain**: No-code fine-tuning
- **Google Colab**: Free GPU access
- **Lambda Labs**: Affordable GPU instances
- **AWS/GCP/Azure**: Enterprise solutions

## Cost Estimates

### LoRA Fine-tuning (7B model)
- **Compute**: 1-2 A100 hours (~$1-2)
- **Storage**: ~14GB (base + adapter)
- **Time**: 2-4 hours

### Full Fine-tuning (7B model)
- **Compute**: 8-16 A100 hours (~$8-16)
- **Storage**: ~14GB
- **Time**: 8-16 hours

## Common Pitfalls

1. **Catastrophic forgetting**: Model forgets pre-trained knowledge
   - Solution: Use lower learning rates, more data

2. **Overfitting**: Model memorizes training data
   - Solution: More data, regularization, early stopping

3. **Mode collapse**: Model generates similar outputs
   - Solution: Diverse training data, temperature tuning

4. **Instability**: Training diverges
   - Solution: Lower learning rate, gradient clipping
