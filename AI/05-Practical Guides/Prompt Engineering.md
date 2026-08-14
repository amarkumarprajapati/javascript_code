# Prompt Engineering

## What is Prompt Engineering?

The art and science of crafting effective prompts to get desired outputs from LLMs.

## Basic Techniques

### Clear Instructions
```
Bad: "Write about dogs"
Good: "Write a 200-word informative article about the history of domestic dogs, including their origins and how they became companions to humans."
```

### Role Prompting
```
You are an expert Python developer with 10 years of experience.
You write clean, efficient, well-documented code.
```

### Few-Shot Learning
```python
prompt = """
Convert text to uppercase:

Input: hello
Output: HELLO

Input: world
Output: WORLD

Input: prompt engineering
Output:"""
```

### Chain of Thought (CoT)
```
Solve this step by step:

Question: If John has 5 apples and gives 2 to Mary, how many does he have left?

Step 1: John starts with 5 apples
Step 2: He gives 2 apples to Mary
Step 3: 5 - 2 = 3
Answer: John has 3 apples left
```

### Zero-Shot CoT
```
Solve this step by step: [question]
```

### Self-Consistency
Generate multiple reasoning paths, then take the majority vote.

## Advanced Techniques

### Tree of Thoughts
Explore multiple reasoning paths simultaneously.

### ReAct (Reason + Act)
```
Question: What is the capital of France?

Thought: I need to find the capital of France
Action: Search
Observation: The capital of France is Paris
Thought: I have the answer
Answer: Paris
```

### Constitutional AI
Define principles the model should follow.

```
You are a helpful assistant following these principles:
1. Be respectful and inclusive
2. Provide accurate information
3. Acknowledge uncertainty
```

### Prompt Chaining
Break complex tasks into sequential prompts.

```python
# Step 1: Extract key points
summary = llm("Summarize this article: [article]")

# Step 2: Generate questions
questions = llm(f"Generate 3 questions based on: {summary}")

# Step 3: Answer questions
answers = llm(f"Answer these questions: {questions}")
```

## Prompt Structure

### System Prompt
```
You are [role]. Your expertise is [domain].
You follow these rules:
1. [Rule 1]
2. [Rule 2]
3. [Rule 3]

Your response format:
- [Format specification]
```

### User Prompt
```
Task: [Clear description of what to do]
Input: [The data/content to process]
Context: [Relevant background information]
Constraints: [Limitations or requirements]
Output format: [How to structure the response]
```

## Best Practices

### Do's
- Be specific and explicit
- Provide examples (few-shot)
- Break complex tasks into steps
- Specify output format
- Use delimiters (```, ---, ###)
- Test with edge cases

### Don'ts
- Be vague or ambiguous
- Assume model knows your context
- Overload with too many instructions
- Use overly complex language
- Forget to specify constraints

## Temperature and Sampling

### Temperature
- **0.0 - 0.3**: Deterministic, focused (facts, code)
- **0.4 - 0.7**: Balanced (general tasks)
- **0.8 - 1.0**: Creative (brainstorming, stories)

### Top-p (Nucleus Sampling)
- **0.9**: Conservative, reliable
- **0.95**: Balanced
- **1.0**: Maximum diversity

### Top-k
- **10-20**: Good default
- **40+**: More creative
- **1**: Greedy decoding

## Prompt Templates

### Classification
```python
template = """
Classify the following text into one of these categories: {categories}

Text: {text}

Category:"""
```

### Extraction
```python
template = """
Extract the following information from the text:
- Name
- Date
- Location
- Amount

Text: {text}

Extracted Information:"""
```

### Summarization
```python
template = """
Summarize the following text in {num_sentences} sentences:

Text: {text}

Summary:"""
```

### Transformation
```python
template = """
Convert the following {input_format} to {output_format}:

Input: {input}

Output:"""
```

## Testing and Iteration

1. **Start simple**: Basic prompt first
2. **Test edge cases**: What if input is empty/unusual?
3. **A/B test**: Compare different prompts
4. **Measure quality**: Use evaluation metrics
5. **Iterate**: Refine based on results

## Common Patterns

### Persona Adoption
```
Act as a senior data scientist explaining [concept] to a beginner.
Use analogies and avoid jargon.
```

### Step-by-Step Reasoning
```
Let's solve this step by step:
1. First, [step 1]
2. Then, [step 2]
3. Finally, [step 3]
```

### Constraint Specification
```
Write a blog post with these constraints:
- Length: 500 words
- Tone: Professional but friendly
- Include: 3 examples
- SEO keywords: [list]
```

### Format Specification
```
Respond in JSON format:
{
    "summary": "...",
    "key_points": ["...", "..."],
    "sentiment": "positive/neutral/negative"
}
```

## Evaluation Framework

### LLM-as-Judge
Use an LLM to evaluate outputs.

```python
evaluator_prompt = """
Rate the following response on a scale of 1-10:
- Accuracy: Is the information correct?
- Relevance: Does it answer the question?
- Clarity: Is it well-written?

Response: {response}
Rating:"""
```

### Metrics
- **Perplexity**: Measure of uncertainty
- **BLEU**: N-gram overlap with reference
- **ROUGE**: Recall-oriented metrics
- **BERTScore**: Semantic similarity
- **Human evaluation**: Most reliable
