/**
 * react-generative-ui — Parser
 *
 * Converts a raw LLM output string (which mixes plain text and JSON blocks)
 * into an array of UIBlock objects ready for the renderer.
 */

import type { UIBlock, ParseOptions } from './types';

// ── Regex: finds JSON objects that have a "componentName" key ──────────────
// Matches { "componentName": "...", "props": { ... } } anywhere in a string
const COMPONENT_JSON_REGEX = /\{[^{}]*"componentName"\s*:\s*"[^"]+(?:[^{}]|\{[^{}]*\})*\}/g;

/**
 * Parses a raw LLM output string into an array of UIBlocks.
 *
 * The function scans the raw text for embedded JSON objects that contain
 * a "componentName" field. Everything in between is treated as plain text.
 *
 * @param rawText - The raw string output from the LLM.
 * @param options - Optional parse configuration.
 * @returns An array of UIBlock objects.
 *
 * @example
 * const raw = `Here is a comparison: {"componentName":"ProConTable","props":{"pros":["Fast"],"cons":["Costly"]}}`;
 * const blocks = parseBlocks(raw);
 * // => [
 * //   { componentName: "Text", props: { content: "Here is a comparison:" } },
 * //   { componentName: "ProConTable", props: { pros: ["Fast"], cons: ["Costly"] } }
 * // ]
 */
export function parseBlocks(rawText: string, options: ParseOptions = {}): UIBlock[] {
  const { strict = false } = options;
  const blocks: UIBlock[] = [];
  let lastIndex = 0;

  // Reset regex state
  COMPONENT_JSON_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = COMPONENT_JSON_REGEX.exec(rawText)) !== null) {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;

    // Capture any plain text BEFORE this JSON block
    const textBefore = rawText.slice(lastIndex, matchStart).trim();
    if (textBefore) {
      blocks.push({
        componentName: 'Text',
        props: { content: textBefore },
      });
    }

    // Parse the JSON block
    try {
      const parsed = JSON.parse(match[0]) as Partial<UIBlock>;

      if (parsed.componentName) {
        blocks.push({
          componentName: parsed.componentName,
          props: parsed.props ?? {},
          id: parsed.id,
        });
      }
    } catch (err) {
      if (!strict) {
        // In lenient mode, push a raw text block with the unparsed JSON
        blocks.push({
          componentName: 'Text',
          props: { content: match[0] },
        });
      }
      // In strict mode, silently skip malformed blocks
    }

    lastIndex = matchEnd;
  }

  // Capture any remaining plain text AFTER the last JSON block
  const textAfter = rawText.slice(lastIndex).trim();
  if (textAfter) {
    blocks.push({
      componentName: 'Text',
      props: { content: textAfter },
    });
  }

  return blocks;
}

/**
 * Parses a JSON array string (or a JSON object with a "blocks" key)
 * directly into an array of UIBlocks.
 *
 * Use this if your LLM is configured to return pure structured JSON (no mixed text).
 *
 * @param jsonString - A JSON string representing an array of UIBlock objects.
 * @returns An array of UIBlock objects, or an empty array on parse failure.
 *
 * @example
 * const jsonResponse = `[{"componentName":"StatCard","props":{"title":"Score","value":"92"}}]`;
 * const blocks = parseBlocksFromJSON(jsonResponse);
 */
export function parseBlocksFromJSON(jsonString: string): UIBlock[] {
  try {
    const parsed = JSON.parse(jsonString);

    // Handle both array format and { blocks: [...] } format
    const rawBlocks: unknown[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.blocks)
      ? parsed.blocks
      : [];

    return rawBlocks
      .filter(
        (b): b is UIBlock =>
          typeof b === 'object' &&
          b !== null &&
          typeof (b as UIBlock).componentName === 'string'
      )
      .map((b) => ({
        componentName: (b as UIBlock).componentName,
        props: (b as UIBlock).props ?? {},
        id: (b as UIBlock).id,
      }));
  } catch {
    console.warn('[react-generative-ui] Failed to parse JSON blocks string.');
    return [];
  }
}
