import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    // Pin rootDir explicitly so tsup's DTS compiler always emits
    // dist/index.d.ts (keyed by entry name), not dist/src/index.d.ts
    compilerOptions: { rootDir: '.' },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // zod and recharts are optional peer dependencies — never bundle them.
  // react/react-dom were already external; zod and recharts are added here
  // so that importing BarChart (recharts) or StatCard (zod schema) from the
  // installed path leaves those imports for the consumer's bundler to resolve.
  external: ['react', 'react-dom', 'zod', 'recharts'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});

