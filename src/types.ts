/**
 * react-generative-ui — Core Types
 * These are the contracts between the LLM output and the renderer.
 */

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
 * A map of component name strings to actual React components.
 * You define this in your app and pass it to <GenerativeRenderer />.
 *
 * @example
 * const myRegistry: ComponentRegistry = {
 *   ProConTable: MyProConTableComponent,
 *   StatCard: MyStatCardComponent,
 * };
 */
export type ComponentRegistry = Record<string, React.FC<any>>;

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
   * is not found in the registry. Defaults to null (silent skip).
   */
  fallback?: React.FC<{ block: UIBlock }>;
  /**
   * If true, logs a warning to the console when an unknown component is encountered.
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
   * If true, strips unknown/invalid blocks from the output array.
   * If false (default), invalid blocks are returned with an error prop.
   */
  strict?: boolean;
}
