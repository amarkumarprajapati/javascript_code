# Phase 10: Autonomous AI Agents

An **AI Agent** is a system where an LLM is given a goal, a set of tools, and an iterative loop (ReAct: Reason + Act) to solve multi-step problems autonomously.

---

## 🔁 1. The Agentic Loop (ReAct Pattern)

```text
       ┌───────────────────────────────┐
       │     Goal / User Prompt        │
       └──────────────┬────────────────┘
                      ▼
         ┌─────────────────────────┐
    ┌───>│ Thought / Plan Step     │<───┐
    │    └────────────┬────────────┘    │
    │                 ▼                 │
    │    ┌─────────────────────────┐    │
    │    │ Action (Select Tool)    │    │
    │    └────────────┬────────────┘    │
    │                 ▼                 │
    │    ┌─────────────────────────┐    │
    │    │ Observation (Tool Output│────┘
    │    └────────────┬────────────┘
    │                 ▼
    │         Is Goal Complete?
    │          ├── No  ──> Loop again
    └──────────└── Yes ──> Deliver Final Answer
```

---

## 🤖 2. Building a ReAct Agent in Node.js / TypeScript

```typescript
// services/agentRunner.ts
import { generateText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define Agent Tools
const agentTools = {
  searchCustomer: tool({
    description: 'Find customer account ID by email',
    parameters: z.object({ email: z.string().email() }),
    execute: async ({ email }) => {
      return { customerId: 'CUST-772', name: 'Alex Johnson', email };
    },
  }),
  getUnpaidInvoices: tool({
    description: 'Fetch list of pending unpaid invoices for customer ID',
    parameters: z.object({ customerId: z.string() }),
    execute: async ({ customerId }) => {
      return [
        { invoiceId: 'INV-101', amount: 150.0, dueDate: '2026-08-15', status: 'OVERDUE' },
        { invoiceId: 'INV-108', amount: 85.5, dueDate: '2026-09-01', status: 'PENDING' },
      ];
    },
  }),
};

export async function runSupportAgent(userGoal: string) {
  console.log(`\n🚀 Starting Agent for Goal: "${userGoal}"`);

  const response = await generateText({
    model: openai('gpt-4o'),
    tools: agentTools,
    maxSteps: 8, // Allow up to 8 reasoning & execution cycles
    system: `You are an autonomous customer billing agent.
Break down complex requests into logical steps.
Query customer details first, fetch related records, compute totals, and summarize your findings clearly.`,
    prompt: userGoal,
    onStepFinish({ text, toolCalls, toolResults }) {
      if (toolCalls.length > 0) {
        console.log(`[Tool Call]`, toolCalls.map(tc => `${tc.toolName}(${JSON.stringify(tc.args)})`));
      }
      if (toolResults.length > 0) {
        console.log(`[Tool Result]`, toolResults);
      }
    },
  });

  console.log(`\n✅ Final Agent Answer:\n`, response.text);
  return response.text;
}

// Example Execution
runSupportAgent('Find all overdue invoices for alex@example.com and calculate the total amount due.');
```

---

## 🧠 3. Agent Memory & State Management

Agents need memory to maintain context over long workflows:
1. **Short-Term Memory**: Conversation history array passed into each loop iteration.
2. **Long-Term Memory**: Persistent chat history and profile state saved in MongoDB.
3. **Semantic Memory**: Storing previous agent decisions or documentation in Vector Search for recall.

---

[⬅️ Back: Phase 9 - Tool Calling](../09-Tool-Calling/README.md) | [Next: Phase 11 - Model Context Protocol (MCP) ➡️](../11-Model-Context-Protocol-MCP/README.md)
