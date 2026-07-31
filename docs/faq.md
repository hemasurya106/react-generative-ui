# Frequently Asked Questions (FAQ) — react-generative-ui

---

### Q: Does the LLM have to output JSON in a specific format?
**Yes.** The LLM must output embedded JSON objects containing a `"componentName"` key string and a `"props"` object. Use `buildSystemPrompt()` or `getSystemPromptInstruction()` to automatically instruct the LLM on this format.

---

### Q: What happens if the LLM outputs invalid JSON or malformed props?
In `strict: true` mode (the default), malformed JSON blocks are dropped silently. If Zod validation is configured via `withSchema`, prop type errors trigger your custom `fallback` component (if provided) or are safely skipped without throwing runtime exceptions.

---

### Q: Can I use this with Anthropic Claude, Google Gemini, or Ollama?
**Yes.** `react-generative-ui` is completely LLM-agnostic. As long as the model receives system prompt instructions to structure JSON blocks with `"componentName"`, any LLM text stream can be parsed.

---

### Q: Can I use my own custom components alongside default templates?
**Yes.** You can mix npm components, copied CLI components, and custom components in the same `ComponentRegistry`:

```tsx
const registry: ComponentRegistry = {
  StatCard: withSchema(StatCard, StatCardSchema), // NPM Component
  BarChart: MyCopiedBarChart,                    // CLI Copied & Modified Component
  CustomCard: MyCustomComponent,                 // Custom Component from scratch
};
```

---

### Q: Can I customize how plain text paragraphs are rendered?
**Yes.** Override the `"Text"` key in your registry:

```tsx
const registry: ComponentRegistry = {
  Text: ({ content }: { content: string }) => (
    <p className="my-custom-paragraph">{content}</p>
  ),
  StatCard: withSchema(StatCard, StatCardSchema),
};
```

---

### Q: Is Zod required?
**No.** Zod is an optional peer dependency. If omitted, props sent by the LLM pass directly into your components.

---

### Q: Is Recharts required?
**No.** Recharts is only required if you import chart components (`BarChart`, `LineChart`, `PieChart`). The other 14 components have zero chart dependencies.

---

### Q: What is the difference between `parseBlocks` and `parseBlocksFromJSON`?
- `parseBlocks(rawText)` handles **mixed response text** containing prose and embedded JSON objects.
- `parseBlocksFromJSON(jsonString)` handles **pure JSON arrays** or `{ blocks: [...] }` objects without surrounding prose.
