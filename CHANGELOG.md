# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-07-12

### Added

- **Brace-depth JSON scanner** (`scanJSONObjects`): Replaced the regex-based parser with a character-by-character brace-depth scanner that correctly handles nested objects, arrays of objects, and string escapes. The old regex would fail on any `props` value containing nested objects or arrays.
- **Streaming parser** (`createStreamingParser`): New exported function that returns a `{ push, flush }` interface for consuming LLM output token by token. Emits completed `UIBlock` objects as they close without waiting for the full string.
- **`onParseError` callback** in `ParseOptions`: Consumers can now receive malformed block text and the parse error via a callback, enabling logging/reporting without polluting the rendered UI.
- **`maxInputLength` guard** in `ParseOptions` (default: 1 MB): Prevents pathological-length input from causing excessive scanning work in `parseBlocks` and `createStreamingParser`.
- **`maxDepth` guard** in `ParseOptions` (default: 50): Limits brace nesting depth in the scanner to protect against adversarial or malformed input.
- **Optional Zod validation** via `RegistryEntry`: `ComponentRegistry` now accepts `{ component, schema }` objects alongside plain `React.FC` values (fully backward compatible). When a `schema` is present, `GenerativeRenderer` runs `schema.safeParse(block.props)` before rendering; on failure it falls back, logs a debug warning, or skips — never throws.
- **New `RegistryEntry` type** exported from the package for TypeScript consumers using schema validation.
- **17 default component templates** distributed via the CLI (copy, don't install):
  - `stat-card` — Metric card with trend arrow
  - `data-table` — Tabular data with headers
  - `key-value-list` — Label/value dashboard pairs
  - `pro-con-table` — Two-column pros/cons comparison
  - `comparison-table` — Feature grid comparison
  - `bar-chart` — Recharts bar chart *(requires `recharts`)*
  - `line-chart` — Recharts line chart *(requires `recharts`)*
  - `pie-chart` — Recharts pie/donut chart *(requires `recharts`)*
  - `alert-box` — info/success/warning/error message boxes
  - `badge` — Pill-style status tags
  - `progress-bar` — Animated completion bar
  - `timeline` — Vertical chronological layout
  - `accordion` — Expandable FAQ/content panels
  - `code-block` — Token-based syntax highlighting (no `dangerouslySetInnerHTML`)
  - `source-list` — Citation list with URL sanitization
  - `quick-reply-buttons` — Suggested action buttons with `onSelect` callback
  - `confirmation-card` — Approve/deny card with `onConfirm`/`onDeny` callbacks
- **CLI** (`npx react-generative-ui`):
  - `list` — Print all available component names with descriptions
  - `add <name...>` — Copy component `.tsx` and `.schema.ts` files into the project. Flags: `--dir`, `--overwrite`, `--yes`
  - `add --all` — Copy every default component
  - `init` — Scaffold a starter `src/generative-ui-registry.ts` with 4 wired components and a `buildSystemPrompt` example
- **`engines` field** in `package.json`: Requires Node.js ≥ 18.
- **`SECURITY.md`**: Responsible-disclosure contact and GitHub Security Advisory link.
- **Vitest test suite**: 15 tests covering parser robustness, streaming splits, error callbacks, depth/length guards, Zod validation in `GenerativeRenderer`, fallback/skip behavior, and prompt helper output.

### Changed

- `parseBlocks` default `strict` changed to `true` (was `false`). **Behaviour change**: malformed JSON candidate blocks are now silently dropped by default instead of being emitted as raw `Text` blocks. Pass `{ strict: false }` to restore the old lenient behaviour.
- `ComponentRegistry` type now accepts `React.FC<any> | RegistryEntry` entries (union). All existing plain-component registries continue to work unchanged.
- `ParseOptions` extended with `onParseError`, `maxInputLength`, and `maxDepth` fields (all optional, backward compatible).
- `tsup.config.ts` updated to compile both `src/index.ts` and `src/cli/index.ts`, outputting `.cjs` / `.js` extensions.
- `package.json` `files` field updated to include `dist/`, `templates/`, and `bin/`.

### Fixed

- Parser no longer fails on `props` containing nested JSON objects or arrays of objects (fixes the `DataTable` rows use-case).
- Malformed JSON candidates with a `"componentName"` key no longer leak raw brace-wrapped text into `Text` blocks by default.
- `GenerativeRenderer` validation failures no longer cause React render errors — always degrades gracefully via fallback/skip.

---

## [0.1.0] - 2026-06-01

### Added

- Initial release: `GenerativeRenderer`, `parseBlocks`, `parseBlocksFromJSON`, `buildSystemPrompt`, `getSystemPromptInstruction`.
- Core types: `UIBlock`, `ComponentRegistry`, `GenerativeRendererProps`, `ParseOptions`.
