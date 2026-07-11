/**
 * react-generative-ui — Core Types
 * These are the contracts between the LLM output and the renderer.
 */

import React from 'react';

/**
 * A single UI block returned by the AI.
 * The LLM should output an array of these in its JSON response.
 *
 * @example
 * {"componentName": "ProConTable", "props": {"pros": ["Fast"], "cons": ["Costly"]}}
 */
export interface UIBlock {
  /** The exact name of the component to render (must match a key in your registry). */
  componentName: string;
  /** The props to pass directly into the component. */
  props: Record<string, unknown>;
  /** Optional: a unique key for React. Auto-generated if not provided. */
  id?: string;
}

/**
 * A registry entry containing a component and an optional schema.
 */
export interface RegistryEntry<P = any> {
  /** The React component to render. */
  component: React.FC<P>;
  /** Optional schema for prop validation (e.g. Zod schema). */
  schema?: any;
}

/**
 * A map of component name strings to actual React components or RegistryEntry objects.
 * You define this in your app and pass it to <GenerativeRenderer />.
 *
 * @example
 * const myRegistry: ComponentRegistry = {
 *   ProConTable: MyProConTableComponent,
 *   StatCard: {
 *     component: MyStatCardComponent,
 *     schema: StatCardSchema
 *   },
 * };
 */
export type ComponentRegistry = Record<
  string,
  React.FC<any> | RegistryEntry<any>
>;

/**
 * Props for the <GenerativeRenderer /> component.
 */
export interface GenerativeRendererProps {
  /** Array of UI blocks parsed from the LLM JSON output. */
  blocks: UIBlock[];
  /** Your map of component name → React component. */
  registry: ComponentRegistry;
  /**
   * Optional fallback component to render if a block's componentName
   * is not found in the registry or if validation fails.
   */
  fallback?: React.FC<{ block: UIBlock }>;
  /**
   * If true, logs a warning to the console when an unknown component
   * or a validation error is encountered.
   * Defaults to true in development, false in production.
   */
  debug?: boolean;
  /** Optional className for the outer container div. */
  className?: string;
}

/**
 * Options for the parseBlocks() utility function.
 */
export interface ParseOptions {
  /**
   * If true (default), strips unknown/invalid blocks from the output array.
   * If false, invalid blocks are returned as Text blocks containing raw text.
   */
  strict?: boolean;
  /**
   * Optional callback function that fires when a candidate block fails to parse.
   */
  onParseError?: (rawBlock: string, error: Error) => void;
  /**
   * Optional maximum allowed character length of the raw input text.
   * Defaults to 1MB (1,048,576 characters).
   */
  maxInputLength?: number;
  /**
   * Optional maximum allowed brace nesting depth in the scanner.
   * Defaults to 50.
   */
  maxDepth?: number;
}
