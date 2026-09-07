# RAG Implementation Guide

## Complete RAG System with Python

### Prerequisites
```bash
pip install langchain langchain-community chromadb sentence-transformers
```

### Full Implementation

```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.chat_models import ChatOllama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# 1. Load Documents
loader = DirectoryLoader('./knowledge_base', glob="**/*.txt")
documents = loader.load()

# 2. Split into Chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)
chunks = text_splitter.split_documents(documents)

# 3. Create Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-en-v1.5",
    model_kwargs={'device': 'cuda'},
    encode_kwargs={'normalize_embeddings': True}
)

# 4. Build Vector Store
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 5. Create Retriever
retriever = vectorstore.as_retriever(
    search_type="mmr",  # Maximal Marginal Relevance
    search_kwargs={"k": 5, "fetch_k": 10}
)

# 6. Setup LLM
llm = ChatOllama(model="llama3.2", temperature=0)

# 7. Create Prompt Template
template = """Use the following pieces of context to answer the question.
If you don't know the answer, just say you don't know. Don't make up answers.

Context: {context}

Question: {question}

Answer:"""

prompt = PromptTemplate(
    template=template,
    input_variables=["context", "question"]
)

# 8. Create Chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={"prompt": prompt}
)

# 9. Query
response = qa_chain.invoke({"query": "What is machine learning?"})
print(response['result'])
print("\nSources:")
for doc in response['source_documents']:
    print(f"- {doc.metadata['source']}")
```

## Advanced Features

### Hybrid Search (Vector + BM25)
```python
from langchain.retrievers import BM25Retriever, EnsembleRetriever

# Sparse retriever (BM25)
bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 5

# Dense retriever (Vector)
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# Combine with weights
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.3, 0.7]
)
```

### Re-ranking
```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import FlashrankRerank

compressor = FlashrankRerank()
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)
```

### Conversational RAG
```python
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

conversational_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory
)

# Chat with memory
response = conversational_chain.invoke({
    "question": "What did I just ask about?"
})
```

## Production Considerations

### Performance
- **Batch processing**: Index documents in batches
- **Caching**: Cache frequent queries
- **Async operations**: Use async for concurrent requests
- **Connection pooling**: Reuse database connections

### Scalability
- **Distributed vector stores**: Use Weaviate, Qdrant cluster
- **Sharding**: Split large collections
- **Load balancing**: Multiple retriever instances

### Monitoring
- Track query latency
- Monitor retrieval relevance
- Log LLM responses
- Measure user satisfaction

## Common Issues and Solutions

### Poor Retrieval Quality
- Improve chunk size and overlap
- Use better embedding model
- Try hybrid search
- Add metadata filtering

### Slow Response Time
- Use smaller embedding model
- Reduce number of retrieved chunks
- Cache embeddings
- Use faster vector database

### Irrelevant Context
- Add more training data
- Improve chunking strategy
- Use re-ranking
- Tune retrieval parameters
