/**
 * react-generative-ui — Prompt Helper Utilities
 *
 * These functions help developers correctly prompt their LLM
 * so it outputs the JSON format that GenerativeRenderer expects.
 */

import type { ComponentRegistry } from './types';

/**
 * Generates a system prompt instruction that teaches the LLM
 * how to output structured UIBlock JSON that your renderer can parse.
 *
 * @param registry - Your component registry (used to list available components).
 * @param componentSchemas - Optional: a map of component name → example props object.
 * @returns A string to prepend to your LLM system prompt.
 *
 * @example
 * const instruction = getSystemPromptInstruction(myRegistry, {
 *   ProConTable: { pros: ["example"], cons: ["example"], title: "optional" },
 *   StatCard: { title: "Label", value: "42", subtitle: "optional note" }
 * });
 *
 * // Then use it:
 * const systemPrompt = `You are a helpful assistant. ${instruction}`;
 */
export function getSystemPromptInstruction(
  registry: ComponentRegistry,
  componentSchemas?: Record<string, Record<string, unknown>>
): string {
  const availableComponents = Object.keys(registry).filter(k => k !== 'Text');

  const schemaLines = availableComponents
    .map((name) => {
      const schema = componentSchemas?.[name];
      if (schema) {
        return `  - ${name}: ${JSON.stringify({ componentName: name, props: schema })}`;
      }
      return `  - ${name}`;
    })
    .join('\n');

  return `
When you need to display structured data, statistics, comparisons, or visual information,
output a JSON block using the following format EXACTLY (do not wrap in markdown code fences):

{"componentName": "<ComponentName>", "props": { <component specific props> }}

Available components and their formats:
${schemaLines}

Rules:
1. Only use the component names listed above. Do NOT invent new names.
2. You can mix normal text and JSON blocks in a single response.
3. JSON blocks must be valid JSON — double-quote all keys and string values.
4. If you are unsure which component to use, just respond with normal text.
`.trim();
}

/**
 * A simple helper that wraps getSystemPromptInstruction with a complete,
 * ready-to-use system prompt for a general-purpose AI assistant.
 *
 * @param registry - Your component registry.
 * @param componentSchemas - Optional: example schemas for each component.
 * @param baseInstruction - Optional: your custom base instruction for the AI.
 */
export function buildSystemPrompt(
  registry: ComponentRegistry,
  componentSchemas?: Record<string, Record<string, unknown>>,
  baseInstruction = 'You are a helpful and knowledgeable AI assistant.'
): string {
  return `${baseInstruction}\n\n${getSystemPromptInstruction(registry, componentSchemas)}`;
}
