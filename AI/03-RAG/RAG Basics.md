# RAG Basics

## What is RAG?

**Retrieval Augmented Generation (RAG)** is a technique that enhances LLM responses by retrieving relevant information from external knowledge sources before generating answers.

## Why RAG?

### Problems with LLMs Alone
- **Knowledge cutoff**: Training data is static
- **Hallucinations**: Models can generate incorrect information
- **No source attribution**: Can't cite where information came from
- **Domain specificity**: Poor performance on specialized topics

### RAG Benefits
- **Current information**: Use up-to-date data
- **Reduced hallucinations**: Ground responses in real documents
- **Source attribution**: Show where information came from
- **Domain expertise**: Focus on specific knowledge bases
- **Cost effective**: No need to fine-tune models

## How RAG Works

### Core Components

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Query     │────▶│  Retriever   │────▶│   Context   │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
┌─────────────┐     ┌──────────────┐            │
│   Response  │◀────│    LLM       │◀───────────┘
└─────────────┘     └──────────────┘
```

1. **Ingestion**: Documents are processed and indexed
2. **Retrieval**: Query finds relevant document chunks
3. **Augmentation**: Retrieved context is added to prompt
4. **Generation**: LLM generates response using context

## Vector Embeddings

### What Are They?
Vectors are numerical representations of text that capture semantic meaning.

### How They Work
- Text → Embedding Model → Vector Array
- Similar meanings = Similar vectors (close in space)
- Enables semantic search (not just keyword matching)

### Popular Embedding Models
- **OpenAI text-embedding-3-large**: 3072 dimensions
- **Cohere embed-english-v3.0**: 1024 dimensions
- **Sentence Transformers**: Open source, local deployment
- **BGE-large**: Open source, high quality

### Vector Databases
Store and search embeddings efficiently.

| Database | Type | Best For |
|----------|------|----------|
| Pinecone | Managed | Production, easy setup |
| Weaviate | Open source + managed | Self-hosted or cloud |
| ChromaDB | Open source | Development, local |
| Qdrant | Open source | Production, self-hosted |
| FAISS | Library | Research, batch processing |

## Chunking Strategies

### Why Chunking?
- LLMs have context limits
- Smaller chunks = more precise retrieval
- Too small = loses context
- Too large = includes irrelevant info

### Common Methods

**Fixed Size Chunking**
```python
chunks = [text[i:i+500] for i in range(0, len(text), 500)]
```

**Recursive Character Splitting**
- Splits on newlines, then spaces, then characters
- Preserves paragraph structure

**Token-based Chunking**
- Respects token limits
- More accurate for LLM context

**Semantic Chunking**
- Splits at topic boundaries
- Uses embeddings to detect boundaries

**Best Practice**: Use 256-1024 tokens per chunk with 10-20% overlap

## Retrieval Strategies

### Dense Retrieval
- Uses embedding similarity (cosine, dot product)
- Captures semantic meaning
- Most common in RAG

### Sparse Retrieval
- Uses keyword matching (BM25, TF-IDF)
- Good for exact terms
- Faster but less semantic

### Hybrid Retrieval
- Combine dense + sparse
- Best of both worlds
- Weighted fusion of scores

## RAG Pipeline Steps

### 1. Document Loading
```python
from langchain.document_loaders import DirectoryLoader, TextLoader

loader = DirectoryLoader('./docs', glob="**/*.txt", loader_cls=TextLoader)
documents = loader.load()
```

### 2. Splitting
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_documents(documents)
```

### 3. Embedding
```python
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-large-en-v1.5")
```

### 4. Indexing
```python
from langchain.vectorstores import Chroma

vectorstore = Chroma.from_documents(chunks, embeddings)
```

### 5. Retrieval
```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
relevant_docs = retriever.get_relevant_documents("What is RAG?")
```

## Evaluation Metrics

- **Context Precision**: Are retrieved chunks relevant?
- **Context Recall**: Were all relevant chunks retrieved?
- **Answer Faithfulness**: Is the answer grounded in context?
- **Answer Relevance**: Does the answer address the question?
