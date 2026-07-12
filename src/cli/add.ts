import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { COMPONENT_MANIFEST } from '../componentManifest';

export async function runAdd(args: string[]) {
  const names: string[] = [];
  let dir = './src/components/generative-ui';
  let overwrite = false;
  let all = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir') {
      dir = args[i + 1] || dir;
      i++;
    } else if (args[i] === '--overwrite' || args[i] === '--yes' || args[i] === '-y') {
      overwrite = true;
    } else if (args[i] === '--all') {
      all = true;
    } else if (args[i].startsWith('-')) {
      console.warn(`Warning: Unknown flag ${args[i]}`);
    } else {
      names.push(args[i]);
    }
  }

  // Determine which templates to add (sourced from the single manifest)
  const availableTemplates = COMPONENT_MANIFEST.map((c) => c.name);

  const targets = all ? availableTemplates : names;

  if (targets.length === 0) {
    console.error('Error: Please specify a component name or use --all');
    console.log('Use "npx react-generative-ui list" to see all available components.');
    return;
  }

  // Validate targets
  for (const name of targets) {
    if (!availableTemplates.includes(name)) {
      console.error(`Error: Unknown component "${name}".`);
      console.log('Use "npx react-generative-ui list" to see all available components.');
      return;
    }
  }

  const templatesBase = path.join(__dirname, '../templates');

  // Prompt helper
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

  // Ensure target directory exists
  fs.mkdirSync(dir, { recursive: true });

  let hasCharts = false;

  for (const name of targets) {
    // Use the manifest's requiresRecharts flag (more correct than name.includes('chart'))
    const entry = COMPONENT_MANIFEST.find((c) => c.name === name);
    if (entry?.requiresRecharts) {
      hasCharts = true;
    }

    const templateDir = path.join(templatesBase, name);
    // Find all files in the template directory
    const files = fs.readdirSync(templateDir);

    for (const file of files) {
      const srcPath = path.join(templateDir, file);
      const destPath = path.join(dir, file);

      if (fs.existsSync(destPath) && !overwrite) {
        const confirm = await askOverwrite(destPath);
        if (!confirm) {
          console.log(`Skipped ${file}`);
          continue;
        }
      }

      const content = fs.readFileSync(srcPath, 'utf-8');
      fs.writeFileSync(destPath, content, 'utf-8');
      console.log(`Added ${file} to ${destPath}`);
    }
  }

  // Check package.json for Zod and Recharts dependencies
  let pkgJson: any = {};
  try {
    if (fs.existsSync('./package.json')) {
      pkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    }
  } catch {}

  const hasZod = pkgJson.dependencies?.zod || pkgJson.devDependencies?.zod || pkgJson.peerDependencies?.zod;
  const hasRecharts = pkgJson.dependencies?.recharts || pkgJson.devDependencies?.recharts;

  console.log('\n--- Status Summary ---');
  if (!hasZod) {
    console.log('⚠️  This component needs Zod for schema validation. Run: npm install zod');
  }
  if (hasCharts && !hasRecharts) {
    console.log('⚠️  Chart components require recharts. Run: npm install recharts');
  }

  console.log('\nNext steps:');
  console.log(`1. Import the components and schemas from your local folder: ${dir}`);
  console.log('2. Wire them up in your GenerativeRenderer registry, e.g.:');
  console.log(`
import { GenerativeRenderer } from 'react-generative-ui';
// example:
// import { StatCard } from '${dir}/StatCard';
// import { StatCardSchema } from '${dir}/StatCard.schema';

// const registry = {
//   StatCard: { component: StatCard, schema: StatCardSchema }
// };
`);
}
