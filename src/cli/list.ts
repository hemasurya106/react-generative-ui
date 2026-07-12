import { COMPONENT_MANIFEST } from '../componentManifest';

export function runList() {
  console.log('\nAvailable generative-ui components:');
  console.log('------------------------------------\n');

  COMPONENT_MANIFEST.forEach((c) => {
    console.log(`  * ${c.name.padEnd(22)} - ${c.description}`);
  });

  console.log('\nInstall a component using: npx react-generative-ui add <component-name>');
}

