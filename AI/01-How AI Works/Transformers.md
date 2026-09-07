# Transformers Explained

## What is a Transformer?

The Transformer is a deep learning architecture introduced in the paper "Attention Is All You Need" (Vaswani et al., 2017). It forms the foundation of all modern large language models like GPT, Claude, Gemini, LLaMA, and others.

## The Problem Transformers Solve

Before Transformers, sequence processing used:
- **RNNs (Recurrent Neural Networks)**: Process sequences one element at a time, maintaining a hidden state
  - Problem: Slow, can't parallelize, struggles with long sequences (vanishing gradients)
- **LSTMs/GRUs**: Improved RNNs with gating mechanisms
  - Problem: Still sequential, still limited in long-range dependencies

**Transformers solve this by processing entire sequences simultaneously using attention.**

## Core Architecture

### Input Embedding
```
Text → Tokenization → Token IDs → Embedding Vectors + Positional Encoding
```

### Encoder-Decoder Structure (Original)
- **Encoder**: Processes input sequence, creates representations
- **Decoder**: Generates output sequence based on encoder output

### Decoder-Only (Modern LLMs like GPT)
- Simplified: Just the decoder stack
- Trained to predict next token autoregressively

### Encoder-Only (BERT-style)
- Bidirectional context
- Used for understanding tasks (classification, NER, etc.)

## Attention Mechanism in Detail

### Scaled Dot-Product Attention

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

**Where:**
- **Q (Query)**: What the current token is looking for
- **K (Key)**: What each token can offer
- **V (Value)**: The actual content/information of each token
- **d_k**: Dimension of key vectors (used for scaling)

### Multi-Head Attention

Instead of performing one attention function, the model runs multiple attention "heads" in parallel:

```
MultiHead(Q, K, V) = Concat(head_1, head_2, ..., head_h) W^O
```

Each head learns to attend to different aspects:
- Head 1: Syntactic relationships
- Head 2: Semantic relationships
- Head 3: Positional relationships
- etc.

### Why Multiple Heads?
- Different heads capture different types of relationships
- Allows the model to jointly attend to information from different representation subspaces
- More expressive than single attention

## Complete Transformer Block

### 1. Multi-Head Attention
- Tokens attend to all other tokens
- Captures contextual relationships

### 2. Add & Norm (Residual Connection + Layer Normalization)
- `x = LayerNorm(x + MultiHeadAttention(x))`
- Helps gradients flow, stabilizes training

### 3. Feed-Forward Network
- Two linear transformations with ReLU/GELU activation
- Processes each position independently
- `FFN(x) = max(0, xW1 + b1)W2 + b2`

### 4. Add & Norm
- `x = LayerNorm(x + FFN(x))`

### Why Residual Connections?
- Allow training very deep networks (100+ layers)
- Gradient can flow directly through skip connections
- Prevent vanishing/exploding gradients

## Positional Encoding

Transformers process all tokens simultaneously, so they need to know token order.

### Sinusoidal Positional Encoding (Original)
```
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

### Learned Positional Embeddings (Modern)
- Trainable position embeddings added to token embeddings
- Used in BERT, GPT, and most modern models

### Rotary Position Embedding (RoPE)
- Rotates query/key vectors based on position
- Naturally extends to longer sequences
- Used in LLaMA, Mistral, Qwen

## Key Components Explained

### Layer Normalization
Normalizes activations across features:
- Stabilizes training
- Allows higher learning rates
- Reduces dependence on initialization

### Feed-Forward Networks
- Position-wise: same network applied to each position
- Expands dimension (4x) then projects back
- Adds non-linearity and capacity

### Masked Attention (Decoder)
- Prevents attending to future tokens
- Essential for autoregressive generation
- Creates causal (left-to-right) dependency

## How Transformers Scale

### Parameter Count
- **Small**: 100M - 1B parameters
- **Medium**: 1B - 10B parameters  
- **Large**: 10B - 100B parameters
- **Frontier**: 100B+ parameters

### Computational Cost
- **Time complexity**: O(n² · d) where n = sequence length, d = model dimension
- **Memory**: O(n²) for attention matrix
- **Limitation**: Long sequences are expensive

### Optimization Techniques
- **FlashAttention**: Memory-efficient attention (2-4x faster)
- **Multi-Query Attention**: Share key/value heads
- **Grouped-Query Attention**: Balance speed and quality
- **Sliding Window Attention**: Limit attention to recent tokens (Mistral)
- **Linear Attention**: Approximate attention for long sequences

## Transformer Variants

### Encoder-Decoder (T5, BART)
- Encoder processes input
- Decoder generates output
- Good for sequence-to-sequence tasks

### Decoder-Only (GPT, LLaMA, Mistral)
- Autoregressive generation
- Most common for chat/completion
- Trained on large text corpora

### Encoder-Only (BERT, RoBERTa)
- Bidirectional understanding
- Good for classification, NER
- Not for generation

## From Transformer to LLM

### Pre-training
1. **Tokenization**: Text → token IDs
2. **Forward pass**: Tokens → model → logits
3. **Loss calculation**: Cross-entropy between predicted and actual next token
4. **Backward pass**: Compute gradients
5. **Update**: Adjust weights with optimizer

### Scale
- GPT-3: 175B parameters, 570GB text
- LLaMA 2: 70B parameters, 2T tokens
- Modern models: 1T+ tokens, clusters of GPUs

### Result
- Learns language patterns, facts, reasoning
- Emergent abilities at scale (few-shot learning, chain of thought)
- General-purpose knowledge

## Why Transformers Dominate

1. **Parallelization**: Process entire sequence at once (unlike RNNs)
2. **Long-range dependencies**: Attention connects any two positions directly
3. **Scalable**: Performance improves predictably with scale
4. **Flexible**: Works for text, images, audio, video, proteins
5. **Transferable**: Pre-trained models adapt to many tasks

## Visual Summary

```
Input Tokens
    ↓
Embedding + Position
    ↓
┌─────────────────────────────────────┐
│  Transformer Block × N              │
│  ┌─────────────────────────────┐    │
│  │ Multi-Head Attention        │    │
│  │ (Query, Key, Value)         │    │
│  └─────────────────────────────┘    │
│  ↓                                  │
│  Add & Norm                         │
│  ↓                                  │
│  Feed-Forward Network               │
│  ↓                                  │
│  Add & Norm                         │
└─────────────────────────────────────┘
    ↓
Output Representations
    ↓
Language Model Head
    ↓
Token Probabilities
```

## Real-World Applications

| Model Type | Examples | Use Cases |
|------------|----------|-----------|
| Decoder-only | GPT-4, LLaMA, Mistral | Chat, completion, code |
| Encoder-only | BERT, RoBERTa | Classification, search |
| Encoder-decoder | T5, BART | Translation, summarization |
| Vision Transformer | ViT, CLIP | Image classification |
| Audio Transformer | Whisper | Speech recognition |
