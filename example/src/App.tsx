/**
 * Example App — Demonstrates react-generative-ui usage
 *
 * This shows how a developer would:
 * 1. Define their own UI components
 * 2. Register them
 * 3. Parse LLM output
 * 4. Render it all with <GenerativeRenderer />
 */

import React, { useState } from 'react';

// ── Import from the package ───────────────────────────────────────────────────
import {
  GenerativeRenderer,
  parseBlocks,
  buildSystemPrompt,
  type ComponentRegistry,
  type UIBlock,
} from 'react-generative-ui';

// ── 1. Define your own simple UI Components ───────────────────────────────────

const ProConTable: React.FC<{
  title?: string;
  pros: string[];
  cons: string[];
}> = ({ title, pros, cons }) => (
  <div style={styles.card}>
    {title && <div style={styles.cardTitle}>{title}</div>}
    <div style={styles.proConGrid}>
      <div>
        <div style={{ ...styles.label, color: '#34d399' }}>✅ Pros</div>
        <ul style={styles.list}>
          {pros.map((p, i) => <li key={i} style={styles.listItem}>{p}</li>)}
        </ul>
      </div>
      <div>
        <div style={{ ...styles.label, color: '#f87171' }}>❌ Cons</div>
        <ul style={styles.list}>
          {cons.map((c, i) => <li key={i} style={styles.listItem}>{c}</li>)}
        </ul>
      </div>
    </div>
  </div>
);

const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
}> = ({ title, value, subtitle }) => (
  <div style={styles.statCard}>
    <div style={styles.statLabel}>{title}</div>
    <div style={styles.statValue}>{value}</div>
    {subtitle && <div style={styles.statSub}>{subtitle}</div>}
  </div>
);

const AlertBox: React.FC<{
  type?: 'info' | 'warning' | 'success' | 'error';
  message: string;
}> = ({ type = 'info', message }) => {
  const colorMap = {
    info: '#6366f1',
    warning: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
  };
  return (
    <div style={{ ...styles.alertBox, borderColor: colorMap[type] }}>
      <span style={{ color: colorMap[type], fontWeight: 600 }}>
        {type.toUpperCase()}:
      </span>{' '}
      {message}
    </div>
  );
};

// ── 2. Register your components ───────────────────────────────────────────────
const myRegistry: ComponentRegistry = {
  ProConTable,
  StatCard,
  AlertBox,
};

// ── 3. Simulated LLM Output (normally comes from your AI API) ─────────────────
const SIMULATED_LLM_OUTPUT = `
Here is a quick comparison of React vs Vue:

{"componentName": "ProConTable", "props": {"title": "React vs Vue", "pros": ["Huge ecosystem", "Backed by Meta", "Flexible architecture"], "cons": ["Steeper learning curve", "Boilerplate heavy"]}}

Here are some quick stats about React:

{"componentName": "StatCard", "props": {"title": "Weekly Downloads", "value": "28M+", "subtitle": "As of 2025 on NPM"}}
{"componentName": "StatCard", "props": {"title": "GitHub Stars", "value": "220K+", "subtitle": "Most starred UI library"}}

And a quick note:

{"componentName": "AlertBox", "props": {"type": "info", "message": "Both are excellent choices. Pick the one your team knows best."}}

Hope that helps!
`.trim();

// ── 4. App Component ──────────────────────────────────────────────────────────
export default function App() {
  const [rawInput, setRawInput] = useState(SIMULATED_LLM_OUTPUT);
  const [blocks, setBlocks] = useState<UIBlock[]>(() => parseBlocks(SIMULATED_LLM_OUTPUT));
  const [showPrompt, setShowPrompt] = useState(false);

  const systemPrompt = buildSystemPrompt(myRegistry, {
    ProConTable: { title: 'optional', pros: ['item 1'], cons: ['item 1'] },
    StatCard: { title: 'Label', value: '42', subtitle: 'optional' },
    AlertBox: { type: 'info | warning | success | error', message: 'your message' },
  });

  const handleParse = () => {
    setBlocks(parseBlocks(rawInput));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>react-generative-ui</div>
        <h1 style={styles.title}>Live Package Demo</h1>
        <p style={styles.subtitle}>
          Paste any LLM output below. JSON blocks with a <code>componentName</code> will be rendered as interactive components.
        </p>
      </div>

      {/* Input Panel */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>LLM Raw Output (editable)</div>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          style={styles.textarea}
          rows={12}
        />
        <button onClick={handleParse} style={styles.button}>
          → Parse & Render
        </button>
      </div>

      {/* Rendered Output */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>Rendered Output ({blocks.length} blocks)</div>
        <GenerativeRenderer
          blocks={blocks}
          registry={myRegistry}
          debug={true}
        />
      </div>

      {/* System Prompt Preview */}
      <div style={styles.panel}>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          style={{ ...styles.button, background: '#1e1e2e', marginBottom: '1rem' }}
        >
          {showPrompt ? '▼ Hide' : '▶ Show'} Generated System Prompt
        </button>
        {showPrompt && (
          <pre style={styles.promptBox}>{systemPrompt}</pre>
        )}
      </div>
    </div>
  );
}

// ── Inline Styles ─────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '800px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '2.5rem' },
  badge: {
    display: 'inline-block', padding: '4px 12px', borderRadius: '999px',
    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
    color: '#818cf8', fontSize: '12px', fontFamily: 'monospace', marginBottom: '1rem',
  },
  title: { fontSize: '2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' },
  subtitle: { color: '#94a3b8', lineHeight: 1.6 },
  panel: {
    background: '#13131f', border: '1px solid #1e1e2e',
    borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
  },
  panelTitle: { fontSize: '12px', fontFamily: 'monospace', color: '#6366f1', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
  textarea: {
    width: '100%', background: '#0d0d14', border: '1px solid #1e1e2e',
    borderRadius: '8px', padding: '1rem', color: '#e2e8f0',
    fontFamily: 'monospace', fontSize: '13px', resize: 'vertical',
  },
  button: {
    marginTop: '1rem', padding: '10px 20px', background: '#6366f1',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 600, fontSize: '14px',
  },
  card: {
    background: '#0d0d14', border: '1px solid #1e1e2e',
    borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem',
  },
  cardTitle: { color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' },
  proConGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { fontWeight: 700, fontSize: '13px', marginBottom: '0.5rem' },
  list: { listStyle: 'none', paddingLeft: 0 },
  listItem: { fontSize: '13px', color: '#94a3b8', padding: '4px 0', lineHeight: 1.5 },
  statCard: {
    background: '#0d0d14', border: '1px solid #1e1e2e',
    borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem',
  },
  statLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' },
  statValue: { fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' },
  statSub: { fontSize: '12px', color: '#6366f1' },
  alertBox: {
    padding: '1rem', borderRadius: '8px', borderLeft: '3px solid',
    background: '#13131f', color: '#cbd5e1', fontSize: '14px', marginBottom: '1rem',
  },
  promptBox: {
    background: '#0d0d14', padding: '1rem', borderRadius: '8px',
    fontSize: '12px', color: '#94a3b8', whiteSpace: 'pre-wrap',
    fontFamily: 'monospace', overflowX: 'auto',
  },
};
