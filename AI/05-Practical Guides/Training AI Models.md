# Training AI Models From Scratch

## Overview

Training an AI model means teaching a neural network to perform a task by showing it examples and adjusting its parameters to minimize errors. This guide covers training from scratch, not just fine-tuning.

## Types of Training

### 1. Pre-training
- **What**: Train a base model on general data
- **When**: Building a new model from random initialization
- **Data**: Massive text corpus (web pages, books, code)
- **Cost**: Very high (thousands of GPUs, months)
- **Example**: GPT-4, LLaMA, Mistral

### 2. Fine-tuning
- **What**: Adapt a pre-trained model to specific task/data
- **When**: You have a pre-trained model and domain-specific data
- **Data**: Task-specific examples (hundreds to thousands)
- **Cost**: Low to medium (single GPU, hours)
- **Example**: Making a model that speaks like a doctor

### 3. Continued Pre-training
- **What**: Continue pre-training on new domain data
- **When**: Model needs knowledge in new domain
- **Data**: Large domain corpus (millions of tokens)
- **Cost**: Medium (few GPUs, days)
- **Example**: Training on medical literature

## Training From Scratch: Step by Step

### Step 1: Define the Task
- What should the model do? (classification, generation, etc.)
- What data do you need?
- How will you measure success?

### Step 2: Prepare Data
```python
# Example: Training a text classifier
# Data format
texts = ["I love this product", "Terrible experience", ...]
labels = [1, 0, ...]  # 1 = positive, 0 = negative
```

**Data Requirements:**
- **Minimum**: 1,000-10,000 examples for simple tasks
- **Good**: 10,000-100,000 examples
- **State-of-the-art**: Millions to billions of tokens

**Data Quality:**
- Clean, consistent labels
- Representative of real-world use
- No systematic biases
- Validation and test sets

### Step 3: Choose Model Architecture
```python
from transformers import AutoConfig

config = AutoConfig.from_pretrained("bert-base-uncased")
config.num_labels = 2  # Binary classification
model = AutoModelForSequenceClassification.from_config(config)
```

**Options:**
- **Start from scratch**: Random initialization, full control
- **Pre-trained backbone**: BERT, RoBERTa, etc.
- **Small models for testing**: DistilBERT, TinyBERT

### Step 4: Setup Training Infrastructure

```python
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
    logging_steps=100,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)
```

**Hardware:**
- **Small models (<100M)**: CPU possible, GPU recommended
- **Medium models (100M-1B)**: Single GPU (8-16GB VRAM)
- **Large models (1B-10B)**: Multi-GPU (A100/H100)
- **Very large (10B+)**: Cluster of GPUs

### Step 5: Train the Model
```python
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()
```

**What Happens During Training:**

1. **Forward Pass**: Model makes predictions
2. **Loss Calculation**: Compare predictions to actual labels
3. **Backward Pass**: Calculate gradients (how each weight contributed to error)
4. **Weight Update**: Adjust weights to reduce future error
5. **Repeat**: For all batches, for all epochs

### Step 6: Evaluate
```python
metrics = trainer.evaluate()
print(metrics)
```

**Metrics to Track:**
- **Loss**: Should decrease over time
- **Accuracy**: Percentage correct
- **Precision/Recall**: For imbalanced datasets
- **F1 Score**: Balance of precision and recall

### Step 7: Iterate
- If performance is poor:
  - Add more data
  - Try different architecture
  - Adjust hyperparameters
  - Train longer

## Training Deep Learning Models

### The Learning Process

```
Initial Random Weights
         ↓
    Forward Pass (make predictions)
         ↓
    Calculate Loss (how wrong?)
         ↓
    Backpropagation (calculate gradients)
         ↓
    Update Weights (gradient descent)
         ↓
    Repeat until convergence
```

### Key Concepts

#### Loss Functions
- **Mean Squared Error**: Regression (predicting numbers)
- **Cross-Entropy Loss**: Classification (categorizing)
- **CTC Loss**: Sequence labeling (speech, text)
- **Contrastive Loss**: Similarity learning

#### Optimizers
- **SGD**: Simple, works well with tuning
- **Adam**: Adaptive, works well out of the box
- **AdamW**: Adam with weight decay fix
- **Lion**: Newer, more efficient

#### Learning Rate
- **Too high**: Model overshoots, doesn't converge
- **Too low**: Training very slow, might get stuck
- **Schedule**: Start high, decrease over time

**Common Schedules:**
- **Linear**: Decrease linearly from max to 0
- **Cosine**: Decrease following cosine curve
- **Step**: Drop by factor at specific steps

## How Models Get Stronger

### 1. More Data
- LLMs trained on internet text (hundreds of billions of tokens)
- More diverse data = better generalization
- Data quality matters more than quantity

### 2. Bigger Models
- **Scaling Laws**: Performance improves predictably with size
- More parameters = more capacity to learn
- But requires more compute and data

### 3. Better Algorithms
- **Attention**: Transformers > RNNs
- **Normalization**: LayerNorm, RMSNorm
- **Optimization**: Adam > SGD for most cases
- **Architecture**: ResNet, Transformer variants

### 4. Longer Training
- Models continue improving with more training steps
- Diminishing returns eventually
- Need to balance with compute cost

### 5. Better Data Quality
- Filtering low-quality data
- De-duplication
- Curated datasets (FineWeb, The Pile)
- Synthetic data generation

### 6. Instruction Tuning
- Teach models to follow instructions
- Use human-written instruction-response pairs
- Improves usability dramatically

### 7. Alignment (RLHF, DPO)
- Align model behavior with human preferences
- Make models helpful, harmless, honest
- Critical for deployment

## Model Development Lifecycle

### Phase 1: Research
- New architecture or technique
- Small-scale experiments
- Proof of concept

### Phase 2: Pre-training
- Train on large dataset
- Takes weeks to months
- Costs millions of dollars for frontier models

### Phase 3: Evaluation
- Benchmark on standard tasks
- Identify strengths and weaknesses
- Safety evaluation

### Phase 4: Alignment
- Instruction tuning
- RLHF/DPO
- Safety fine-tuning

### Phase 5: Deployment
- Optimization (quantization, distillation)
- Serving infrastructure
- Monitoring and feedback

### Phase 6: Iteration
- Collect user feedback
- Retrain with new data
- Release updated versions

## How Models Get Updated

### 1. Continual Pre-training
- Add new data periodically
- Model learns new knowledge
- Risk: Catastrophic forgetting

### 2. Fine-tuning on New Data
- Regular fine-tuning with recent data
- Keeps model current
- Less risk than full retraining

### 3. RAG (Retrieval Augmented Generation)
- No model weights changed
- Retrieve current information at inference time
- Fast, flexible, always up-to-date

### 4. Model Merging
- Combine multiple models
- Average weights or use task vectors
- Get best of multiple models

### 5. Knowledge Distillation
- Train smaller model to mimic larger one
- Faster, cheaper to run
- Retain much of the capability

## Practical Training Tips

### Start Small
- Test with 100 examples first
- Use a small model
- Verify the pipeline works
- Scale up gradually

### Monitor Everything
```python
# Log metrics
- Training loss
- Validation loss
- Learning rate
- GPU utilization
- Gradient norms
```

### Avoid Overfitting
- Use validation set
- Early stopping
- Regularization (dropout, weight decay)
- Data augmentation

### Debugging Checklist
- [ ] Data loading works correctly
- [ ] Model can overfit on small batch (sanity check)
- [ ] Loss decreases on training set
- [ ] Validation loss decreases too
- [ ] Gradients are not vanishing/exploding
- [ ] Learning rate is appropriate

## Common Training Strategies

### Curriculum Learning
- Start with easy examples
- Gradually increase difficulty
- Faster convergence, better final performance

### Mixed Precision Training
- Use FP16/BF16 for most operations
- Keep master weights in FP32
- 2-3x faster, half the memory

### Gradient Accumulation
- Simulate larger batch sizes
- Accumulate gradients over multiple steps
- Useful when GPU memory is limited

### Checkpointing
- Save model periodically
- Resume from checkpoint if training crashes
- Keep best checkpoint based on validation

## Training vs Fine-tuning vs RAG

| Aspect | Training from Scratch | Fine-tuning | RAG |
|--------|----------------------|-------------|-----|
| Cost | Very High | Low | Low |
| Time | Months | Hours/Days | Real-time |
| Knowledge | Static | Static | Dynamic |
| Customization | Full | Task-specific | Retrieval-based |
| Use Case | New model | Specific task | Current information |

## Resources for Learning

### Courses
- CS231n (Stanford): Computer Vision
- CS224n (Stanford): NLP
- fast.ai: Practical Deep Learning

### Books
- "Deep Learning" by Goodfellow et al.
- "Natural Language Processing with Transformers"
- "Hands-On Machine Learning"

### Platforms
- Hugging Face: Models, datasets, tutorials
- Kaggle: Competitions and datasets
- Papers With Code: Latest research implementations
