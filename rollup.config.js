const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');

module.exports = [
  // CommonJS 构建
  {
    input: 'src/index.esm.js', // ES模块入口文件
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      terser({
        compress: {
          drop_console: false // 保留console.log，因为这是日志工具
        }
      })
    ],
    external: [
      'fs',
      'path',
      'os',
      'process',
      'child_process'
    ]
  },
  // ES Modules 构建
  {
    input: 'src/index.esm.js',
    output: {
      file: 'dist/index.esm.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      terser({
        compress: {
          drop_console: false // 保留console.log，因为这是日志工具
        }
      })
    ],
    external: [
      'fs',
      'path',
      'os',
      'process',
      'child_process'
    ]
  },
  // 未压缩的开发版本 (CommonJS)
  {
    input: 'src/index.esm.js',
    output: {
      file: 'dist/index.dev.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ],
    external: [
      'fs',
      'path',
      'os',
      'process',
      'child_process'
    ]
  },
  // 未压缩的开发版本 (ES Modules)
  {
    input: 'src/index.esm.js',
    output: {
      file: 'dist/index.dev.esm.mjs',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      commonjs()
    ],
    external: [
      'fs',
      'path',
      'os',
      'process',
      'child_process'
    ]
  }
];
