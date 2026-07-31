# Security & Threat Model — react-generative-ui

`react-generative-ui` renders UI elements driven by outputs from external Large Language Models (LLMs). Because LLMs are non-deterministic and can potentially be manipulated via prompt injection, security is built directly into the parser and renderer core.

---

## 1. Threat Model & Mitigations

| Threat Vector | Potential Impact | Protection Mechanism |
|---|---|---|
| **Cross-Site Scripting (XSS)** | Execution of malicious JS via `javascript:` links in citations or dynamic href attributes. | `SourceList` enforces explicit protocol filtering. Only `http:` and `https:` schemes are rendered. `javascript:`, `data:`, `vbscript:`, and relative schemes are blocked. |
| **DOM Injection** | Injection of raw unescaped HTML elements into React components. | Zero reliance on `dangerouslySetInnerHTML`. All components render via standard React JSX element trees. `CodeBlock` uses tokenized string parsing. |
| **Resource Exhaustion (ReDoS / Stack Overflow)** | Crafted prompt injection returning thousands of unclosed braces `{ { { ...` to crash parsing memory. | `scanJSONObjects` enforces a configurable `maxDepth` limit (default: 50). Exceeding this limit immediately aborts brace traversal. |
| **Buffer Exhaustion** | Sending multi-megabyte text payloads to consume browser memory. | `parseBlocks` and `createStreamingParser` enforce `maxInputLength` (default: 1 MB / 1,048,576 characters). Payload sizes exceeding this threshold throw early. |
| **UI Crash / React Unmount** | LLM outputting malformed prop types (e.g. string passed to an array field) causing runtime exceptions. | Optional Zod integration (`withSchema`) executes `safeParse`. On validation failure, the renderer logs a warning in development and falls back without breaking the component tree. |

---

## 2. URL Protocol Sanitization (`SourceList`)

`SourceList` validates external citation links provided by the LLM before rendering standard anchor `<a href="...">` elements.

```ts
// Sanitization logic inside SourceList
function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url, 'https://dummy.base');
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    return null; // Reject javascript:, data:, vbscript:
  } catch {
    return null;
  }
}
```

---

## 3. Strict vs. Lenient Parser Modes

The `strict` option in `parseBlocks` controls how un-parseable JSON blocks are handled:

### Strict Mode (`strict: true`, Default)
- Candidate JSON blocks that fail `JSON.parse()` or lack a valid `"componentName"` string are silently dropped.
- Protects your UI layout from rendering raw, broken JSON snippets to end users.

### Lenient Mode (`strict: false`)
- Candidate JSON blocks that fail parsing are converted to standard `Text` blocks containing the raw unparsed string.
- Useful during prompt engineering / development to see exact raw output.

---

## 4. Reporting Vulnerabilities

If you discover a security vulnerability, please report it via private disclosure as outlined in [SECURITY.md](../SECURITY.md):
- Email: [jeffreyrufus2005@gmail.com](mailto:jeffreyrufus2005@gmail.com)
- GitHub Security Advisory: [Open Private Advisory](https://github.com/hemasurya106/react-generative-ui/security/advisories)
