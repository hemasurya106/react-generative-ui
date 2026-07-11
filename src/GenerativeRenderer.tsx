/**
 * react-generative-ui — Core Renderer Component
 *
 * Takes an array of UIBlocks and a component registry,
 * dynamically renders the correct React component for each block.
 */

import React from 'react';
import type { GenerativeRendererProps, UIBlock, ComponentRegistry } from './types';

// ── Default Text Component ────────────────────────────────────────────────────
// Used for "Text" blocks (plain text between JSON components).
// Users can override this by adding a "Text" key to their registry.
const DefaultTextComponent: React.FC<{ content: string }> = ({ content }) => (
  <p style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>{content}</p>
);

// ── Core Renderer ─────────────────────────────────────────────────────────────

/**
 * <GenerativeRenderer /> — The core engine of react-generative-ui.
 *
 * Iterates through an array of UIBlocks, looks up each block's
 * componentName in the provided registry, and renders it with its props.
 *
 * @example
 * <GenerativeRenderer
 *   blocks={parsedBlocks}
 *   registry={{ ProConTable: MyProConTable, StatCard: MyStatCard }}
 * />
 */
export const GenerativeRenderer: React.FC<GenerativeRendererProps> = ({
  blocks,
  registry,
  fallback: FallbackComponent,
  debug,
  className,
}) => {
  // Default debug to true in dev, false in prod
  // Using a safe check that works without @types/node
  const shouldDebug =
    debug !== undefined
      ? debug
      : (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Merge user's registry with the built-in Text component
  // (user can override "Text" by providing their own in the registry)
  const fullRegistry: ComponentRegistry = {
    Text: DefaultTextComponent,
    ...registry,
  };

  return (
    <div className={className}>
      {blocks.map((block: UIBlock, index: number) => {
        const key = block.id ?? `${block.componentName}-${index}`;
        const entry = fullRegistry[block.componentName];

        // Unknown component: use fallback or skip
        if (!entry) {
          if (shouldDebug) {
            console.warn(
              `[react-generative-ui] Unknown component: "${block.componentName}". ` +
              `Available in registry: [${Object.keys(fullRegistry).join(', ')}]`
            );
          }

          if (FallbackComponent) {
            return <FallbackComponent key={key} block={block} />;
          }

          return null;
        }

        // Resolve component and optional schema
        let Component: React.FC<any>;
        let schema: any = undefined;

        if (typeof entry === 'object' && entry !== null && 'component' in entry) {
          Component = entry.component;
          schema = entry.schema;
        } else {
          Component = entry as React.FC<any>;
        }

        if (!Component) {
          if (shouldDebug) {
            console.warn(`[react-generative-ui] Component rendering function is missing for "${block.componentName}".`);
          }
          if (FallbackComponent) {
            return <FallbackComponent key={key} block={block} />;
          }
          return null;
        }

        // Optional Zod Schema validation
        let resolvedProps = block.props;
        if (schema && typeof schema.safeParse === 'function') {
          const result = schema.safeParse(block.props);
          if (!result.success) {
            if (shouldDebug) {
              console.warn(
                `[react-generative-ui] Validation failed for component "${block.componentName}":`,
                result.error
              );
            }
            if (FallbackComponent) {
              return <FallbackComponent key={key} block={block} />;
            }
            return null;
          }
          resolvedProps = result.data;
        }

        return (
          <Component key={key} {...resolvedProps} />
        );
      })}
    </div>
  );
};

GenerativeRenderer.displayName = 'GenerativeRenderer';
