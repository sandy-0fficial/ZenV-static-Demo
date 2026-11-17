import { build } from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// Read-only visual reference: output goes solely into static-site/.build/reference/.
const root = dirname(fileURLToPath(import.meta.url));
await build({ absWorkingDir: root, entryPoints: [resolve(root, '../src/main.tsx')], outdir: '.build/reference', entryNames: 'site', assetNames: 'fonts/[name]-[hash]', bundle: true, minify: true, format: 'iife', platform: 'browser', jsx: 'automatic', loader: { '.woff2': 'file' }, define: { 'process.env.NODE_ENV': '"production"' } });
console.log('Built read-only design reference inside static-site/.build/reference; original files unchanged.');
