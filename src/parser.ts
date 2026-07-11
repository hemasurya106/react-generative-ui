/**
 * react-generative-ui — Parser
 *
 * Converts a raw LLM output string (which mixes plain text and JSON blocks)
 * into an array of UIBlock objects ready for the renderer.
 */

import type { UIBlock, ParseOptions } from './types';

/**
 * Scans the raw text character by character to find candidate JSON objects
 * that contain a "componentName" key. It handles nested braces and ignores
 * braces inside string literals and escaped quotes.
 *
 * @param text - The raw input text.
 * @param maxDepth - The maximum brace nesting depth.
 * @returns An array of candidate JSON substrings with their start/end positions.
 */
function scanJSONObjects(
  text: string,
  maxDepth: number = 50
): Array<{ start: number; end: number; raw: string }> {
  const results: Array<{ start: number; end: number; raw: string }> = [];
  let braceDepth = 0;
  let inString = false;
  let startIdx = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (char === '\\') {
        // Skip next character (escaped character like \" or \\)
        i++;
      } else if (char === '"') {
        inString = false;
      }
    } else {
      if (char === '"') {
        inString = true;
      } else if (char === '{') {
        if (braceDepth === 0) {
          startIdx = i;
        }
        braceDepth++;
        if (braceDepth > maxDepth) {
          throw new Error(`Brace nesting depth exceeded maximum limit of ${maxDepth}`);
        }
      } else if (char === '}') {
        if (braceDepth > 0) {
          braceDepth--;
          if (braceDepth === 0) {
            if (startIdx !== -1) {
              const raw = text.slice(startIdx, i + 1);
              // Cheap pre-check for "componentName"
              if (/"componentName"\s*:/.test(raw)) {
                results.push({ start: startIdx, end: i + 1, raw });
              }
              startIdx = -1;
            }
          }
        }
      }
    }
  }

  return results;
}

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
  const {
    strict = true,
    onParseError,
    maxInputLength = 1024 * 1024,
    maxDepth = 50,
  } = options;

  if (rawText.length > maxInputLength) {
    throw new Error(`Input length ${rawText.length} exceeds maximum limit of ${maxInputLength}`);
  }

  const blocks: UIBlock[] = [];
  let lastIndex = 0;

  const candidates = scanJSONObjects(rawText, maxDepth);

  for (const candidate of candidates) {
    // Capture any plain text BEFORE this JSON block
    const textBefore = rawText.slice(lastIndex, candidate.start).trim();
    if (textBefore) {
      blocks.push({
        componentName: 'Text',
        props: { content: textBefore },
      });
    }

    // Parse the JSON block
    try {
      const parsed = JSON.parse(candidate.raw) as Partial<UIBlock>;

      if (parsed.componentName && typeof parsed.componentName === 'string') {
        blocks.push({
          componentName: parsed.componentName,
          props: parsed.props ?? {},
          id: parsed.id,
        });
      } else {
        const error = new Error('Parsed block is missing "componentName" string key');
        if (onParseError) {
          onParseError(candidate.raw, error);
        }
        if (!strict) {
          blocks.push({
            componentName: 'Text',
            props: { content: candidate.raw },
          });
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (onParseError) {
        onParseError(candidate.raw, error);
      }
      if (!strict) {
        // In lenient mode (strict: false), push a raw text block with the unparsed JSON
        blocks.push({
          componentName: 'Text',
          props: { content: candidate.raw },
        });
      }
      // In strict mode, silently skip malformed blocks
    }

    lastIndex = candidate.end;
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

/**
 * Creates a streaming parser instance that can accept chunks of LLM output
 * and yield fully parsed blocks as they are completed.
 *
 * @param options - Optional parse configuration.
 * @returns An object with push and flush methods.
 *
 * @example
 * const parser = createStreamingParser({ strict: true });
 * const blocks1 = parser.push("Some text before the block... ");
 * const blocks2 = parser.push('{"componentName":"StatCard","props":{"value":42}}');
 * const blocks3 = parser.flush();
 */
export function createStreamingParser(options: ParseOptions = {}): {
  push: (chunk: string) => UIBlock[];
  flush: () => UIBlock[];
} {
  const {
    strict = true,
    onParseError,
    maxInputLength = 1024 * 1024,
    maxDepth = 50,
  } = options;

  let buffer = '';

  const push = (chunk: string): UIBlock[] => {
    if (buffer.length + chunk.length > maxInputLength) {
      throw new Error(`Buffered input length exceeds maximum limit of ${maxInputLength}`);
    }
    buffer += chunk;

    const newBlocks: UIBlock[] = [];
    let candidates = scanJSONObjects(buffer, maxDepth);

    while (candidates.length > 0) {
      const candidate = candidates[0];

      // Grab any plain text before the candidate
      const textBefore = buffer.slice(0, candidate.start).trim();
      if (textBefore) {
        newBlocks.push({
          componentName: 'Text',
          props: { content: textBefore },
        });
      }

      // Try to parse the candidate
      try {
        const parsed = JSON.parse(candidate.raw) as Partial<UIBlock>;
        if (parsed.componentName && typeof parsed.componentName === 'string') {
          newBlocks.push({
            componentName: parsed.componentName,
            props: parsed.props ?? {},
            id: parsed.id,
          });
        } else {
          const error = new Error('Parsed block is missing "componentName" string key');
          if (onParseError) {
            onParseError(candidate.raw, error);
          }
          if (!strict) {
            newBlocks.push({
              componentName: 'Text',
              props: { content: candidate.raw },
            });
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (onParseError) {
          onParseError(candidate.raw, error);
        }
        if (!strict) {
          newBlocks.push({
            componentName: 'Text',
            props: { content: candidate.raw },
          });
        }
      }

      // Consume this candidate from buffer
      buffer = buffer.slice(candidate.end);

      // Re-scan remaining buffer
      candidates = scanJSONObjects(buffer, maxDepth);
    }

    return newBlocks;
  };

  const flush = (): UIBlock[] => {
    const finalBlocks: UIBlock[] = [];
    const text = buffer.trim();
    if (text) {
      finalBlocks.push({
        componentName: 'Text',
        props: { content: text },
      });
    }
    buffer = '';
    return finalBlocks;
  };

  return { push, flush };
}
