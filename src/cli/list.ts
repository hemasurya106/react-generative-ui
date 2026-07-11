export function runList() {
  console.log('\nAvailable generative-ui components:');
  console.log('------------------------------------\n');
  const components = [
    { name: 'stat-card', desc: 'Beautiful metric card displaying value, label, and trend indicators.' },
    { name: 'data-table', desc: 'Renders tabular data with clean headers and borders.' },
    { name: 'key-value-list', desc: 'A simple list displaying paired labels and values.' },
    { name: 'pro-con-table', desc: 'Two-column comparison layout for listing pros and cons.' },
    { name: 'comparison-table', desc: 'Side-by-side product or option feature comparison grid.' },
    { name: 'bar-chart', desc: 'Bar chart using Recharts for representing quantitative data. (Requires Recharts)' },
    { name: 'line-chart', desc: 'Line chart using Recharts for plotting data points over time. (Requires Recharts)' },
    { name: 'pie-chart', desc: 'Pie/donut chart using Recharts to display relative proportions. (Requires Recharts)' },
    { name: 'alert-box', desc: 'Visual message container for info, success, warning, or error messages.' },
    { name: 'badge', desc: 'Compact pill-style tag representing statuses or categories.' },
    { name: 'progress-bar', desc: 'Loading or percentage completion indicator bar.' },
    { name: 'timeline', desc: 'Chronological timeline layout for events and milestones.' },
    { name: 'accordion', desc: 'Expandable section panel list for FAQ or structured content.' },
    { name: 'code-block', desc: 'Syntax-highlighted preformatted code block with safe copy feature.' },
    { name: 'source-list', desc: 'List of citation sources with URL security validation.' },
    { name: 'quick-reply-buttons', desc: 'Prompting button list for suggested next-turn user selections.' },
    { name: 'confirmation-card', desc: 'Interactive choice card for agent approval/deny flows.' },
  ];

  components.forEach((c) => {
    console.log(`  * ${c.name.padEnd(22)} - ${c.desc}`);
  });
  console.log('\nInstall a component using: npx react-generative-ui add <component-name>');
}
