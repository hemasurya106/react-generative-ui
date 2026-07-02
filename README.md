# react-generative-ui

> A plug-and-play React library for rendering AI-generated structured UI components from LLM output.

[![npm version](https://badge.fury.io/js/react-generative-ui.svg)](https://www.npmjs.com/package/react-generative-ui)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## What is this?

Traditional AI chat renders LLM output as plain Markdown text. `react-generative-ui` goes further — it lets the LLM decide **which React component to render** and **what data to pass into it**.

You define a registry of your own components. The LLM outputs JSON blocks specifying which component to render. This library handles the parsing and rendering.

```
LLM Output (text + JSON) → parseBlocks() → UIBlock[] → <GenerativeRenderer /> → Your React Components
```

---

## Installation

```bash
npm install react-generative-ui
```

---

## Quick Start

### 1. Define your components

```tsx
// These are YOUR components — style them however you want
const ProConTable = ({ pros, cons, title }) => (
  <div>
    <h3>{title}</h3>
    <ul>{pros.map(p => <li>✅ {p}</li>)}</ul>
    <ul>{cons.map(c => <li>❌ {c}</li>)}</ul>
  </div>
);

const StatCard = ({ title, value, subtitle }) => (
  <div>
    <p>{title}</p>
    <h2>{value}</h2>
    <small>{subtitle}</small>
  </div>
);
```

### 2. Create a registry

```tsx
import type { ComponentRegistry } from 'react-generative-ui';

const myRegistry: ComponentRegistry = {
  ProConTable,
  StatCard,
};
```

### 3. Prompt the LLM correctly

```tsx
import { buildSystemPrompt } from 'react-generative-ui';

const systemPrompt = buildSystemPrompt(myRegistry, {
  ProConTable: { title: 'optional', pros: ['item'], cons: ['item'] },
  StatCard: { title: 'Label', value: '42', subtitle: 'optional' },
});

// Use systemPrompt in your OpenAI / Groq / Gemini API call
```

### 4. Parse the LLM output

```tsx
import { parseBlocks } from 'react-generative-ui';

// Raw LLM output (mix of text and JSON blocks):
const llmOutput = `
Here is the comparison:
{"componentName": "ProConTable", "props": {"title": "React vs Vue", "pros": ["Huge ecosystem"], "cons": ["Learning curve"]}}
Hope that helps!
`;

const blocks = parseBlocks(llmOutput);
```

### 5. Render it

```tsx
import { GenerativeRenderer } from 'react-generative-ui';

function ChatMessage({ llmOutput }) {
  const blocks = parseBlocks(llmOutput);

  return (
    <GenerativeRenderer
      blocks={blocks}
      registry={myRegistry}
    />
  );
}
```

---

## API Reference

### `<GenerativeRenderer />`

The core rendering component.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `blocks` | `UIBlock[]` | ✅ | Array of parsed UI blocks |
| `registry` | `ComponentRegistry` | ✅ | Map of component names → React components |
| `fallback` | `React.FC<{ block: UIBlock }>` | ❌ | Rendered when a component isn't found in the registry |
| `debug` | `boolean` | ❌ | Logs warnings for unknown components (default: `true` in dev) |
| `className` | `string` | ❌ | Class name for the wrapper div |

---

### `parseBlocks(rawText, options?)`

Parses a raw LLM string (mixed text + JSON) into a `UIBlock[]` array.

```tsx
const blocks = parseBlocks(llmOutputString);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strict` | `boolean` | `false` | If `true`, silently drops invalid/malformed JSON blocks |

---

### `parseBlocksFromJSON(jsonString)`

Parses a pure JSON string (no mixed text) directly to `UIBlock[]`. Use this if your LLM returns structured JSON only.

```tsx
const blocks = parseBlocksFromJSON(`[{"componentName": "StatCard", "props": {...}}]`);
```

---

### `buildSystemPrompt(registry, schemas?, baseInstruction?)`

Generates a complete system prompt with component usage instructions.

```tsx
const prompt = buildSystemPrompt(myRegistry, {
  ProConTable: { pros: ['example'], cons: ['example'] },
});
```

---

### `getSystemPromptInstruction(registry, schemas?)`

Returns only the component instruction block (without a base assistant instruction). 
Useful if you want to prepend it to your own system prompt.

---

## The UIBlock Schema

The LLM should output JSON blocks in this format:

```json
{
  "componentName": "ProConTable",
  "props": {
    "title": "React vs Vue",
    "pros": ["Fast", "Flexible"],
    "cons": ["Boilerplate"]
  }
}
```

You can mix these inline with regular text and `parseBlocks()` will extract them.

---

## License

MIT © Hema Surya
