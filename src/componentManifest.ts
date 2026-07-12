/**
 * react-generative-ui — Component Manifest
 *
 * Single source of truth for all default components.
 * Consumed by: the CLI (list, add commands) and src/index.ts (direct exports).
 *
 * Keep this module free of Node built-ins and side effects so it can be
 * safely imported from either tsup entry point (index or cli).
 */

export interface ComponentManifest {
  /** Kebab-case name — matches the templates/ folder name and CLI argument. */
  name: string;
  /** PascalCase export name — matches the component''s named export. */
  exportName: string;
  /** One-line human-readable description shown by `npx react-generative-ui list`. */
  description: string;
  /** True if the component imports from ''recharts'' at the top level. */
  requiresRecharts?: boolean;
}

export const COMPONENT_MANIFEST: ComponentManifest[] = [
  {
    name: 'stat-card',
    exportName: 'StatCard',
    description: 'Beautiful metric card displaying value, label, and trend indicators.',
  },
  {
    name: 'data-table',
    exportName: 'DataTable',
    description: 'Renders tabular data with clean headers and borders.',
  },
  {
    name: 'key-value-list',
    exportName: 'KeyValueList',
    description: 'A simple list displaying paired labels and values.',
  },
  {
    name: 'pro-con-table',
    exportName: 'ProConTable',
    description: 'Two-column comparison layout for listing pros and cons.',
  },
  {
    name: 'comparison-table',
    exportName: 'ComparisonTable',
    description: 'Side-by-side product or option feature comparison grid.',
  },
  {
    name: 'bar-chart',
    exportName: 'BarChart',
    description: 'Bar chart using Recharts for representing quantitative data. (Requires Recharts)',
    requiresRecharts: true,
  },
  {
    name: 'line-chart',
    exportName: 'LineChart',
    description: 'Line chart using Recharts for plotting data points over time. (Requires Recharts)',
    requiresRecharts: true,
  },
  {
    name: 'pie-chart',
    exportName: 'PieChart',
    description: 'Pie/donut chart using Recharts to display relative proportions. (Requires Recharts)',
    requiresRecharts: true,
  },
  {
    name: 'alert-box',
    exportName: 'AlertBox',
    description: 'Visual message container for info, success, warning, or error messages.',
  },
  {
    name: 'badge',
    exportName: 'Badge',
    description: 'Compact pill-style tag representing statuses or categories.',
  },
  {
    name: 'progress-bar',
    exportName: 'ProgressBar',
    description: 'Loading or percentage completion indicator bar.',
  },
  {
    name: 'timeline',
    exportName: 'Timeline',
    description: 'Chronological timeline layout for events and milestones.',
  },
  {
    name: 'accordion',
    exportName: 'Accordion',
    description: 'Expandable section panel list for FAQ or structured content.',
  },
  {
    name: 'code-block',
    exportName: 'CodeBlock',
    description: 'Syntax-highlighted preformatted code block with safe copy feature.',
  },
  {
    name: 'source-list',
    exportName: 'SourceList',
    description: 'List of citation sources with URL security validation.',
  },
  {
    name: 'quick-reply-buttons',
    exportName: 'QuickReplyButtons',
    description: 'Prompting button list for suggested next-turn user selections.',
  },
  {
    name: 'confirmation-card',
    exportName: 'ConfirmationCard',
    description: 'Interactive choice card for agent approval/deny flows.',
  },
];
