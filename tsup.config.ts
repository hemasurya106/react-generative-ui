import { defineConfig } from 'tsup';
import { COMPONENT_MANIFEST } from './src/componentManifest';

const componentEntries = Object.fromEntries(
  COMPONENT_MANIFEST.map((component) => [
    `components/${component.name}`,
    `templates/${component.name}/${component.exportName}.tsx`,
  ])
);

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
    ...componentEntries,
  },
  format: ['esm', 'cjs'],
  dts: {
    // Pin rootDir so DTS always emits to dist/index.d.ts, not dist/src/index.d.ts.
    //
    // noCheck: true — skip type-checking during .d.ts emission.
    // Rationale: zod and recharts are optional external peer deps that consumers
    // install themselves. They are never in node_modules of this package's own
    // build environment. TypeScript's DTS compiler errors with
    // "Cannot find module 'zod'" when it tries to resolve them in template
    // source files. skipLibCheck only suppresses errors inside .d.ts files, NOT
    // in .tsx source files — so we use noCheck which skips checking altogether
    // and just emits the declarations. Type correctness for templates is validated
    // separately by the full tsc type-check step (npm run type-check).
    compilerOptions: {
      rootDir: '.',
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      // Allow .d.ts emission even when external peer deps (zod, recharts) are
      // not installed in the build environment. Without this flag TypeScript
      // aborts DTS emission on the first unresolved module, producing the
      // "DTS Build error / Cannot find module 'zod'" failure. Consumers install
      // zod/recharts themselves; this package only needs to emit correct shapes.
      noEmitOnError: false,
    },
    resolve: false,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // zod and recharts are optional peer dependencies - never bundle them.
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