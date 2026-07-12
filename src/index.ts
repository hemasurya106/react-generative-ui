/**
 * react-generative-ui
 *
 * The single public entry point for the package.
 * Everything exported from here is available to consumers via:
 *   import { GenerativeRenderer, parseBlocks, StatCard, ... } from 'react-generative-ui'
 */

import React from 'react';
import type { RegistryEntry } from './types';

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

// ── Registry Helper ───────────────────────────────────────────────────────────

/**
 * Convenience helper that pairs a component with its Zod schema in a single call,
 * reducing registry boilerplate when using the install path.
 *
 * @example
 * import { withSchema, StatCard, StatCardSchema } from 'react-generative-ui';
 * const registry = { StatCard: withSchema(StatCard, StatCardSchema) };
 */
export function withSchema<P>(
  component: React.FC<P>,
  schema: { safeParse: (data: unknown) => { success: boolean; data?: P; error?: unknown } }
): RegistryEntry<P> {
  return { component, schema };
}

// ── Pre-built Components (install path) ───────────────────────────────────────
// These are the same source files distributed via `npx react-generative-ui add`.
// Import directly for zero-setup usage; use the CLI instead if you want to
// own and edit the component source in your own repo.
//
// Note: zod and recharts are peer dependencies (optional). Importing chart
// components (BarChart, LineChart, PieChart) requires `npm install recharts`.

// stat-card
export { StatCard } from '../templates/stat-card/StatCard';
export { StatCardSchema } from '../templates/stat-card/StatCard.schema';
export type { StatCardProps } from '../templates/stat-card/StatCard';

// data-table
export { DataTable } from '../templates/data-table/DataTable';
export { DataTableSchema } from '../templates/data-table/DataTable.schema';
export type { DataTableProps } from '../templates/data-table/DataTable';

// key-value-list
export { KeyValueList } from '../templates/key-value-list/KeyValueList';
export { KeyValueListSchema } from '../templates/key-value-list/KeyValueList.schema';
export type { KeyValueListProps } from '../templates/key-value-list/KeyValueList';

// pro-con-table
export { ProConTable } from '../templates/pro-con-table/ProConTable';
export { ProConTableSchema } from '../templates/pro-con-table/ProConTable.schema';
export type { ProConTableProps } from '../templates/pro-con-table/ProConTable';

// comparison-table
export { ComparisonTable } from '../templates/comparison-table/ComparisonTable';
export { ComparisonTableSchema } from '../templates/comparison-table/ComparisonTable.schema';
export type { ComparisonTableProps } from '../templates/comparison-table/ComparisonTable';

// bar-chart (requires: npm install recharts)
export { BarChart } from '../templates/bar-chart/BarChart';
export { BarChartSchema } from '../templates/bar-chart/BarChart.schema';
export type { BarChartProps } from '../templates/bar-chart/BarChart';

// line-chart (requires: npm install recharts)
export { LineChart } from '../templates/line-chart/LineChart';
export { LineChartSchema } from '../templates/line-chart/LineChart.schema';
export type { LineChartProps } from '../templates/line-chart/LineChart';

// pie-chart (requires: npm install recharts)
export { PieChart } from '../templates/pie-chart/PieChart';
export { PieChartSchema } from '../templates/pie-chart/PieChart.schema';
export type { PieChartProps } from '../templates/pie-chart/PieChart';

// alert-box
export { AlertBox } from '../templates/alert-box/AlertBox';
export { AlertBoxSchema } from '../templates/alert-box/AlertBox.schema';
export type { AlertBoxProps } from '../templates/alert-box/AlertBox';

// badge
export { Badge } from '../templates/badge/Badge';
export { BadgeSchema } from '../templates/badge/Badge.schema';
export type { BadgeProps } from '../templates/badge/Badge';

// progress-bar
export { ProgressBar } from '../templates/progress-bar/ProgressBar';
export { ProgressBarSchema } from '../templates/progress-bar/ProgressBar.schema';
export type { ProgressBarProps } from '../templates/progress-bar/ProgressBar';

// timeline
export { Timeline } from '../templates/timeline/Timeline';
export { TimelineSchema } from '../templates/timeline/Timeline.schema';
export type { TimelineProps } from '../templates/timeline/Timeline';

// accordion
export { Accordion } from '../templates/accordion/Accordion';
export { AccordionSchema } from '../templates/accordion/Accordion.schema';
export type { AccordionProps } from '../templates/accordion/Accordion';

// code-block
export { CodeBlock } from '../templates/code-block/CodeBlock';
export { CodeBlockSchema } from '../templates/code-block/CodeBlock.schema';
export type { CodeBlockProps } from '../templates/code-block/CodeBlock';

// source-list
export { SourceList } from '../templates/source-list/SourceList';
export { SourceListSchema } from '../templates/source-list/SourceList.schema';
export type { SourceListProps } from '../templates/source-list/SourceList';

// quick-reply-buttons (QuickReplyButtonsProps is an interface with onSelect callback)
export { QuickReplyButtons } from '../templates/quick-reply-buttons/QuickReplyButtons';
export { QuickReplyButtonsSchema } from '../templates/quick-reply-buttons/QuickReplyButtons.schema';
export type { QuickReplyButtonsProps } from '../templates/quick-reply-buttons/QuickReplyButtons';

// confirmation-card (ConfirmationCardProps is an interface with onConfirm/onDeny callbacks)
export { ConfirmationCard } from '../templates/confirmation-card/ConfirmationCard';
export { ConfirmationCardSchema } from '../templates/confirmation-card/ConfirmationCard.schema';
export type { ConfirmationCardProps } from '../templates/confirmation-card/ConfirmationCard';

