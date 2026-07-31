# Token-by-Token Streaming Guide — react-generative-ui

In conversational AI applications, LLMs return responses incrementally token-by-token over Server-Sent Events (SSE) or WebSockets. `react-generative-ui` provides a dedicated streaming parser (`createStreamingParser`) engineered to handle partial JSON fragments smoothly without breaking React renders.

---

## 1. How Streaming UI Rendering Works

When streaming, a JSON component block (e.g. `{"componentName":"StatCard","props":{"value":42}}`) arrives split across multiple network chunks:

```
Chunk 1: "Here is your summary: {"
Chunk 2: '"componentName":"StatCard",'
Chunk 3: '"props":{"title":"Users",'
Chunk 4: '"value":"14,200"}}'
```

### The Problem
If you attempt to call `JSON.parse()` on Chunk 1, Chunk 2, or Chunk 3 individually, the call throws a `SyntaxError`.

### The Solution (`createStreamingParser`)
The streaming parser buffers incoming string chunks internally. As chunks arrive:
1. It yields completed text strings as `{ componentName: "Text", props: { content: "..." } }`.
2. It holds partial JSON in the buffer until the closing brace `}` is received.
3. Once the brace scanner verifies a complete JSON block, it yields the parsed `UIBlock` immediately.

---

## 2. API Specification

```ts
import { createStreamingParser } from 'react-generative-ui';

const parser = createStreamingParser({
  strict: true,            // Drop invalid blocks silently (default: true)
  maxInputLength: 1048576, // Max allowed buffer length (default: 1 MB)
  maxDepth: 50,            // Max brace nesting level (default: 50)
});
```

### Methods

#### `push(chunk: string): UIBlock[]`
Appends `chunk` to the internal buffer and scans for completed blocks. Returns an array of **newly completed UIBlocks** found in this chunk (or an empty array if still waiting for closing braces).

#### `flush(): UIBlock[]`
Call `flush()` once when the LLM stream closes (`done === true`). Drains any remaining text inside the buffer and converts it into a final `Text` block.

---

## 3. Integration Examples

### Example A: OpenAI Fetch API with ReadableStream

```tsx
import { useState } from 'react';
import { createStreamingParser, GenerativeRenderer, UIBlock } from 'react-generative-ui';
import { registry, systemPrompt } from './generativeUIRegistry';

export default function StreamingOpenAIChat() {
  const [blocks, setBlocks] = useState<UIBlock[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleSend(userPrompt: string) {
    setIsStreaming(true);
    setBlocks([]);

    const parser = createStreamingParser({ strict: true });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      
      // Extract content deltas from SSE "data: {...}" lines
      const lines = chunkText.split('\n').filter((l) => l.startsWith('data: '));
      for (const line of lines) {
        const payload = line.replace(/^data:\s*/, '').trim();
        if (payload === '[DONE]') continue;

        try {
          const parsedJson = JSON.parse(payload);
          const deltaText = parsedJson.choices[0]?.delta?.content ?? '';

          if (deltaText) {
            const newlyCompleted = parser.push(deltaText);
            if (newlyCompleted.length > 0) {
              setBlocks((prev) => [...prev, ...newlyCompleted]);
            }
          }
        } catch {
          // Ignore incomplete SSE line fragments
        }
      }
    }

    // Flush trailing buffer
    const finalTrailingBlocks = parser.flush();
    if (finalTrailingBlocks.length > 0) {
      setBlocks((prev) => [...prev, ...finalTrailingBlocks]);
    }

    setIsStreaming(false);
  }

  return (
    <div className="p-4">
      <button onClick={() => handleSend('Analyze revenue trend')}>
        {isStreaming ? 'Streaming Response...' : 'Run Analysis'}
      </button>
      <GenerativeRenderer blocks={blocks} registry={registry} />
    </div>
  );
}
```

---

## 4. Best Practices for Streaming UI

1. **Avoid Re-instantiating Parser inside Loops**: Create a single `parser` instance per request turn before entering the stream reading loop.
2. **Always Call `flush()`**: Ensure `flush()` is invoked in a `finally` block or when `done === true` so trailing punctuation/sentences are not left in buffer.
3. **Set Key Uniqueness**: `GenerativeRenderer` automatically generates key IDs for blocks using `${block.componentName}-${index}` if `id` is missing.
