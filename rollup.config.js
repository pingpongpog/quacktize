import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const input = 'src/website-optimizer.js';
const extensions = ['.js', '.ts'];

export default [
  // UMD build for browsers
  {
    input,
    output: [
      {
        file: pkg.browser,
        format: 'umd',
        name: 'WebsiteOptimizer',
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