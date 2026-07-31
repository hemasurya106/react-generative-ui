# 17 Default Component Catalog Reference — react-generative-ui

`react-generative-ui` includes **17 pre-designed default components**. You can use them directly via NPM import (Path A) or copy their source files into your project via the CLI (`npx react-generative-ui add <name>`) (Path B).

---

## Catalog Overview

| Component | Description | Dependencies | Subpath Export |
|---|---|---|---|
| [StatCard](#1-statcard) | Metric KPI card with trend & icon | None | `react-generative-ui/components/stat-card` |
| [DataTable](#2-datatable) | Grid table for structured tabular data | None | `react-generative-ui/components/data-table` |
| [KeyValueList](#3-keyvaluelist) | List of key-value meta pairs | None | `react-generative-ui/components/key-value-list` |
| [ProConTable](#4-procontable) | Side-by-side comparison of pros & cons | None | `react-generative-ui/components/pro-con-table` |
| [ComparisonTable](#5-comparisontable) | Feature grid comparing multiple choices | None | `react-generative-ui/components/comparison-table` |
| [BarChart](#6-barchart) | Vertical bar chart | `recharts` | `react-generative-ui/components/bar-chart` |
| [LineChart](#7-linechart) | Line trend plot over time | `recharts` | `react-generative-ui/components/line-chart` |
| [PieChart](#8-piechart) | Donut/Pie distribution chart | `recharts` | `react-generative-ui/components/pie-chart` |
| [AlertBox](#9-alertbox) | Status notice banner | None | `react-generative-ui/components/alert-box` |
| [Badge](#10-badge) | Status pill or category tag | None | `react-generative-ui/components/badge` |
| [ProgressBar](#11-progressbar) | Completion percentage progress bar | None | `react-generative-ui/components/progress-bar` |
| [Timeline](#12-timeline) | Chronological event history timeline | None | `react-generative-ui/components/timeline` |
| [Accordion](#13-accordion) | Expandable FAQ content panels | None | `react-generative-ui/components/accordion` |
| [CodeBlock](#14-codeblock) | Tokenized syntax highlighted code viewer | None | `react-generative-ui/components/code-block` |
| [SourceList](#15-sourcelist) | Citation list with URL sanitization | None | `react-generative-ui/components/source-list` |
| [QuickReplyButtons](#16-quickreplybuttons) | Suggested next-turn user prompt options | None | `react-generative-ui/components/quick-reply-buttons` |
| [ConfirmationCard](#17-confirmationcard) | Approval/deny choice card for agent flows | None | `react-generative-ui/components/confirmation-card` |

---

## Component Specifications

### 1. StatCard
*Displays key performance indicators, values, trends, and optional icons.*

```tsx
import { StatCard, StatCardSchema } from 'react-generative-ui/components/stat-card';
```

#### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✅ | Metric title or label |
| `value` | `string \| number` | ✅ | Main metric value |
| `change` | `string` | ❌ | Percentage or delta string (e.g., `"+12.5%"`) |
| `trend` | `"up" \| "down" \| "neutral"` | ❌ | Trend arrow direction and indicator styling |
| `icon` | `string` | ❌ | Emoji or icon string |

#### Expected LLM JSON
```json
{
  "componentName": "StatCard",
  "props": {
    "title": "Monthly Recurring Revenue",
    "value": "$48,250",
    "change": "+8.4%",
    "trend": "up",
    "icon": "📈"
  }
}
```

---

### 2. DataTable
*Renders structured tabular data with headers.*

```tsx
import { DataTable, DataTableSchema } from 'react-generative-ui/components/data-table';
```

#### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `headers` | `string[]` | ✅ | Array of column title headers |
| `rows` | `Record<string, string>[]` | ✅ | Array of objects where keys match header names |
| `title` | `string` | ❌ | Table title caption |

#### Expected LLM JSON
```json
{
  "componentName": "DataTable",
  "props": {
    "title": "Q3 Sales Leaderboard",
    "headers": ["Representative", "Region", "Closed Deals"],
    "rows": [
      { "Representative": "Alice Vance", "Region": "North", "Closed Deals": "$140,000" },
      { "Representative": "Bob Miller", "Region": "West", "Closed Deals": "$115,000" }
    ]
  }
}
```

---

### 3. KeyValueList
*Compact metadata key-value list.*

```tsx
import { KeyValueList, KeyValueListSchema } from 'react-generative-ui/components/key-value-list';
```

#### Expected LLM JSON
```json
{
  "componentName": "KeyValueList",
  "props": {
    "title": "Server Configuration Summary",
    "items": [
      { "label": "Environment", "value": "Production" },
      { "label": "Region", "value": "us-east-1" },
      { "label": "Memory", "value": "16 GB" }
    ]
  }
}
```

---

### 4. ProConTable
*Two-column layout comparing positive and negative aspects.*

```tsx
import { ProConTable, ProConTableSchema } from 'react-generative-ui/components/pro-con-table';
```

#### Expected LLM JSON
```json
{
  "componentName": "ProConTable",
  "props": {
    "title": "Monolith vs Microservices Architecture",
    "pros": ["Simple deployment", "Single codebase", "Easy debugging"],
    "cons": ["Scaling bottleneck", "Tight coupling", "Slower build times"]
  }
}
```

---

### 5. ComparisonTable
*Grid comparing multiple options across shared feature dimensions.*

```tsx
import { ComparisonTable, ComparisonTableSchema } from 'react-generative-ui/components/comparison-table';
```

#### Expected LLM JSON
```json
{
  "componentName": "ComparisonTable",
  "props": {
    "title": "Cloud Hosting Tier Comparison",
    "features": ["vCPUs", "RAM", "Storage", "SLA"],
    "options": [
      { "name": "Basic", "values": ["2", "4 GB", "80 GB", "99.9%"] },
      { "name": "Pro", "values": ["8", "32 GB", "500 GB", "99.99%"] }
    ]
  }
}
```

---

### 6. BarChart (Requires `recharts`)
*Vertical bar chart for data comparisons.*

```json
{
  "componentName": "BarChart",
  "props": {
    "title": "Monthly Signups",
    "data": [
      { "label": "Jan", "value": 120 },
      { "label": "Feb", "value": 240 },
      { "label": "Mar", "value": 310 }
    ],
    "color": "#6366f1"
  }
}
```

---

### 7. LineChart (Requires `recharts`)
*Line plot tracking metrics over time.*

```json
{
  "componentName": "LineChart",
  "props": {
    "title": "API Request Latency (ms)",
    "data": [
      { "label": "00:00", "value": 45 },
      { "label": "06:00", "value": 82 },
      { "label": "12:00", "value": 110 }
    ]
  }
}
```

---

### 8. PieChart (Requires `recharts`)
*Donut/pie distribution chart.*

```json
{
  "componentName": "PieChart",
  "props": {
    "title": "Traffic Sources",
    "data": [
      { "label": "Organic Search", "value": 55 },
      { "label": "Direct", "value": 30 },
      { "label": "Social", "value": 15 }
    ]
  }
}
```

---

### 9. AlertBox
*Notice box with predefined status color themes.*

```json
{
  "componentName": "AlertBox",
  "props": {
    "type": "warning",
    "title": "Storage Quota Warning",
    "message": "You have used 88% of your allotted storage limit."
  }
}
```

---

### 10. Badge
*Status tag pill.*

```json
{
  "componentName": "Badge",
  "props": {
    "label": "Production Ready",
    "variant": "success"
  }
}
```

---

### 11. ProgressBar
*Linear loading or completion progress bar.*

```json
{
  "componentName": "ProgressBar",
  "props": {
    "label": "Database Migration Status",
    "value": 75,
    "max": 100,
    "color": "#10b981"
  }
}
```

---

### 12. Timeline
*Chronological milestone event list.*

```json
{
  "componentName": "Timeline",
  "props": {
    "title": "Product Launch Schedule",
    "events": [
      { "date": "Q1 2026", "title": "Alpha Testing", "description": "Internal test flight" },
      { "date": "Q2 2026", "title": "Public Beta", "description": "Open beta access" }
    ]
  }
}
```

---

### 13. Accordion
*Collapsible FAQ accordion panels.*

```json
{
  "componentName": "Accordion",
  "props": {
    "items": [
      { "title": "Is my data secure?", "content": "Yes, all data is encrypted in transit and at rest." },
      { "title": "Can I cancel anytime?", "content": "You can cancel your subscription at any time from your settings." }
    ]
  }
}
```

---

### 14. CodeBlock
*Tokenized syntax highlighted code viewer with copy button.*

```json
{
  "componentName": "CodeBlock",
  "props": {
    "language": "typescript",
    "code": "const greet = (user: string) => `Hello, ${user}!`;"
  }
}
```

---

### 15. SourceList
*List of citations with URL safety protocol checks (blocks non http/https URLs).*

```json
{
  "componentName": "SourceList",
  "props": {
    "title": "Reference Materials",
    "sources": [
      { "label": "Official React Documentation", "url": "https://react.dev" },
      { "label": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/" }
    ]
  }
}
```

---

### 16. QuickReplyButtons
*Suggested next prompt pills for chat user interactions.*

> ⚠️ **Callback Wrapper Required**:

```tsx
import { QuickReplyButtons } from 'react-generative-ui';

const InteractiveQuickReplies: React.FC<any> = (props) => (
  <QuickReplyButtons
    {...props}
    onSelect={(optionId: string) => console.log('Selected:', optionId)}
  />
);
```

```json
{
  "componentName": "QuickReplyButtons",
  "props": {
    "prompt": "Choose a follow-up action:",
    "options": [
      { "id": "opt_download", "label": "Download CSV" },
      { "id": "opt_share", "label": "Share Link" }
    ]
  }
}
```

---

### 17. ConfirmationCard
*Interactive approval card for AI agent decisions.*

> ⚠️ **Callback Wrapper Required**:

```tsx
import { ConfirmationCard } from 'react-generative-ui';

const InteractiveConfirmation: React.FC<any> = (props) => (
  <ConfirmationCard
    {...props}
    onConfirm={() => console.log('Approved')}
    onDeny={() => console.log('Denied')}
  />
);
```

```json
{
  "componentName": "ConfirmationCard",
  "props": {
    "title": "Deploy to Production?",
    "message": "This will publish build #482 to live servers.",
    "confirmLabel": "Approve & Deploy",
    "denyLabel": "Cancel"
  }
}
```
