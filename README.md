# react-generative-ui

A plug-and-play React library for rendering AI-generated structured UI components from LLM JSON output.

---

## What's New in 0.3.0

Version 0.3.0 adds a third way to use the default component library: import components directly from the package (`import { StatCard } from 'react-generative-ui'`), with zero copying and zero extra setup. This sits alongside the existing Copy (`npx react-generative-ui add`) and Manual paths — nothing about either of those changes. See [CHANGELOG.md](./CHANGELOG.md) for the complete list, including one known limitation worth reading before you upgrade.

---

## Quick Start

### Option A — Install path (fastest, zero setup)

```bash
npm install react-generative-ui
```

```tsx
import { GenerativeRenderer, ComponentRegistry, withSchema } from 'react-generative-ui';
import { StatCard, StatCardSchema, AlertBox, AlertBoxSchema } from 'react-generative-ui';

const registry: ComponentRegistry = {
  StatCard: withSchema(StatCard, StatCardSchema),
  AlertBox: withSchema(AlertBox, AlertBoxSchema),
};
```

Use this when the default styling works for you and you don't need to edit component source.

### Option B — Copy path (`npx init`, 5 minutes to first demo)

```bash
# 1. Install the package
npm install react-generative-ui

# 2. Scaffold a starter registry and copy 4 components in one step
npx react-generative-ui init
npx react-generative-ui add stat-card pro-con-table alert-box data-table
```

Use this when you want to customize colors, spacing, or behavior — the CLI copies the actual component source into your repo, and from that point on it's just your file to edit freely.

### Option C — Manual (existing 0.1.0 usage, still works unchanged)

```tsx
import { parseBlocks, GenerativeRenderer } from 'react-generative-ui';
import { ProConTable } from './components/ProConTable';
import { StatCard } from './components/StatCard';

const registry = {
  ProConTable: ProConTable,
  StatCard: StatCard,
};

const raw = `Here's the analysis:
{"componentName":"ProConTable","props":{"pros":["Fast","Cheap"],"cons":["Limited"]}}`;

const blocks = parseBlocks(raw);

export default function App() {
  return <GenerativeRenderer blocks={blocks} registry={registry} />;
}
```

Use this when you want full control from the start, or your components don't fit the pattern of anything in the default set.

---

## Which path should I use?

| | Setup | You own the code? | Best for |
|---|---|---|---|
| **Install** | `import { StatCard } from 'react-generative-ui'` | No | Fastest start, default styling is fine |
| **Copy** | `npx react-generative-ui add stat-card` | Yes | Need to customize colors, layout, behavior |
| **Manual** | Write your own component | Yes, from scratch | Full control, don't want any of ours |

All three can be mixed freely in the same `ComponentRegistry` — nothing stops you from installing `StatCard` directly while writing your own `RevenueChart` from scratch.

---

## CLI Reference

```bash
npx react-generative-ui list
npx react-generative-ui add <component-name> [<name2> ...] [--dir <path>] [--overwrite] [--yes]
npx react-generative-ui add --all [--dir <path>] [--overwrite]
npx react-generative-ui init
```

### `list`

Prints all available component names with one-line descriptions.

### `add <name>`

Copies the `.tsx` and `.schema.ts` files for one or more components into your project.

- **`--dir <path>`** — Target directory (default: `./src/components/generative-ui/`)
- **`--overwrite` / `--yes` / `-y`** — Skip prompts and overwrite existing files (use in CI or with coding agents)
- **`--all`** — Copy every default component

```bash
npx react-generative-ui add stat-card alert-box --dir ./src/ui/generative
npx react-generative-ui add --all --yes
```

The CLI also prints a warning if optional peer dependencies (`zod`, `recharts`) are missing in your `package.json` — it never auto-installs anything.

### `init`

Scaffolds `src/generative-ui-registry.ts` with 4 starter components already wired up with schemas and a `buildSystemPrompt` example.

---

## Default Components

All 17 components are available through every path described above:

- **Install**: `import { ComponentName, ComponentNameSchema } from 'react-generative-ui'`
- **Copy**: `npx react-generative-ui add component-name` — copies the same source into your repo
- Component source lives in `templates/` in the published package either way; the Install path compiles it into the core bundle, the Copy path hands you the raw files

| Name | Export Name | Description |
|------|-------------|-------------|
| `stat-card` | `StatCard` | Metric card with value, label, and trend arrow |
| `data-table` | `DataTable` | Tabular data with clean headers |
| `key-value-list` | `KeyValueList` | Label/value dashboard pairs |
| `pro-con-table` | `ProConTable` | Two-column pros/cons comparison |
| `comparison-table` | `ComparisonTable` | Side-by-side feature grid |
| `bar-chart` | `BarChart` | Bar chart *(requires `recharts`)* |
| `line-chart` | `LineChart` | Line chart *(requires `recharts`)* |
| `pie-chart` | `PieChart` | Pie/donut chart *(requires `recharts`)* |
| `alert-box` | `AlertBox` | info / success / warning / error message boxes |
| `badge` | `Badge` | Pill-style status tags |
| `progress-bar` | `ProgressBar` | Animated completion bar |
| `timeline` | `Timeline` | Vertical chronological event layout |
| `accordion` | `Accordion` | Expandable FAQ/content panels |
| `code-block` | `CodeBlock` | Syntax-highlighted code (no `dangerouslySetInnerHTML`) |
| `source-list` | `SourceList` | Citation list with URL sanitization |
| `quick-reply-buttons` | `QuickReplyButtons` | Suggested action buttons |
| `confirmation-card` | `ConfirmationCard` | Approve/deny flow card |

Chart components (`BarChart`, `LineChart`, `PieChart`) require `npm install recharts` regardless of which path you use. If you import one without installing `recharts`, your bundler will fail at build time with a clear "Could not resolve 'recharts'" error naming exactly what's missing — not a silent runtime crash.

> **Note on bundle size:** as of 0.3.0, importing even a single component from the Install path currently bundles all 17 components' Zod schema definitions alongside it — a tree-shaking limitation being tracked for a future patch. Actual component *rendering* code is unaffected and tree-shakes correctly; this only adds a small amount of schema-definition overhead (a few KB) regardless of which one component you import. See [CHANGELOG.md](./CHANGELOG.md) for details. If bundle size is critical for your use case, the Copy path is unaffected by this, since you only get the files you explicitly request.

### The `withSchema()` helper

When using the Install path, `withSchema()` reduces registry boilerplate:

```tsx
import { withSchema, StatCard, StatCardSchema } from 'react-generative-ui';

const registry = {
  StatCard: withSchema(StatCard, StatCardSchema),
};
```

This is equivalent to writing `{ StatCard: { component: StatCard, schema: StatCardSchema } }` — purely a convenience, the object-literal form still works identically.

### Callback props pattern

`QuickReplyButtons` and `ConfirmationCard` need callbacks that can't come from the LLM. Wrap them in your registry:

```tsx
import { QuickReplyButtons } from 'react-generative-ui';
// or, if copied: import { QuickReplyButtons } from './components/generative-ui/QuickReplyButtons';

const QuickReplyConnected: React.FC<any> = (props) => (
  <QuickReplyButtons {...props} onSelect={(id) => handleUserSelection(id)} />
);

const registry = {
  QuickReplyButtons: QuickReplyConnected,
};
```

---

## Validation (Optional Zod Integration)

Install `zod` as a peer dependency:

```bash
npm install zod
```

Use the `{ component, schema }` registry form (or `withSchema()`) to enable validation:

```tsx
import { z } from 'zod';
import { GenerativeRenderer, ComponentRegistry, withSchema } from 'react-generative-ui';
import { StatCard, StatCardSchema } from 'react-generative-ui';

const registry: ComponentRegistry = {
  // Plain component — no validation (works exactly as in 0.1.0)
  ProConTable: MyProConTable,

  // With Zod schema — props are validated and coerced before rendering
  StatCard: withSchema(StatCard, StatCardSchema),
};
```

**On validation success** — the component receives Zod's parsed/coerced output (defaults applied, types coerced).

**On validation failure** — the renderer gracefully falls back, never throws:
1. Renders the `fallback` prop if provided.
2. Logs a `console.warn` with Zod error details if `debug` is on.
3. Otherwise skips the block silently.

---

## Streaming

Use `createStreamingParser` to process LLM output token by token without waiting for the full response:

```tsx
import { createStreamingParser } from 'react-generative-ui';

const parser = createStreamingParser({ strict: true });

// OpenAI / Anthropic SSE streaming loop:
for await (const chunk of streamResponse) {
  const text = chunk.choices[0]?.delta?.content ?? '';
  const newBlocks = parser.push(text);
  if (newBlocks.length > 0) {
    setBlocks((prev) => [...prev, ...newBlocks]);
  }
}

// When the stream ends, flush any trailing text:
const trailing = parser.flush();
if (trailing.length > 0) {
  setBlocks((prev) => [...prev, ...trailing]);
}
```

The streaming parser buffers incoming chunks, emits fully-closed JSON blocks as soon as their closing `}` is received, and holds partial JSON in the buffer for the next `push()`.

---

## Security

- **URL sanitization**: `SourceList` rejects any `href` that is not `http:` or `https:`, blocking `javascript:`, `data:`, and `vbscript:` schemes before rendering links.
- **No `dangerouslySetInnerHTML`**: All default components render via React elements, including `CodeBlock` which uses a custom token-based renderer.
- **Input length guard**: `parseBlocks` and `createStreamingParser` reject inputs larger than `maxInputLength` (default 1 MB).
- **Depth guard**: The brace-depth scanner limits nesting to `maxDepth` (default 50) to prevent adversarial input from causing performance issues.
- **Responsible disclosure**: See [SECURITY.md](./SECURITY.md).

---

## API Reference

### `parseBlocks(rawText, options?)`

```ts
parseBlocks(
  rawText: string,
  options?: ParseOptions
): UIBlock[]
```

Scans a raw LLM output string for embedded JSON blocks, returns an array of `UIBlock` objects. Text between blocks becomes `{ componentName: 'Text', props: { content } }`.

```ts
interface ParseOptions {
  strict?: boolean;           // default: true — drop malformed blocks silently
  onParseError?: (rawBlock: string, error: Error) => void;
  maxInputLength?: number;    // default: 1_048_576 (1 MB)
  maxDepth?: number;          // default: 50
}
```

### `parseBlocksFromJSON(jsonString)`

Parses a JSON array or `{ blocks: [...] }` object directly into `UIBlock[]`. Use when your LLM returns pure structured JSON.

### `createStreamingParser(options?)`

```ts
createStreamingParser(options?: ParseOptions): {
  push: (chunk: string) => UIBlock[];
  flush: () => UIBlock[];
}
```

### `buildSystemPrompt(registry, schemas?, baseInstruction?)`

```ts
buildSystemPrompt(
  registry: ComponentRegistry,
  componentSchemas?: Record<string, Record<string, unknown>>,
  baseInstruction?: string
): string
```

Builds a complete system prompt string. Example with schema hints:

```ts
import { buildSystemPrompt } from 'react-generative-ui';

const prompt = buildSystemPrompt(
  registry,
  {
    StatCard: { title: 'Revenue', value: '$12,400', change: '+8%', trend: 'up' },
    ProConTable: { title: 'Comparison', pros: ['Fast'], cons: ['Costly'] },
    AlertBox: { type: 'warning', title: 'Notice', message: 'Action required.' },
    DataTable: {
      title: 'Users',
      headers: ['Name', 'Role'],
      rows: [{ Name: 'Alice', Role: 'Admin' }],
    },
  }
);
```

### `getSystemPromptInstruction(registry, schemas?)`

Returns just the instruction section (without the base message), for composing your own system prompt.

### `<GenerativeRenderer />`

```tsx
<GenerativeRenderer
  blocks={UIBlock[]}
  registry={ComponentRegistry}
  fallback?: React.FC<{ block: UIBlock }>
  debug?: boolean
  className?: string
/>
```

### `withSchema(component, schema)`

```ts
withSchema<P>(
  component: React.FC<P>,
  schema: ZodType<P>
): RegistryEntry<P>
```

Convenience helper pairing a component with its schema for use in a `ComponentRegistry`. Equivalent to writing `{ component, schema }` directly.

---

## Types

```ts
import type {
  UIBlock,
  ComponentRegistry,
  RegistryEntry,
  GenerativeRendererProps,
  ParseOptions,
} from 'react-generative-ui';
```

---

## License

MIT © Hema Surya