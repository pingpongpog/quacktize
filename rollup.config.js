import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse package.json
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

// ...rest of your Rollup config using `pkg`

const input = 'src/quacktize.js';
const extensions = ['.js', '.ts'];

export default [
  // UMD build for browsers
  {
    input,
    output: [
      {
        file: pkg.browser,
        format: 'umd',
        name: 'Quacktize',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions
      }),
      terser()
    ]
  },
  // CommonJS (for Node) and ES module builds
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions
      })
    ]
  }
];
