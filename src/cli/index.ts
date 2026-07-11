import { runAdd } from './add';
import { runList } from './list';
import { runInit } from './init';

const helpText = `
Usage:
  npx react-generative-ui list
  npx react-generative-ui add <component-name> [<component-name2> ...] [--dir <path>] [--overwrite] [--yes]
  npx react-generative-ui add --all [--dir <path>] [--overwrite] [--yes]
  npx react-generative-ui init

Options:
  --dir <path>     Target directory (default: ./src/components/generative-ui/)
  --overwrite      Overwrite existing files without prompting
  --yes, -y        Non-interactive mode (alias for --overwrite)
`;

export async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(helpText);
    process.exit(0);
  }

  try {
    if (command === 'list') {
      runList();
    } else if (command === 'add') {
      await runAdd(args.slice(1));
    } else if (command === 'init') {
      await runInit();
    } else {
      console.error(`Unknown command: ${command}`);
      console.log(helpText);
      process.exit(1);
    }
  } catch (error) {
    console.error('An error occurred:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
