# Phase 9: Tool Calling & Function Calling

Tool calling transforms an LLM from a passive text generator into an **active decision engine** capable of invoking external APIs, querying MongoDB databases, executing calculations, or sending emails.

---

## ⚙️ 1. How Tool Calling Works

```text
User: "What's the status of order #ORD-9821?"
  │
  ▼ (1. LLM detects it needs external data)
Model returns: { name: "getOrderDetails", args: { orderId: "ORD-9821" } }
  │
  ▼ (2. Your Node.js backend executes real DB query)
Node.js: db.orders.findOne({ orderId: "ORD-9821" }) ──> Returns { status: "Shipped", eta: "Tomorrow" }
  │
  ▼ (3. Backend sends result back to LLM)
LLM reads tool response and generates final user answer:
"Your order #ORD-9821 has been shipped and is scheduled to arrive tomorrow!"
```

---

## 🛠️ 2. Implementing Tools with Vercel AI SDK & Zod

```typescript
// services/aiTools.ts
import { tool } from 'ai';
import { z } from 'zod';

export const customerTools = {
  // Tool 1: Lookup customer orders
  getOrderStatus: tool({
    description: 'Get real-time shipping and delivery status for a given order ID',
    parameters: z.object({
      orderId: z.string().describe('The unique alphanumeric order ID, e.g. ORD-1234'),
    }),
    execute: async ({ orderId }) => {
      // Real database / external API call
      console.log(`[Tool Executed] Fetching order ${orderId} from MongoDB...`);
      return {
        orderId,
        status: 'Out for delivery',
        carrier: 'FedEx',
        estimatedDelivery: 'Today by 5:00 PM',
        itemCount: 2,
      };
    },
  }),

  // Tool 2: Calculate refund amount
  calculateRefund: tool({
    description: 'Calculate eligible refund based on order total and return policy days',
    parameters: z.object({
      totalAmount: z.number().positive(),
      daysSinceDelivery: z.number().int(),
    }),
    execute: async ({ totalAmount, daysSinceDelivery }) => {
      const eligible = daysSinceDelivery <= 30;
      return {
        isEligible: eligible,
        refundAmount: eligible ? totalAmount : 0,
        fee: eligible ? 0 : 15,
      };
    },
  }),
};
```

---

## 🚀 3. Executing Tools in an API Route Handler

```typescript
// app/api/chat-tools/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { customerTools } from '@/services/aiTools';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: customerTools,
    maxSteps: 5, // Allows multi-step tool calls in a single turn
  });

  return result.toDataStreamResponse();
}
```

---

## 🔒 4. Best Practices & Security

1. **Parameter Validation**: Always validate every argument with Zod schemas.
2. **Access Control**: Ensure the logged-in user (`req.auth.userId`) has authorization to access requested order IDs or records.
3. **Idempotency**: Require explicit user confirmation for destructive actions (e.g. `deleteAccount`, `chargeCreditCard`).

---

[⬅️ Back: Phase 8 - RAG Full Pipeline](../08-RAG-Full-Pipeline/README.md) | [Next: Phase 10 - AI Agents ➡️](../10-AI-Agents/README.md)
