import fs from 'fs';
import path from 'path';
import readline from 'readline';

export async function runInit() {
  const destFile = './src/generative-ui-registry.ts';

  const askOverwrite = (filePath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(`File ${filePath} already exists. Overwrite? (y/N) `, (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      });
    });
  };

  if (fs.existsSync(destFile)) {
    const confirm = await askOverwrite(destFile);
    if (!confirm) {
      console.log('Initialization aborted.');
      return;
    }
  }

  const starterCode = `/**
 * Generative UI Registry Starter File
 * This registry wires your AI-generated components and their schemas.
 */

import { ComponentRegistry } from 'react-generative-ui';

// Import local components and schemas (added via CLI)
import { StatCard } from './components/generative-ui/StatCard';
import { StatCardSchema } from './components/generative-ui/StatCard.schema';

import { ProConTable } from './components/generative-ui/ProConTable';
import { ProConTableSchema } from './components/generative-ui/ProConTable.schema';

import { AlertBox } from './components/generative-ui/AlertBox';
import { AlertBoxSchema } from './components/generative-ui/AlertBox.schema';

import { DataTable } from './components/generative-ui/DataTable';
import { DataTableSchema } from './components/generative-ui/DataTable.schema';

export const generativeRegistry: ComponentRegistry = {
  StatCard: {
    component: StatCard,
    schema: StatCardSchema,
  },
  ProConTable: {
    component: ProConTable,
    schema: ProConTableSchema,
  },
  AlertBox: {
    component: AlertBox,
    schema: AlertBoxSchema,
  },
  DataTable: {
    component: DataTable,
    schema: DataTableSchema,
  },
};

/**
 * Example usage:
 * 
 * import { buildSystemPrompt } from 'react-generative-ui';
 * import { generativeRegistry } from './generative-ui-registry';
 * 
 * const schemasForPrompt = {
 *   StatCard: { title: "Title", value: "100", change: "+10%", trend: "up" },
 *   ProConTable: { title: "Comparison", pros: ["Fast"], cons: ["Expensive"] },
 *   AlertBox: { type: "info", title: "Notice", message: "Alert message" },
 *   DataTable: { title: "Data Table", headers: ["Name", "Age"], rows: [{ "Name": "Alice", "Age": 25 }] }
 * };
 * 
 * const systemPrompt = buildSystemPrompt(generativeRegistry, schemasForPrompt);
 */
`;

  // Ensure directories exist
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, starterCode, 'utf-8');

  console.log(`\nCreated registry file: ${destFile}`);
  console.log('Now install the matching component files using:');
  console.log('  npx react-generative-ui add stat-card pro-con-table alert-box data-table\n');
}
