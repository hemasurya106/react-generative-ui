/**
 * react-generative-ui
 *
 * The single public entry point for the package.
 * Everything exported from here is available to consumers via:
 *   import { GenerativeRenderer, parseBlocks, ... } from 'react-generative-ui'
 */

// ── Core Component ────────────────────────────────────────────────────────────
export { GenerativeRenderer } from './GenerativeRenderer';

// ── Parser Utilities ──────────────────────────────────────────────────────────
export { parseBlocks, parseBlocksFromJSON, createStreamingParser } from './parser';

// ── Prompt Helpers ────────────────────────────────────────────────────────────
export { getSystemPromptInstruction, buildSystemPrompt } from './promptHelpers';

// ── Types (re-exported for consumers using TypeScript) ────────────────────────
export type {
  UIBlock,
  ComponentRegistry,
  RegistryEntry,
  GenerativeRendererProps,
  ParseOptions,
} from './types';
