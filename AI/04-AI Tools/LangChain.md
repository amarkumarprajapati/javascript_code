# LangChain

## What is LangChain?

LangChain is a framework for building applications with LLMs. It provides:
- **Chains**: Combine LLMs with other components
- **Agents**: Let LLMs decide which tools to use
- **Retrievers**: Connect LLMs to external data
- **Memory**: Maintain conversation state

## Installation
```bash
pip install langchain langchain-community
```

## Core Concepts

### LLMs vs Chat Models
```python
from langchain_community.llms import Ollama
from langchain_community.chat_models import ChatOllama

# LLM (completion)
llm = Ollama(model="llama3.2")
response = llm.invoke("Explain AI")

# Chat Model (messages)
chat = ChatOllama(model="llama3.2")
from langchain.schema import HumanMessage, SystemMessage
response = chat.invoke([
    SystemMessage(content="You are a helpful assistant"),
    HumanMessage(content="Explain AI")
])
```

### Prompt Templates
```python
from langchain.prompts import PromptTemplate, ChatPromptTemplate

# Simple template
template = "Translate {source_language} to {target_language}: {text}"
prompt = PromptTemplate(
    template=template,
    input_variables=["source_language", "target_language", "text"]
)
formatted = prompt.format(
    source_language="English",
    target_language="French",
    text="Hello"
)

# Chat template
chat_template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role} assistant."),
    ("human", "{question}")
])
```

### Chains
```python
from langchain.chains import LLMChain

# Simple chain
chain = LLMChain(llm=llm, prompt=prompt)
response = chain.invoke({
    "source_language": "English",
    "target_language": "French",
    "text": "Hello"
})
```

### Memory
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.save_context({"input": "Hi"}, {"output": "Hello!"})
memory.load_memory_variables({})
```

## Common Use Cases

### Document Q&A
```python
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)
```

### Summarization
```python
from langchain.chains import load_summarize_chain

chain = load_summarize_chain(llm, chain_type="map_reduce")
summary = chain.invoke(documents)
```

### Agents
```python
from langchain.agents import initialize_agent, AgentType

tools = [...]  # Define tools
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)
response = agent.run("What is the weather in Paris?")
```

## LCEL (LangChain Expression Language)

```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
```

## Best Practices
1. Use Chat Models instead of LLMs for conversations
2. Implement memory for stateful interactions
3. Use streaming for better UX
4. Cache expensive operations
5. Handle errors gracefully
