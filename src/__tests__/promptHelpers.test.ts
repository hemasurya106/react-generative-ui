import { describe, it, expect } from 'vitest';
import { getSystemPromptInstruction, buildSystemPrompt } from '../promptHelpers';

describe('Prompt Helpers', () => {
  it('should build prompt instructions for simple components', () => {
    const registry = {
      StatCard: () => null,
      AlertBox: () => null,
    };
    const instruction = getSystemPromptInstruction(registry);
    expect(instruction).toContain('- StatCard');
    expect(instruction).toContain('- AlertBox');
    expect(instruction).toContain('{"componentName": "<ComponentName>", "props": { <component specific props> }}');
  });

  it('should build prompt instructions with schemas when provided', () => {
    const registry = {
      StatCard: () => null,
      ProConTable: () => null,
    };
    const schemas = {
      StatCard: { title: 'Clicks', value: 120 },
      ProConTable: { pros: ['cheap'], cons: ['slow'] },
    };
    const instruction = getSystemPromptInstruction(registry, schemas);
    expect(instruction).toContain('- StatCard: {"componentName":"StatCard","props":{"title":"Clicks","value":120}}');
    expect(instruction).toContain('- ProConTable: {"componentName":"ProConTable","props":{"pros":["cheap"],"cons":["slow"]}}');
  });

  it('should build complete system prompts', () => {
    const registry = {
      StatCard: () => null,
    };
    const prompt = buildSystemPrompt(registry, undefined, 'Base assistant instructions.');
    expect(prompt).toContain('Base assistant instructions.');
    expect(prompt).toContain('- StatCard');
  });
});
