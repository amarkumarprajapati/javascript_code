# How AI Works

## Overview

Artificial Intelligence (AI) refers to systems designed to perform tasks that typically require human intelligence. Modern AI, particularly in the context of large language models (LLMs), is built on deep learning architectures.

## Neural Networks

### Basic Structure
- **Input Layer**: Receives raw data (text, images, numbers)
- **Hidden Layers**: Process information through weighted connections
- **Output Layer**: Produces the final prediction or result

### Key Components
- **Weights**: Parameters that determine the strength of connections between neurons
- **Biases**: Additional parameters that shift the activation function
- **Activation Functions**: Introduce non-linearity (ReLU, Sigmoid, Tanh, GELU)
- **Loss Function**: Measures how far the prediction is from the target
- **Optimizer**: Updates weights to minimize loss (Adam, SGD, RMSprop)

### Training Process
1. **Forward Pass**: Input data flows through the network to produce output
2. **Loss Calculation**: Compare output with expected result
3. **Backpropagation**: Calculate gradients of loss with respect to weights
4. **Weight Update**: Adjust weights using optimizer to reduce loss

## Transformers

### Attention Mechanism
The transformer architecture revolutionized AI by replacing recurrence with attention.

**Self-Attention Formula:**
```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

Where:
- Q (Query): What the model is looking for
- K (Key): What the model can offer
- V (Value): The actual information

### Architecture Components
- **Multi-Head Attention**: Multiple attention mechanisms running in parallel
- **Feed-Forward Networks**: Fully connected layers after attention
- **Layer Normalization**: Stabilizes training
- **Positional Encoding**: Adds position information (since transformers have no inherent sense of order)

## Large Language Models (LLMs)

### How They Work
LLMs are trained on massive text corpora to predict the next token (word/subword) in a sequence.

### Training Stages
1. **Pre-training**: Learn general language patterns from internet text
2. **Supervised Fine-tuning (SFT)**: Learn to follow instructions
3. **Reinforcement Learning from Human Feedback (RLHF)**: Align with human preferences
4. **Direct Preference Optimization (DPO)**: Alternative to RLHF

### Key Concepts
- **Tokenization**: Converting text into numerical tokens
- **Context Window**: Maximum number of tokens the model can process at once
- **Temperature**: Controls randomness in generation (0 = deterministic, 1 = creative)
- **Top-p (Nucleus Sampling)**: Sampling from top probability mass
- **Top-k**: Sampling from top k most likely tokens

### Scaling Laws
Performance improves predictably with:
- More parameters (model size)
- More training data
- More compute
