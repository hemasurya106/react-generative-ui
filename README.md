# react-generative-ui

> **A plug-and-play React library that turns raw AI/LLM text output into beautiful, interactive UI components — automatically.**

[![npm version](https://img.shields.io/npm/v/react-generative-ui.svg)](https://www.npmjs.com/package/react-generative-ui)
[![license](https://img.shields.io/npm/l/react-generative-ui.svg)](./LICENSE)
[![node](https://img.shields.io/node/v/react-generative-ui.svg)](https://nodejs.org)

---

## Table of Contents

1. [What is this?](#1-what-is-this)
2. [How does it work?](#2-how-does-it-work-the-big-picture)
3. [Requirements](#3-requirements)
4. [Installation](#4-installation)
5. [Choose Your Path](#5-choose-your-path)
6. [Your First Integration](#6-your-first-integration--step-by-step)
7. [Core Concepts Explained](#7-core-concepts-explained)
8. [Prompting Your LLM Correctly](#8-prompting-your-llm-correctly)
9. [All 17 Default Components](#9-all-17-default-components)
10. [Streaming Support](#10-streaming-support)
11. [Zod Validation (Optional)](#11-zod-validation-optional)
12. [CLI Reference](#12-cli-reference)
13. [Bundle Size & Tree-Shaking](#13-bundle-size--tree-shaking)
14. [Security](#14-security)
15. [Full API Reference](#15-full-api-reference)
16. [TypeScript Types](#16-typescript-types)
17. [FAQ](#17-frequently-asked-questions)
18. [Version History](#18-version-history)

---

## 1. What is this?

When you build a chat app or AI assistant, your LLM (like OpenAI GPT, Anthropic Claude, or Google Gemini) returns **plain text**. That text is usually displayed as a wall of words.

`react-generative-ui` solves a specific problem:

> **"What if the AI could say 'show this as a chart' or 'display this as a table', and it actually happened?"**

Instead of showing raw text, your AI embeds special JSON snippets inside its response. This library detects those snippets and automatically renders them as React UI components — stat cards, charts, tables, timelines, and more.

**Example of what an AI might return:**

```
Here is your monthly performance summary:

{"componentName":"StatCard","props":{"title":"Monthly Revenue","value":"$48,200","change":"+12%","trend":"up"}}

And here is the detailed breakdown:

{"componentName":"DataTable","props":{"title":"Revenue by Region","headers":["Region","Revenue","Growth"],"rows":[{"Region":"North","Revenue":"$21,000","Growth":"+15%"},{"Region":"South","Revenue":"$27,200","Growth":"+9%"}]}}

Overall performance is strong this quarter!
```

`react-generative-ui` parses that mixed text + JSON output and renders:
- The plain sentences as `<p>` paragraphs
- The `StatCard` JSON as a beautiful metric card
- The `DataTable` JSON as a formatted table

**All automatically. Zero manual parsing in your app code.**

---

## 2. How does it work? (The Big Picture)

Here is the complete data flow in three steps:

```
┌─────────────────┐   system prompt    ┌──────────────────┐
│   Your App      │ ─────────────────▶ │  LLM (GPT etc.)  │
│   (React)       │                    │                  │
└─────────────────┘                    └────────┬─────────┘
                                                │ returns text + JSON
                                                ▼
                                      ┌──────────────────┐
                                      │  parseBlocks()   │  ← Step 1
                                      │  (text scanner)  │
                                      └────────┬─────────┘
                                                │ UIBlock[]
                                                ▼
                                      ┌──────────────────┐
                                      │ <GenerativeRend- │  ← Step 2
                                      │  erer blocks={…} │
                                      │  registry={…}    │
                                      └────────┬─────────┘
                                                │ React elements
                                                ▼
                                      ┌──────────────────┐
                                      │  Your UI renders │  ← Step 3
                                      │  StatCard, Table │
                                      │  Charts, etc.    │
                                      └──────────────────┘
```

**Step 1 — Parse:** `parseBlocks()` scans the AI's raw text response. It finds embedded JSON objects with a `"componentName"` key and extracts them as `UIBlock` objects. Everything else becomes plain `Text` blocks.

**Step 2 — Render:** `<GenerativeRenderer>` receives the blocks array and your registry (a map of component name → React component). For each block, it looks up the component and renders it with the block's props.

**Step 3 — Display:** React renders the final mix of paragraphs and rich UI components.

---

## 3. Requirements

| Requirement | Version |
|---|---|
| **Node.js** | ≥ 18 |
| **React** | ≥ 18 |
| **react-dom** | ≥ 18 |
| **zod** *(optional)* | ≥ 3.22 — only needed for prop validation |
| **recharts** *(optional)* | ≥ 2.10 — only needed for chart components |

---

## 4. Installation

```bash
# npm
npm install react-generative-ui

# yarn
yarn add react-generative-ui

# pnpm
pnpm add react-generative-ui
```

The core package has **zero required dependencies beyond React** itself.

---

## 5. Choose Your Path

There are three ways to use this library. Pick the one that matches your situation:

| | **Path A — Install** | **Path B — Copy** | **Path C — Manual** |
|---|---|---|---|
| **Setup time** | ~2 minutes | ~5 minutes | ~15 minutes |
| **You own the code?** | No | Yes | Yes |
| **Can customize styles?** | No (use CSS overrides) | ✅ Yes, full source | ✅ Yes, from scratch |
| **Best for** | Fastest start, default styling is fine | Need to tweak colors, layout, behavior | Full control, custom component shapes |

All three paths are **fully compatible**. You can mix them freely in one `ComponentRegistry`. For example: install `StatCard` from npm, copy `BarChart` to customize its colors, and write your own `RevenueChart` from scratch.

---

### Path A — Install (fastest, zero setup)

Import components directly from the npm package. No CLI needed.

```tsx
import { parseBlocks, GenerativeRenderer, ComponentRegistry, withSchema } from 'react-generative-ui';
import { StatCard, StatCardSchema, AlertBox, AlertBoxSchema } from 'react-generative-ui';

const registry: ComponentRegistry = {
  StatCard: withSchema(StatCard, StatCardSchema),
  AlertBox: withSchema(AlertBox, AlertBoxSchema),
};

const raw = `Your revenue: {"componentName":"StatCard","props":{"title":"Revenue","value":"$12k","trend":"up"}}`;
const blocks = parseBlocks(raw);

export default function App() {
  return <GenerativeRenderer blocks={blocks} registry={registry} />;
}
```

**When to use this:** When the default component styling works for you and you don't need to edit component source code.

---

### Path B — Copy (5 minutes, full customization)

Use the CLI to scaffold a starter registry and copy component source files directly into your project. Once copied, the files are yours to edit freely.

```bash
# Step 1: Install the package
npm install react-generative-ui

# Step 2: Scaffold a starter registry file in your project
npx react-generative-ui init

# Step 3: Copy the component source files you want
npx react-generative-ui add stat-card pro-con-table alert-box data-table
```

After running these commands:
- `src/generative-ui-registry.ts` is created with 4 components wired up
- `src/components/generative-ui/StatCard.tsx`, `StatCard.schema.ts`, etc. are added

You can then open any of those files and freely edit colors, spacing, layouts — anything you want.

**When to use this:** When you need to customize component appearance or behavior.

---

### Path C — Manual (full control from scratch)

Write your own components and register them directly.

```tsx
import { parseBlocks, GenerativeRenderer } from 'react-generative-ui';

const MyRevenueChart: React.FC<{ data: number[]; label: string }> = ({ data, label }) => (
  <div className="chart">
    <h3>{label}</h3>
    {/* your chart implementation */}
  </div>
);

const registry = {
  RevenueChart: MyRevenueChart,
};

const raw = `Here is your data: {"componentName":"RevenueChart","props":{"label":"Q4","data":[10,20,30]}}`;
const blocks = parseBlocks(raw);

export default function App() {
  return <GenerativeRenderer blocks={blocks} registry={registry} />;
}
```

**When to use this:** When none of the 17 default components fit your use case, or when you want complete control from day one.

---

## 6. Your First Integration — Step by Step

This is a complete, copy-paste example that works with any LLM API.

### Step 1: Install

```bash
npm install react-generative-ui
```

### Step 2: Create the registry file

Create `src/generativeUIRegistry.ts`:

```ts
import {
  ComponentRegistry,
  withSchema,
  StatCard, StatCardSchema,
  AlertBox, AlertBoxSchema,
  ProConTable, ProConTableSchema,
  DataTable, DataTableSchema,
  buildSystemPrompt,
} from 'react-generative-ui';

export const registry: ComponentRegistry = {
  StatCard: withSchema(StatCard, StatCardSchema),
  AlertBox: withSchema(AlertBox, AlertBoxSchema),
  ProConTable: withSchema(ProConTable, ProConTableSchema),
  DataTable: withSchema(DataTable, DataTableSchema),
};

// Generates a system prompt that teaches the LLM how to use your components
export const systemPrompt = buildSystemPrompt(registry, {
  StatCard: { title: 'Revenue', value: '$12,400', change: '+8%', trend: 'up' },
  AlertBox: { type: 'warning', title: 'Low Stock', message: 'Only 3 units left.' },
  ProConTable: { title: 'Comparison', pros: ['Fast', 'Cheap'], cons: ['Limited'] },
  DataTable: {
    title: 'Users',
    headers: ['Name', 'Role'],
    rows: [{ Name: 'Alice', Role: 'Admin' }],
  },
});
```

### Step 3: Call the LLM and parse the output

```tsx
import { useState } from 'react';
import { parseBlocks, GenerativeRenderer, UIBlock } from 'react-generative-ui';
import { registry, systemPrompt } from './generativeUIRegistry';

export default function ChatApp() {
  const [blocks, setBlocks] = useState<UIBlock[]>([]);
  const [loading, setLoading] = useState(false);

  async function askAI(userMessage: string) {
    setLoading(true);

    // Call your LLM API (OpenAI example)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt }, // teaches the LLM your components
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const rawText = data.choices[0].message.content;

    // Parse the raw AI text into UIBlock[]
    const parsedBlocks = parseBlocks(rawText);
    setBlocks(parsedBlocks);
    setLoading(false);
  }

  return (
    <div>
      <button onClick={() => askAI('Show me the revenue stats for this month')}>
        Ask AI
      </button>
      {loading && <p>Loading...</p>}
      {/* The renderer does the rest — no manual mapping needed */}
      <GenerativeRenderer blocks={blocks} registry={registry} />
    </div>
  );
}
```

That's all it takes. The `systemPrompt` teaches the LLM your registered components, and `parseBlocks` + `GenerativeRenderer` handle the rest.

---

## 7. Core Concepts Explained

### UIBlock — What the AI sends

A `UIBlock` is the fundamental unit of data. It's what the parser extracts from the AI's response. It always has this shape:

```ts
interface UIBlock {
  componentName: string;          // Must match a key in your registry
  props: Record<string, unknown>; // The data to pass to the component
  id?: string;                    // Optional React key (auto-generated if missing)
}
```

**Example UIBlock (raw JSON the AI outputs):**

```json
{
  "componentName": "StatCard",
  "props": {
    "title": "Monthly Users",
    "value": "14,200",
    "change": "+23%",
    "trend": "up"
  }
}
```

The AI embeds this JSON anywhere in its text response. The parser finds it, and the renderer maps `componentName` → your React component.

---

### ComponentRegistry — What you register

The registry is a JavaScript object that maps component name strings to React components (or `RegistryEntry` objects with schemas):

```ts
// Simple form — no validation
const registry = {
  StatCard: MyStatCard,
  DataTable: MyDataTable,
};

// With Zod schema — enables prop validation + type safety
const registry = {
  StatCard: { component: MyStatCard, schema: StatCardSchema },
  // Shorthand using withSchema():
  DataTable: withSchema(MyDataTable, DataTableSchema),
};
```

**Rules:**
- Keys must **exactly match** the `componentName` the LLM outputs (case-sensitive)
- Values can be a plain `React.FC` or a `{ component, schema }` object
- The built-in `"Text"` component is always available (for plain text between blocks); you can override it

---

### parseBlocks — Converting AI text to blocks

`parseBlocks()` is a smart text scanner. Feed it any string and it will:

1. Find all embedded JSON objects containing a `"componentName"` key
2. Return them as `UIBlock` objects
3. Wrap all surrounding text as `{ componentName: "Text", props: { content: "..." } }` blocks

```ts
import { parseBlocks } from 'react-generative-ui';

const raw = `
  Here is a summary:
  {"componentName":"StatCard","props":{"title":"Sales","value":"$5,200","trend":"up"}}
  Let me know if you need more details.
`;

const blocks = parseBlocks(raw);
// Returns:
// [
//   { componentName: "Text",     props: { content: "Here is a summary:" } },
//   { componentName: "StatCard", props: { title: "Sales", value: "$5,200", trend: "up" } },
//   { componentName: "Text",     props: { content: "Let me know if you need more details." } }
// ]
```

**Options:**

```ts
parseBlocks(rawText, {
  strict: true,            // (default) drop malformed JSON silently
                           // set false to render bad JSON as raw text instead
  maxInputLength: 1048576, // (default: 1 MB) reject inputs above this length
  maxDepth: 50,            // (default: 50) max brace nesting depth (security guard)
  onParseError: (raw, err) => {
    console.error('Failed to parse block:', raw, err);
  },
});
```

---

### GenerativeRenderer — Rendering the blocks

`<GenerativeRenderer>` is the core React component. It takes a `blocks` array and a `registry` and renders each block using the corresponding component.

```tsx
<GenerativeRenderer
  blocks={blocks}            // UIBlock[] from parseBlocks()
  registry={registry}        // Your ComponentRegistry
  fallback={MyFallback}      // Optional: rendered when a block's component is not found
  debug={true}               // Optional: log warnings (default: true in dev)
  className="my-chat-output" // Optional: CSS class on the outer <div>
/>
```

**How it handles unknown components:**
- If `debug` is `true`, it logs a `console.warn` naming the unknown component and listing available ones
- If you provided a `fallback` prop, it renders `<MyFallback block={block} />`
- Otherwise, it silently skips the block

**Custom fallback example:**

```tsx
const MyFallback: React.FC<{ block: UIBlock }> = ({ block }) => (
  <pre style={{ color: 'red' }}>
    Unknown component: {block.componentName}
    {JSON.stringify(block.props, null, 2)}
  </pre>
);

<GenerativeRenderer blocks={blocks} registry={registry} fallback={MyFallback} />
```

---

## 8. Prompting Your LLM Correctly

The LLM needs to know about your registered components to use them. `buildSystemPrompt()` generates that instruction automatically:

```ts
import { buildSystemPrompt } from 'react-generative-ui';

const systemPrompt = buildSystemPrompt(
  registry,
  // Optional: example schemas help the LLM understand what props to provide
  {
    StatCard: { title: 'Revenue', value: '$12,400', change: '+8%', trend: 'up' },
    ProConTable: { title: 'Comparison', pros: ['Fast', 'Cheap'], cons: ['Limited'] },
    AlertBox: { type: 'warning', title: 'Notice', message: 'Action required.' },
    DataTable: {
      title: 'Users',
      headers: ['Name', 'Role'],
      rows: [{ Name: 'Alice', Role: 'Admin' }],
    },
  },
  // Optional: your own base instruction
  'You are a data analyst assistant. Always use charts and tables when presenting data.'
);
```

**What the generated prompt looks like** (simplified):

```
You are a data analyst assistant. Always use charts and tables when presenting data.

When you need to display structured data, statistics, comparisons, or visual information,
output a JSON block using the following format EXACTLY (do not wrap in markdown code fences):

{"componentName": "<ComponentName>", "props": { <component specific props> }}

Available components and their formats:
  - StatCard: {"componentName":"StatCard","props":{"title":"Revenue","value":"$12,400","change":"+8%","trend":"up"}}
  - ProConTable: {"componentName":"ProConTable","props":{"title":"Comparison","pros":["Fast","Cheap"],"cons":["Limited"]}}
  ...

Rules:
1. Only use the component names listed above. Do NOT invent new names.
2. You can mix normal text and JSON blocks in a single response.
3. JSON blocks must be valid JSON — double-quote all keys and string values.
4. If you are unsure which component to use, just respond with normal text.
```

**Alternative — just the instruction part** (to compose into your own prompt):

```ts
import { getSystemPromptInstruction } from 'react-generative-ui';

const instruction = getSystemPromptInstruction(registry, schemas);
const myPrompt = `You are a financial advisor. Be concise.\n\n${instruction}`;
```

---

## 9. All 17 Default Components

All components are available through any of the three paths. Here is what each one does and what props it accepts:

### StatCard — Metric display card

Shows a single KPI with a value, label, optional trend indicator, and icon.

**LLM JSON:**
```json
{
  "componentName": "StatCard",
  "props": {
    "title": "Monthly Revenue",
    "value": "$48,200",
    "change": "+12%",
    "trend": "up",
    "icon": "💰"
  }
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | ✅ | Label displayed above the value |
| `value` | `string` | ✅ | The main metric value |
| `change` | `string` | | Change indicator (e.g. `+8%`) |
| `trend` | `"up" \| "down" \| "neutral"` | | Arrow direction and color |
| `icon` | `string` | | Emoji or text icon shown top-right |

---

### DataTable — Tabular data

Renders a table with headers and rows.

**LLM JSON:**
```json
{
  "componentName": "DataTable",
  "props": {
    "title": "Sales by Region",
    "headers": ["Region", "Revenue", "Growth"],
    "rows": [
      { "Region": "North", "Revenue": "$21k", "Growth": "+15%" },
      { "Region": "South", "Revenue": "$27k", "Growth": "+9%" }
    ]
  }
}
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `headers` | `string[]` | ✅ | Column header labels |
| `rows` | `Record<string, string>[]` | ✅ | Array of row objects (keys match headers) |
| `title` | `string` | | Optional table caption |

---

### KeyValueList — Label/value pairs

Shows a compact list of key–value pairs, ideal for metadata or configuration summaries.

**LLM JSON:**
```json
{
  "componentName": "KeyValueList",
  "props": {
    "title": "System Info",
    "items": [
      { "label": "Version", "value": "2.1.0" },
      { "label": "Status", "value": "Active" },
      { "label": "Uptime", "value": "99.9%" }
    ]
  }
}
```

---

### ProConTable — Pros and cons comparison

Two-column layout for pros and cons.

**LLM JSON:**
```json
{
  "componentName": "ProConTable",
  "props": {
    "title": "React vs Vue",
    "pros": ["Large ecosystem", "Great TypeScript support", "Flexible"],
    "cons": ["Steep learning curve", "Boilerplate-heavy", "No official routing"]
  }
}
```

---

### ComparisonTable — Feature grid

Side-by-side feature comparison across multiple options.

**LLM JSON:**
```json
{
  "componentName": "ComparisonTable",
  "props": {
    "title": "Plan Comparison",
    "features": ["Storage", "Users", "Support"],
    "options": [
      { "name": "Free", "values": ["5 GB", "1", "Email"] },
      { "name": "Pro", "values": ["100 GB", "10", "Priority"] }
    ]
  }
}
```

---

### BarChart — Bar chart *(requires `recharts`)*

Renders a vertical bar chart.

```bash
npm install recharts
```

**LLM JSON:**
```json
{
  "componentName": "BarChart",
  "props": {
    "title": "Monthly Sales",
    "data": [
      { "label": "Jan", "value": 4200 },
      { "label": "Feb", "value": 5800 },
      { "label": "Mar", "value": 3900 }
    ],
    "color": "#6366f1"
  }
}
```

---

### LineChart — Line chart *(requires `recharts`)*

Renders a line/area chart over time.

**LLM JSON:**
```json
{
  "componentName": "LineChart",
  "props": {
    "title": "User Growth",
    "data": [
      { "label": "Week 1", "value": 120 },
      { "label": "Week 2", "value": 340 },
      { "label": "Week 3", "value": 580 }
    ]
  }
}
```

---

### PieChart — Pie / donut chart *(requires `recharts`)*

Renders a pie chart showing proportions.

**LLM JSON:**
```json
{
  "componentName": "PieChart",
  "props": {
    "title": "Traffic Sources",
    "data": [
      { "label": "Organic", "value": 45 },
      { "label": "Paid", "value": 30 },
      { "label": "Referral", "value": 25 }
    ]
  }
}
```

---

### AlertBox — Status messages

Displays an info, success, warning, or error message box.

**LLM JSON:**
```json
{
  "componentName": "AlertBox",
  "props": {
    "type": "warning",
    "title": "Action Required",
    "message": "Your subscription expires in 3 days. Please renew to avoid service interruption."
  }
}
```

| `type` value | Color scheme |
|--------|--------------|
| `"info"` | Blue |
| `"success"` | Green |
| `"warning"` | Yellow/amber |
| `"error"` | Red |

---

### Badge — Pill tag

A compact inline label for statuses, categories, or labels.

**LLM JSON:**
```json
{
  "componentName": "Badge",
  "props": {
    "label": "Active",
    "variant": "success"
  }
}
```

---

### ProgressBar — Completion bar

Animated horizontal bar showing percentage completion.

**LLM JSON:**
```json
{
  "componentName": "ProgressBar",
  "props": {
    "label": "Onboarding Complete",
    "value": 72,
    "max": 100,
    "color": "#10b981"
  }
}
```

---

### Timeline — Chronological events

Vertical event timeline with dates and descriptions.

**LLM JSON:**
```json
{
  "componentName": "Timeline",
  "props": {
    "title": "Project Milestones",
    "events": [
      { "date": "Jan 2024", "title": "Project Kickoff", "description": "Team assembled and scope defined." },
      { "date": "Mar 2024", "title": "Beta Launch", "description": "First version shipped to early users." },
      { "date": "Jun 2024", "title": "GA Release", "description": "Publicly available on npm." }
    ]
  }
}
```

---

### Accordion — Expandable panels

Collapsible FAQ-style content sections.

**LLM JSON:**
```json
{
  "componentName": "Accordion",
  "props": {
    "items": [
      { "title": "What is generative UI?", "content": "It is a pattern where AI outputs drive UI rendering dynamically." },
      { "title": "Do I need Zod?", "content": "No, Zod is optional. It adds prop validation but is not required." }
    ]
  }
}
```

---

### CodeBlock — Syntax-highlighted code

Renders preformatted code with language label and copy button. Uses a custom token-based renderer — **no `dangerouslySetInnerHTML`**.

**LLM JSON:**
```json
{
  "componentName": "CodeBlock",
  "props": {
    "language": "typescript",
    "code": "const greet = (name: string) => `Hello, ${name}!`;"
  }
}
```

---

### SourceList — Citation links

Renders a numbered list of sources with clickable URLs. All URLs are sanitized — only `http:` and `https:` schemes are allowed.

**LLM JSON:**
```json
{
  "componentName": "SourceList",
  "props": {
    "title": "References",
    "sources": [
      { "label": "React Documentation", "url": "https://react.dev" },
      { "label": "MDN Web Docs", "url": "https://developer.mozilla.org" }
    ]
  }
}
```

---

### QuickReplyButtons — Suggested replies

Renders a row of suggestion buttons the user can click.

> ⚠️ **Requires a callback.** The `onSelect` handler cannot come from the LLM. Wrap this component in your registry:

```tsx
import { QuickReplyButtons } from 'react-generative-ui';

const QuickReplyConnected: React.FC<any> = (props) => (
  <QuickReplyButtons
    {...props}
    onSelect={(id) => {
      console.log('User selected:', id);
      // e.g., send id as the next user message
    }}
  />
);

const registry = {
  QuickReplyButtons: QuickReplyConnected,
};
```

**LLM JSON:**
```json
{
  "componentName": "QuickReplyButtons",
  "props": {
    "prompt": "What would you like to do next?",
    "options": [
      { "id": "export", "label": "Export as PDF" },
      { "id": "email", "label": "Send by Email" },
      { "id": "more", "label": "Show More Details" }
    ]
  }
}
```

---

### ConfirmationCard — Approve / deny flow

An interactive card with confirm and deny buttons, useful for agentic approval flows.

> ⚠️ **Requires callbacks.** Same pattern as `QuickReplyButtons`:

```tsx
import { ConfirmationCard } from 'react-generative-ui';

const ConfirmationConnected: React.FC<any> = (props) => (
  <ConfirmationCard
    {...props}
    onConfirm={() => console.log('Confirmed!')}
    onDeny={() => console.log('Denied!')}
  />
);

const registry = {
  ConfirmationCard: ConfirmationConnected,
};
```

**LLM JSON:**
```json
{
  "componentName": "ConfirmationCard",
  "props": {
    "title": "Delete Account?",
    "message": "This action is irreversible. All your data will be permanently deleted.",
    "confirmLabel": "Yes, Delete",
    "denyLabel": "Cancel"
  }
}
```

---

## 10. Streaming Support

When your LLM streams its response token by token, use `createStreamingParser` to process chunks in real time without waiting for the full response:

```tsx
import { useState } from 'react';
import { createStreamingParser, GenerativeRenderer, UIBlock } from 'react-generative-ui';
import { registry, systemPrompt } from './generativeUIRegistry';

export default function StreamingChat() {
  const [blocks, setBlocks] = useState<UIBlock[]>([]);

  async function ask(question: string) {
    const parser = createStreamingParser({ strict: true });
    setBlocks([]);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        stream: true, // enable streaming
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // Parse SSE — extract content from each "data: ..." line
      const lines = chunk.split('\n').filter(l => l.startsWith('data: ') && l !== 'data: [DONE]');
      for (const line of lines) {
        const json = JSON.parse(line.slice(6));
        const text = json.choices[0]?.delta?.content ?? '';
        if (text) {
          // push() returns any NEW complete blocks found in this chunk
          const newBlocks = parser.push(text);
          if (newBlocks.length > 0) {
            setBlocks(prev => [...prev, ...newBlocks]);
          }
        }
      }
    }

    // Flush any remaining text when the stream ends
    const trailing = parser.flush();
    if (trailing.length > 0) {
      setBlocks(prev => [...prev, ...trailing]);
    }
  }

  return (
    <div>
      <button onClick={() => ask('Summarize this month with charts')}>Ask</button>
      <GenerativeRenderer blocks={blocks} registry={registry} />
    </div>
  );
}
```

**How the streaming parser works:**
- `push(chunk)` appends the chunk to an internal buffer, scans for complete JSON objects, and returns any new `UIBlock[]` found
- Partial JSON (a block not yet fully streamed) stays in the buffer until it closes
- `flush()` drains any remaining plain text from the buffer at the end of the stream

---

## 11. Zod Validation (Optional)

Without validation, props from the LLM are passed directly to your component as-is. This is fine for prototyping, but in production the LLM might sometimes send props in the wrong format.

Zod validation adds a safety layer:

```bash
npm install zod
```

```tsx
import { withSchema, StatCard, StatCardSchema } from 'react-generative-ui';

// StatCardSchema is already a Zod schema — just use it
const registry = {
  StatCard: withSchema(StatCard, StatCardSchema),
};
```

**What happens with validation:**
- ✅ **Valid props** — Zod parses and coerces them (applying defaults), then passes the cleaned object to the component
- ❌ **Invalid props** — The renderer gracefully falls back:
  1. Renders your `fallback` prop if provided
  2. Logs a `console.warn` with Zod error details if `debug` is enabled
  3. Otherwise silently skips the block — **never throws**

**Writing your own Zod schema** for a custom component:

```ts
import { z } from 'zod';

const MyChartSchema = z.object({
  title: z.string(),
  data: z.array(z.object({ label: z.string(), value: z.number() })),
  color: z.string().optional().default('#6366f1'),
});

type MyChartProps = z.infer<typeof MyChartSchema>;

const MyChart: React.FC<MyChartProps> = ({ title, data, color }) => { /* ... */ };

const registry = {
  MyChart: withSchema(MyChart, MyChartSchema),
};
```

---

## 12. CLI Reference

The CLI is used only for **Path B (Copy)**. It copies component source files from the package into your project.

```bash
npx react-generative-ui <command> [options]
```

### `list`

Prints all 17 available component names with one-line descriptions.

```bash
npx react-generative-ui list
```

Output:
```
Available components:
  stat-card            Beautiful metric card displaying value, label, and trend indicators.
  data-table           Renders tabular data with clean headers and borders.
  key-value-list       A simple list displaying paired labels and values.
  pro-con-table        Two-column comparison layout for listing pros and cons.
  ...
```

---

### `add <name> [name2 ...]`

Copies the `.tsx` and `.schema.ts` source files for one or more components into your project.

```bash
npx react-generative-ui add stat-card
npx react-generative-ui add stat-card alert-box data-table pro-con-table
npx react-generative-ui add --all
```

**Flags:**

| Flag | Description |
|------|-------------|
| `--dir <path>` | Target directory. Default: `./src/components/generative-ui/` |
| `--overwrite` / `--yes` / `-y` | Skip confirmation prompts and overwrite existing files. Use in CI or with coding agents. |
| `--all` | Copy every default component at once |

**Examples:**
```bash
# Copy into a custom directory
npx react-generative-ui add stat-card alert-box --dir ./src/ui/generative

# Overwrite existing files without prompting (useful in scripts/CI)
npx react-generative-ui add --all --yes
```

The CLI will warn if optional peer dependencies (`zod`, `recharts`) are missing from your `package.json` — it **never auto-installs anything**.

---

### `init`

Scaffolds a starter `src/generative-ui-registry.ts` with 4 components already wired up, schemas included, and a `buildSystemPrompt` example ready to use.

```bash
npx react-generative-ui init
```

This is the fastest way to get a working registry file in your project.

---

## 13. Bundle Size & Tree-Shaking

### Standard import (simplest, recommended for most projects)

```tsx
import { StatCard, StatCardSchema } from 'react-generative-ui';
```

This works great. The only downside: if you import **any single component** from the package root, all 17 components' Zod schema definitions are pulled in (a few KB of overhead). Actual component *code* still tree-shakes correctly.

### Per-component subpath import (smallest possible bundle)

If you're only using one or two components and bundle size is critical, use the subpath form:

```tsx
// Only StatCard's code and schema are bundled — nothing else
import { StatCard, StatCardSchema } from 'react-generative-ui/components/stat-card';
import { AlertBox, AlertBoxSchema } from 'react-generative-ui/components/alert-box';

// withSchema still comes from the package root (it's tiny)
import { withSchema } from 'react-generative-ui';
```

**Available subpaths** (one per component):

| Component | Subpath |
|-----------|---------|
| `StatCard` | `react-generative-ui/components/stat-card` |
| `DataTable` | `react-generative-ui/components/data-table` |
| `KeyValueList` | `react-generative-ui/components/key-value-list` |
| `ProConTable` | `react-generative-ui/components/pro-con-table` |
| `ComparisonTable` | `react-generative-ui/components/comparison-table` |
| `BarChart` | `react-generative-ui/components/bar-chart` |
| `LineChart` | `react-generative-ui/components/line-chart` |
| `PieChart` | `react-generative-ui/components/pie-chart` |
| `AlertBox` | `react-generative-ui/components/alert-box` |
| `Badge` | `react-generative-ui/components/badge` |
| `ProgressBar` | `react-generative-ui/components/progress-bar` |
| `Timeline` | `react-generative-ui/components/timeline` |
| `Accordion` | `react-generative-ui/components/accordion` |
| `CodeBlock` | `react-generative-ui/components/code-block` |
| `SourceList` | `react-generative-ui/components/source-list` |
| `QuickReplyButtons` | `react-generative-ui/components/quick-reply-buttons` |
| `ConfirmationCard` | `react-generative-ui/components/confirmation-card` |

---

## 14. Security

This library handles user-facing output from untrusted AI models. Security is treated as a first-class concern:

| Protection | Details |
|---|---|
| **URL sanitization** | `SourceList` rejects any `href` that is not `http:` or `https:`. Blocks `javascript:`, `data:`, `vbscript:` — all XSS vectors. |
| **No `dangerouslySetInnerHTML`** | All 17 default components render via React elements. `CodeBlock` uses a custom token-based renderer. |
| **Input length guard** | `parseBlocks` and `createStreamingParser` reject inputs larger than `maxInputLength` (default 1 MB). |
| **Depth guard** | The brace-depth scanner limits nesting to `maxDepth` (default 50) to prevent adversarial input from causing performance issues. |
| **Graceful degradation** | Validation failures never throw. The renderer always falls back or skips cleanly. |

For responsible disclosure, see [SECURITY.md](./SECURITY.md).

---

## 15. Full API Reference

### `parseBlocks(rawText, options?)`

Scans a raw LLM output string for embedded JSON blocks. Returns an array of `UIBlock` objects.

```ts
parseBlocks(
  rawText: string,
  options?: {
    strict?: boolean;           // default: true — silently drop malformed blocks
    onParseError?: (rawBlock: string, error: Error) => void;
    maxInputLength?: number;    // default: 1_048_576 (1 MB)
    maxDepth?: number;          // default: 50
  }
): UIBlock[]
```

---

### `parseBlocksFromJSON(jsonString)`

Parses a pure JSON array (or `{ blocks: [...] }` object) directly into `UIBlock[]`. Use when your LLM is configured to return only structured JSON with no surrounding text.

```ts
parseBlocksFromJSON(jsonString: string): UIBlock[]

// Example
const blocks = parseBlocksFromJSON(
  '[{"componentName":"StatCard","props":{"title":"Score","value":"92"}}]'
);
```

---

### `createStreamingParser(options?)`

Returns a `{ push, flush }` streaming parser for processing LLM output token by token.

```ts
createStreamingParser(options?: ParseOptions): {
  push: (chunk: string) => UIBlock[];  // Call for each incoming chunk
  flush: () => UIBlock[];              // Call once when the stream ends
}
```

---

### `buildSystemPrompt(registry, schemas?, baseInstruction?)`

Builds a complete, ready-to-use system prompt string for your LLM.

```ts
buildSystemPrompt(
  registry: ComponentRegistry,
  componentSchemas?: Record<string, Record<string, unknown>>,
  baseInstruction?: string   // default: "You are a helpful and knowledgeable AI assistant."
): string
```

---

### `getSystemPromptInstruction(registry, schemas?)`

Returns just the component instruction section of the prompt (without the base message). Use this when you want to compose your own system prompt manually.

```ts
getSystemPromptInstruction(
  registry: ComponentRegistry,
  componentSchemas?: Record<string, Record<string, unknown>>
): string
```

---

### `withSchema(component, schema)`

Convenience helper that pairs a React component with its Zod schema into a `RegistryEntry`. Equivalent to writing `{ component, schema }` directly.

```ts
withSchema<P>(
  component: React.FC<P>,
  schema: ZodType<P>
): RegistryEntry<P>
```

---

### `<GenerativeRenderer />`

The core rendering component.

```tsx
<GenerativeRenderer
  blocks={UIBlock[]}                      // required
  registry={ComponentRegistry}            // required
  fallback?: React.FC<{ block: UIBlock }> // optional
  debug?: boolean                         // default: true in dev, false in prod
  className?: string                      // optional outer div className
/>
```

---

## 16. TypeScript Types

All types are exported from the package root:

```ts
import type {
  UIBlock,                 // A single parsed block from the AI output
  ComponentRegistry,       // Map of name → React.FC or RegistryEntry
  RegistryEntry,           // { component: React.FC, schema?: ZodSchema }
  GenerativeRendererProps, // Props for <GenerativeRenderer />
  ParseOptions,            // Options for parseBlocks / createStreamingParser
} from 'react-generative-ui';
```

**Full type definitions:**

```ts
interface UIBlock {
  componentName: string;
  props: Record<string, unknown>;
  id?: string;
}

interface RegistryEntry<P = any> {
  component: React.FC<P>;
  schema?: any;
}

type ComponentRegistry = Record<string, React.FC<any> | RegistryEntry<any>>;

interface GenerativeRendererProps {
  blocks: UIBlock[];
  registry: ComponentRegistry;
  fallback?: React.FC<{ block: UIBlock }>;
  debug?: boolean;
  className?: string;
}

interface ParseOptions {
  strict?: boolean;
  onParseError?: (rawBlock: string, error: Error) => void;
  maxInputLength?: number;
  maxDepth?: number;
}
```

---

## 17. Frequently Asked Questions

**Q: Does the LLM have to output JSON in a specific format?**

Yes. The LLM must embed raw JSON objects (no markdown code fences) with a `"componentName"` key. The `buildSystemPrompt()` function generates the exact instruction to teach the LLM this format.

---

**Q: What happens if the LLM outputs invalid JSON?**

In `strict: true` mode (the default), malformed blocks are silently dropped. In `strict: false` mode, they are rendered as plain text. You can use `onParseError` to log or track failures.

---

**Q: Can I use this with Anthropic Claude or Google Gemini?**

Yes. The library is LLM-agnostic — it works with any LLM that can follow the system prompt instructions. Just feed whatever text/streaming response you get into `parseBlocks()` or `createStreamingParser()`.

---

**Q: Can I use my own custom components alongside the default ones?**

Absolutely. Mix them freely in the same `ComponentRegistry`:

```tsx
const registry = {
  StatCard: withSchema(StatCard, StatCardSchema), // from npm
  BarChart: MyCopiedBarChart,                    // copied and customized
  RevenueChart: MyCustomChart,                   // written from scratch
};
```

---

**Q: Can I override the default `Text` component?**

Yes. Add a `"Text"` key to your registry:

```tsx
const registry = {
  Text: ({ content }: { content: string }) => (
    <p className="my-custom-text">{content}</p>
  ),
  StatCard: withSchema(StatCard, StatCardSchema),
};
```

---

**Q: Do I need Zod?**

No. Zod is completely optional. Without it, the LLM's props are passed directly to your component as-is. Add it only when you want runtime type validation and coercion.

---

**Q: Do I need recharts?**

Only if you use `BarChart`, `LineChart`, or `PieChart`. The other 14 components have no chart dependency.

---

**Q: Will importing one component pull in all component code?**

When using the standard package root import, all 17 components' Zod *schema definitions* are bundled (a few KB), but each component's actual *render code* tree-shakes correctly. If you need the absolute smallest bundle, use [subpath imports](#13-bundle-size--tree-shaking).

---

**Q: Can I use this without TypeScript?**

Yes. The package ships both ESM and CJS builds with `.d.ts` type declarations, but TypeScript is not required to use it.

---

**Q: What is the difference between `parseBlocks` and `parseBlocksFromJSON`?**

- `parseBlocks` handles mixed text — e.g., "Here is your data: `{...json...}` and some more text." It scans for JSON embedded within prose.
- `parseBlocksFromJSON` expects a **pure JSON string** — an array `[{...}, {...}]` or `{ blocks: [...] }` object — with no surrounding text.

---

## 18. Version History

See [CHANGELOG.md](./CHANGELOG.md) for the complete version history.

| Version | Highlights |
|---------|------------|
| **0.4.1** | Current release |
| **0.4.0** | Per-component subpath exports for minimal bundle size; resolves tree-shaking limitation from 0.3.0 |
| **0.3.0** | Direct component exports (`import { StatCard } from 'react-generative-ui'`); `withSchema()` helper; unified component manifest |
| **0.2.0** | Brace-depth JSON scanner; streaming parser; Zod validation; 17 default templates; CLI (`list`, `add`, `init`); security guards |
| **0.1.0** | Initial release: `GenerativeRenderer`, `parseBlocks`, `parseBlocksFromJSON`, `buildSystemPrompt` |

---

## License

MIT © Hema Surya

---

> **Built for the era of generative interfaces.** If you find this useful, consider starring the [repo on GitHub](https://github.com/hemasurya106/react-generative-ui) ⭐
