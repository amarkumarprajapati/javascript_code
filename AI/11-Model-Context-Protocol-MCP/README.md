# Phase 11: Model Context Protocol (MCP)

**Model Context Protocol (MCP)** is an open standard developed by Anthropic that allows AI assistants (Claude Desktop, IDE agents, custom web apps) to securely connect to local and remote data sources, developer tools, and enterprise databases.

---

## 🔌 1. The MCP Architecture

Instead of writing custom API wrappers for every LLM, MCP establishes a universal **Client-Server** interface:

```text
┌──────────────────────────────┐
│ MCP Host (Claude / App / IDE)│
└──────────────┬───────────────┘
               │ JSON-RPC Protocol (Stdio / SSE)
               ▼
┌──────────────────────────────┐
│      Your MCP Server         │
│  (Node.js / TypeScript)      │
├──────────────┬───────────────┤
│ Tools        │ Resources     │
│ (Executables)│ (Data/Files)  │
└──────┬───────┴───────┬───────┘
       ▼               ▼
  MongoDB / API    File System
```

---

## 🛠️ 2. Building a Custom TypeScript MCP Server

Install the official MCP TypeScript SDK:
```bash
npm install @modelcontextprotocol/sdk zod
```

Create an MCP server exposing MongoDB inspection tools:

```typescript
// mcp-server/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// 1. Initialize Server Instance
const server = new Server(
  {
    name: 'mongodb-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. Define Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query_user_stats',
        description: 'Get aggregated active user and subscription statistics from the database',
        inputSchema: {
          type: 'object',
          properties: {
            days: { type: 'number', description: 'Number of past days to analyze (default 30)' },
          },
        },
      },
    ],
  };
});

// 3. Handle Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'query_user_stats') {
    const days = (request.params.arguments?.days as number) || 30;
    
    // Simulate / execute real database aggregation
    const data = {
      period: `Last ${days} days`,
      activeUsers: 4820,
      newSignups: 310,
      mrrGrowth: '+12.4%',
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

// 4. Start Server over Standard Input/Output
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 MongoDB MCP Server running on stdio');
}

main().catch(console.error);
```

---

## 🧪 3. Integrating with AI Clients

Configure your MCP Server in your AI client settings (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mongodb-inspector": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

Now any AI model connected to that client can invoke your database inspection tool natively!

---

[⬅️ Back: Phase 10 - AI Agents](../10-AI-Agents/README.md) | [Next: Phase 12 - Local LLMs (Ollama) ➡️](../12-Local-LLMs-Ollama/README.md)
