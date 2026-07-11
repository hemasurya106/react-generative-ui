import { describe, it, expect, vi } from 'vitest';
import { parseBlocks, createStreamingParser } from '../parser';
import type { ParseOptions } from '../types';

describe('Parser Robustness', () => {
  it('should parse nested JSON props correctly', () => {
    const rawText = `Here is the data: {"componentName": "DataTable", "props": {"rows": [{"name": "a"}, {"name": "b"}]}}`;
    const blocks = parseBlocks(rawText);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toEqual({
      componentName: 'Text',
      props: { content: 'Here is the data:' },
    });
    expect(blocks[1]).toEqual({
      componentName: 'DataTable',
      props: {
        rows: [{ name: 'a' }, { name: 'b' }],
      },
    });
  });

  it('should support streaming split at arbitrary boundaries', () => {
    const streamText = `Intro text {"componentName": "StatCard", "props": {"value": 42}} Outro text`;
    const parser = createStreamingParser({ strict: true });

    const blocks: any[] = [];
    // Feed the stream character by character
    for (let i = 0; i < streamText.length; i++) {
      const chunk = streamText[i];
      const newBlocks = parser.push(chunk);
      if (newBlocks.length > 0) {
        blocks.push(...newBlocks);
      }
    }
    blocks.push(...parser.flush());

    // Compare with static parsing
    const staticBlocks = parseBlocks(streamText, { strict: true });
    expect(blocks).toEqual(staticBlocks);
  });

  it('should handle malformed JSON fallback behavior in strict vs lenient mode', () => {
    const malformedText = `Some text {"componentName": "StatCard", "props": { invalid }}`;
    
    // Strict mode (default): drops silently
    const strictBlocks = parseBlocks(malformedText, { strict: true });
    expect(strictBlocks).toHaveLength(1);
    expect(strictBlocks[0].componentName).toBe('Text');
    expect(strictBlocks[0].props.content).toBe('Some text');

    // Lenient mode (strict: false): keeps as text block
    const lenientBlocks = parseBlocks(malformedText, { strict: false });
    expect(lenientBlocks).toHaveLength(2);
    expect(lenientBlocks[0].componentName).toBe('Text');
    expect(lenientBlocks[1]).toEqual({
      componentName: 'Text',
      props: { content: '{"componentName": "StatCard", "props": { invalid }}' },
    });
  });

  it('should fire onParseError callback on failure', () => {
    const malformedText = `Some text {"componentName": "StatCard", "props": { invalid }}`;
    const onParseError = vi.fn();
    
    parseBlocks(malformedText, { onParseError });
    expect(onParseError).toHaveBeenCalledTimes(1);
    expect(onParseError).toHaveBeenCalledWith(
      '{"componentName": "StatCard", "props": { invalid }}',
      expect.any(Error)
    );
  });

  it('should respect max input length guard', () => {
    const rawText = 'a'.repeat(200);
    expect(() => parseBlocks(rawText, { maxInputLength: 100 })).toThrow(
      /exceeds maximum limit/
    );

    const parser = createStreamingParser({ maxInputLength: 100 });
    parser.push('a'.repeat(50));
    expect(() => parser.push('a'.repeat(60))).toThrow(/exceeds maximum limit/);
  });

  it('should respect max nesting depth guard', () => {
    // Generate nested braces: {{{{...}}}}
    const nestedBraces = '{'.repeat(10) + '}' + '}'.repeat(9); // unmatched doesn't close but let's test depth limit
    expect(() => parseBlocks(nestedBraces, { maxDepth: 5 })).toThrow(
      /nesting depth exceeded/
    );
  });
});
