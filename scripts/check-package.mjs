import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const output = execFileSync(npmCommand, ['pack', '--dry-run', '--json'], {
  encoding: 'utf8',
  shell: process.platform === 'win32',
});
const [pack] = JSON.parse(output);
const packedFiles = pack.files.map(({ path }) => path);

const requiredPackedPaths = ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'bin/cli.js'];
for (const path of requiredPackedPaths) {
  if (!packedFiles.includes(path)) {
    throw new Error(`Package is missing required file: ${path}`);
  }
}

const allowedPrefixes = ['dist/', 'templates/', 'bin/'];
const allowedFiles = new Set(['package.json', 'README.md', 'LICENSE', 'NOTICE']);
for (const path of packedFiles) {
  if (!allowedFiles.has(path) && !allowedPrefixes.some((prefix) => path.startsWith(prefix))) {
    throw new Error(`Unexpected file in package: ${path}`);
  }
}

const rootExport = packageJson.exports['.'];
for (const path of Object.values(rootExport)) {
  if (!existsSync(new URL(`../${path.replace(/^\.\//, '')}`, import.meta.url))) {
    throw new Error(`Root export does not resolve: ${path}`);
  }
}

const componentExport = packageJson.exports['./components/*'];
const manifest = readFileSync(new URL('../src/componentManifest.ts', import.meta.url), 'utf8');
const componentNames = [...manifest.matchAll(/name:\s*'([^']+)'/g)].map((match) => match[1]);
if (componentNames.length === 0) {
  throw new Error('Could not find component exports in src/componentManifest.ts');
}

for (const name of componentNames) {
  for (const path of Object.values(componentExport)) {
    const resolvedPath = path.replace('*', name).replace(/^\.\//, '');
    if (!existsSync(new URL(`../${resolvedPath}`, import.meta.url))) {
      throw new Error(`Component export does not resolve for ${name}: ${path}`);
    }
  }
}

console.log(`Package check passed: ${packedFiles.length} packed files and ${componentNames.length} component exports.`);
