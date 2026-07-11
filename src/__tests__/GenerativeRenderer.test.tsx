// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { GenerativeRenderer } from '../GenerativeRenderer';
import { z } from 'zod';

afterEach(() => {
  cleanup();
});

describe('GenerativeRenderer Zod Validation', () => {
  // Test plain component registry entry (0.1.0 backward compatibility)
  it('should render plain components without schemas', () => {
    const SimpleComponent: React.FC<{ value: string }> = ({ value }) => (
      <div data-testid="simple">{value}</div>
    );

    const registry = {
      Simple: SimpleComponent,
    };

    const blocks = [
      { componentName: 'Simple', props: { value: 'Hello' } },
    ];

    render(<GenerativeRenderer blocks={blocks} registry={registry} />);
    expect(screen.getByTestId('simple').textContent).toBe('Hello');
  });

  // Test component with Zod schema (0.2.0 features)
  it('should validate and render component with schema on success', () => {
    const SchemaComponent: React.FC<{ count: number; name: string }> = ({ count, name }) => (
      <div data-testid="schema">{name}: {count}</div>
    );
    const schema = z.object({
      count: z.number().default(0),
      name: z.string(),
    });

    const registry = {
      Validated: {
        component: SchemaComponent,
        schema,
      },
    };

    // Correct props
    const blocks = [
      { componentName: 'Validated', props: { count: 10, name: 'Alice' } },
    ];

    render(<GenerativeRenderer blocks={blocks} registry={registry} />);
    expect(screen.getByTestId('schema').textContent).toBe('Alice: 10');
  });

  it('should support default values/coercions from Zod schemas', () => {
    const SchemaComponent: React.FC<{ count: number; name: string }> = ({ count, name }) => (
      <div data-testid="schema-coerced">{name}: {count}</div>
    );
    const schema = z.object({
      count: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().default(5)),
      name: z.string(),
    });

    const registry = {
      Validated: {
        component: SchemaComponent,
        schema,
      },
    };

    // Missing count (defaults to 5)
    const blocks = [
      { componentName: 'Validated', props: { name: 'Bob' } },
    ];

    render(<GenerativeRenderer blocks={blocks} registry={registry} />);
    expect(screen.getByTestId('schema-coerced').textContent).toBe('Bob: 5');
  });

  // Test invalid props triggers fallback/skip
  it('should trigger fallback component on validation failure', () => {
    const SchemaComponent: React.FC<{ count: number }> = ({ count }) => (
      <div>{count}</div>
    );
    const schema = z.object({
      count: z.number(),
    });

    const Fallback: React.FC<any> = ({ block }) => (
      <div data-testid="fallback">Failed validation for {block.componentName}</div>
    );

    const registry = {
      Validated: {
        component: SchemaComponent,
        schema,
      },
    };

    // Invalid props: count is string
    const blocks = [
      { componentName: 'Validated', props: { count: 'not-a-number' } },
    ];

    render(
      <GenerativeRenderer
        blocks={blocks}
        registry={registry}
        fallback={Fallback}
      />
    );
    expect(screen.getByTestId('fallback').textContent).toBe('Failed validation for Validated');
  });

  it('should skip rendering on validation failure if no fallback', () => {
    const SchemaComponent: React.FC<{ count: number }> = ({ count }) => (
      <div data-testid="ok">{count}</div>
    );
    const schema = z.object({
      count: z.number(),
    });

    const registry = {
      Validated: {
        component: SchemaComponent,
        schema,
      },
    };

    const blocks = [
      { componentName: 'Validated', props: { count: 'not-a-number' } },
    ];

    const { container } = render(
      <GenerativeRenderer blocks={blocks} registry={registry} />
    );
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  // Test unknown componentName behavior unchanged
  it('should render fallback component on unknown component', () => {
    const Fallback: React.FC<any> = ({ block }) => (
      <div data-testid="fallback-unknown">Unknown: {block.componentName}</div>
    );

    const blocks = [
      { componentName: 'UnknownComponent', props: {} },
    ];

    render(
      <GenerativeRenderer
        blocks={blocks}
        registry={{}}
        fallback={Fallback}
      />
    );
    expect(screen.getByTestId('fallback-unknown').textContent).toBe('Unknown: UnknownComponent');
  });
});
