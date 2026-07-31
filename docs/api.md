# API & TypeScript Reference Manual — react-generative-ui

Complete reference for all exported functions, components, helpers, and TypeScript interfaces in `react-generative-ui`.

---

## Exports Overview

```ts
import {
  // Core Component
  GenerativeRenderer,
  
  // Parser Utilities
  parseBlocks,
  parseBlocksFromJSON,
  createStreamingParser,
  
  // Prompt Helpers
  buildSystemPrompt,
  getSystemPromptInstruction,
  
  // Registry Helpers
  withSchema,
  
  // Pre-built Components & Schemas
  StatCard, StatCardSchema,
  DataTable, DataTableSchema,
  KeyValueList, KeyValueListSchema,
  ProConTable, ProConTableSchema,
  ComparisonTable, ComparisonTableSchema,
  BarChart, BarChartSchema,
  LineChart, LineChartSchema,
  PieChart, PieChartSchema,
  AlertBox, AlertBoxSchema,
  Badge, BadgeSchema,
  ProgressBar, ProgressBarSchema,
  Timeline, TimelineSchema,
  Accordion, AccordionSchema,
  CodeBlock, CodeBlockSchema,
  SourceList, SourceListSchema,
  QuickReplyButtons, QuickReplyButtonsSchema,
  ConfirmationCard, ConfirmationCardSchema,
} from 'react-generative-ui';
```

---

## 1. Core Component

### `<GenerativeRenderer />`

The primary React component that maps parsed `UIBlock[]` data to registered React components.

```tsx
interface GenerativeRendererProps {
  /** Array of UI blocks parsed from the LLM JSON output */
  blocks: UIBlock[];
  /** Map of componentName -> React.FC or RegistryEntry */
  registry: ComponentRegistry;
  /** Optional fallback component rendered on unknown components or validation failures */
  fallback?: React.FC<{ block: UIBlock }>;
  /** If true, logs warnings to console in dev mode (Default: true in dev, false in prod) */
  debug?: boolean;
  /** Optional outer container div className */
  className?: string;
}
```

---

## 2. Parser Utilities

### `parseBlocks(rawText: string, options?: ParseOptions): UIBlock[]`

Scans raw text containing embedded JSON blocks and extracts them as `UIBlock` objects. Surrounding prose is returned as `Text` blocks.

```ts
interface ParseOptions {
  /** If true (default), drops malformed JSON blocks silently */
  strict?: boolean;
  /** Callback fired when a candidate JSON block fails to parse */
  onParseError?: (rawBlock: string, error: Error) => void;
  /** Maximum input string length limit (default: 1MB / 1,048,576 chars) */
  maxInputLength?: number;
  /** Maximum brace nesting depth scanner limit (default: 50) */
  maxDepth?: number;
}
```

### `parseBlocksFromJSON(jsonString: string): UIBlock[]`

Parses pure JSON string arrays (e.g. `[{"componentName":"StatCard",...}]`) or `{ blocks: [...] }` objects into `UIBlock[]`.

### `createStreamingParser(options?: ParseOptions)`

Creates a streaming parser instance for processing token streams incrementally.

```ts
interface StreamingParser {
  /** Push incoming stream chunk string; returns any newly completed UIBlocks */
  push: (chunk: string) => UIBlock[];
  /** Drain remaining text buffer when stream ends; returns trailing UIBlocks */
  flush: () => UIBlock[];
}
```

---

## 3. Prompt Helpers

### `buildSystemPrompt(registry, componentSchemas?, baseInstruction?): string`

Generates a complete system prompt instructing the LLM on available components, JSON formats, and usage rules.

### `getSystemPromptInstruction(registry, componentSchemas?): string`

Generates only the component instruction fragment (without the base system instruction).

---

## 4. Helper Functions

### `withSchema<P>(component: React.FC<P>, schema: ZodSchema): RegistryEntry<P>`

Pairs a React component with a Zod schema for registration inside `ComponentRegistry`.

---

## 5. Core TypeScript Interfaces

```ts
export interface UIBlock {
  componentName: string;
  props: Record<string, unknown>;
  id?: string;
}

export interface RegistryEntry<P = any> {
  component: React.FC<P>;
  schema?: any;
}

export type ComponentRegistry = Record<
  string,
  React.FC<any> | RegistryEntry<any>
>;
```
