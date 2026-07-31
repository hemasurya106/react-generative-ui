# Getting Started with react-generative-ui

This guide walks you through setting up `react-generative-ui` in a React application (Next.js, Vite, or Remix) connected to an LLM provider (OpenAI, Anthropic Claude, Google Gemini, or Ollama).

---

## 1. Installation

Install `react-generative-ui` via your preferred package manager:

```bash
# npm
npm install react-generative-ui

# yarn
yarn add react-generative-ui

# pnpm
pnpm add react-generative-ui
```

### Peer Dependencies
- **React**: >= 18.0.0 (Required)
- **Zod**: >= 3.22.0 (Optional — for runtime prop validation)
- **Recharts**: >= 2.10.0 (Optional — only if using `BarChart`, `LineChart`, or `PieChart`)

---

## 2. Setting Up Your Component Registry

Create a central registry file, for instance `src/generativeUIRegistry.ts`. This file maps component names expected from the LLM to React components and generates the system prompt.

```ts
import {
  ComponentRegistry,
  withSchema,
  StatCard, StatCardSchema,
  AlertBox, AlertBoxSchema,
  DataTable, DataTableSchema,
  buildSystemPrompt,
} from 'react-generative-ui';

// 1. Define Component Registry
export const registry: ComponentRegistry = {
  StatCard: withSchema(StatCard, StatCardSchema),
  AlertBox: withSchema(AlertBox, AlertBoxSchema),
  DataTable: withSchema(DataTable, DataTableSchema),
};

// 2. Generate System Prompt with Example Prop Payloads
export const systemPrompt = buildSystemPrompt(registry, {
  StatCard: { title: 'Revenue', value: '$48,200', change: '+12%', trend: 'up' },
  AlertBox: { type: 'warning', title: 'Low Inventory', message: '5 items remaining' },
  DataTable: { title: 'Users', headers: ['Name', 'Role'], rows: [{ Name: 'Alice', Role: 'Admin' }] },
});
```

---

## 3. Integrating with Your AI Backend

### Option A: Standard Fetch (Non-Streaming)

```tsx
import { useState } from 'react';
import { parseBlocks, GenerativeRenderer, UIBlock } from 'react-generative-ui';
import { registry, systemPrompt } from './generativeUIRegistry';

export default function ChatScreen() {
  const [blocks, setBlocks] = useState<UIBlock[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(userQuery: string) {
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery },
        ],
      }),
    });

    const data = await res.json();
    const aiText = data.choices[0].message.content;

    // Parse AI text into UI blocks
    const parsedBlocks = parseBlocks(aiText);
    setBlocks(parsedBlocks);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => sendMessage('Show monthly sales and alert me if stock is low')}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>

      <div className="mt-6 space-y-4">
        <GenerativeRenderer blocks={blocks} registry={registry} />
      </div>
    </div>
  );
}
```

---

## 4. Next Steps

- Explore the [17 Component Catalog](./components.md)
- Learn how to handle [Token-by-Token Streaming](./streaming.md)
- See how to copy component source files into your project with the [CLI Guide](./cli.md)
