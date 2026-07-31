# CLI Reference & Automation Guide — react-generative-ui

The `react-generative-ui` CLI powers **Path B (Copy)** workflow, scaffolding starter files and copying component source files directly into your application codebase.

---

## Command Syntax

```bash
npx react-generative-ui <command> [options]
```

---

## 1. Commands

### `init`
Scaffolds a starter `src/generative-ui-registry.ts` registry file containing imports for 4 starter components (`StatCard`, `DataTable`, `ProConTable`, `AlertBox`), Zod schema pairings, and `buildSystemPrompt` configuration.

```bash
npx react-generative-ui init
```

---

### `add <component-name...>`
Copies the `.tsx` component source file and `.schema.ts` file for one or more requested components directly into your project.

```bash
# Add a single component
npx react-generative-ui add stat-card

# Add multiple components
npx react-generative-ui add stat-card alert-box data-table pro-con-table

# Add all 17 available default components
npx react-generative-ui add --all
```

---

### `list`
Prints an index of all 17 default components with descriptions and peer dependency notices.

```bash
npx react-generative-ui list
```

---

## 2. CLI Options & Flags

| Flag | Shorthand | Description | Default Target |
|---|---|---|---|
| `--dir <path>` | N/A | Target directory for copied component files | `./src/components/generative-ui/` |
| `--overwrite` | `-y` / `--yes` | Overwrite existing files without prompting | `false` |
| `--all` | N/A | Scaffold all 17 default components at once | `false` |

---

## 3. Automation Recipes (CI & AI Coding Agents)

When executing CLI commands in non-interactive CI environments or inside AI coding agent sessions, use the `--yes` / `-y` flag to skip interactive prompt confirmations:

```bash
# Non-interactive CLI scaffolding in CI scripts
npx react-generative-ui add stat-card data-table --yes --dir ./src/components/generative-ui
```
