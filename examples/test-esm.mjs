// ES Modules 格式测试文件
console.log('=== 测试 ES Modules 格式导入 ===');

// 方式1: 命名导入
import { logPro, clearLogProLogs, _initialize_log_dirs, _cleanup } from '../dist/index.esm.mjs';

// 方式2: 默认导入
import logOptDefault from '../dist/index.esm.mjs';

// 方式3: 混合导入
import logOptMixed, { logPro as logProNamed } from '../dist/index.esm.mjs';

console.log('✅ 所有 ES Modules 导入成功');

// 测试命名导入
console.log('\n--- 测试 ES Modules 命名导入 ---');
logPro('测试ES模块命名导入', { filename: 'test-esm-named.txt' });

// 测试默认导入
console.log('--- 测试 ES Modules 默认导入 ---');
logOptDefault.logPro('测试ES模块默认导入', { filename: 'test-esm-default.txt' });

// 测试混合导入
console.log('--- 测试 ES Modules 混合导入 ---');
logProNamed('测试ES模块混合导入', { filename: 'test-esm-mixed.txt' });
logOptMixed.logPro('测试ES模块混合导入(默认)', { filename: 'test-esm-mixed-default.txt' });

// 测试复杂数据结构
const complexData = {
  module: 'ES Modules',
  features: {
    treeShaking: true,
    staticAnalysis: true,
    asyncLoading: true
  },
  compatibility: {
    node: '>=14.0.0',
    browsers: ['Chrome 61+', 'Firefox 60+', 'Safari 10.1+']
  },
  buildInfo: {
    bundler: 'Rollup',
    plugins: ['@rollup/plugin-commonjs', '@rollup/plugin-node-resolve', '@rollup/plugin-terser'],
    timestamp: new Date().toISOString()
  }
};

logPro(complexData, { 
  filename: 'test-complex-data.json',
  show_timestamp: true,
  folder: 'esm-tests'
});

// 测试数组数据
const arrayData = [
  'ES Modules 支持',
  'CommonJS 兼容',
  'Rollup 构建',
  'TypeScript 类型定义',
  '源码映射支持'
];

logPro(arrayData, { 
  filename: 'test-array.json',
  folder: 'esm-tests'
});

console.log('✅ ES Modules 测试完成，请检查 logProLog 目录中的文件');
