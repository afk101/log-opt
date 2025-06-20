// 双格式支持演示
// 这个文件展示了如何在同一个项目中使用不同的模块格式

console.log('=== log-opt 双格式支持演示 ===\n');

// ES Modules 导入
import { logPro as logProESM, clearLogProLogs } from '../dist/index.esm.mjs';
import logOptDefault from '../dist/index.esm.mjs';

// 动态导入 CommonJS 版本进行对比
const { logPro: logProCJS } = await import('../dist/index.cjs');

console.log('✅ 成功导入 ES Modules 和 CommonJS 版本\n');

// 清理之前的日志
clearLogProLogs();

// 1. 基本功能对比测试
console.log('--- 基本功能对比测试 ---');

const testData = {
  format: 'dual-support',
  timestamp: new Date().toISOString(),
  features: ['CommonJS', 'ES Modules', 'TypeScript', 'Rollup']
};

// ES Modules 版本
logProESM('ES Modules 版本测试', { 
  filename: 'esm-version.txt',
  show_timestamp: true 
});

logProESM(testData, { 
  filename: 'esm-data.json',
  folder: 'comparison'
});

// CommonJS 版本
logProCJS('CommonJS 版本测试', { 
  filename: 'cjs-version.txt',
  show_timestamp: true 
});

logProCJS(testData, { 
  filename: 'cjs-data.json',
  folder: 'comparison'
});

// 2. 默认导出测试
console.log('--- 默认导出测试 ---');

logOptDefault.logPro('默认导出测试', { 
  filename: 'default-export.txt',
  folder: 'advanced'
});

// 3. 复杂数据结构测试
console.log('--- 复杂数据结构测试 ---');

const complexData = {
  project: 'log-opt',
  version: '1.0.0',
  build: {
    bundler: 'Rollup',
    formats: ['CommonJS', 'ES Modules'],
    plugins: [
      '@rollup/plugin-commonjs',
      '@rollup/plugin-node-resolve', 
      '@rollup/plugin-terser'
    ],
    outputs: [
      'dist/index.cjs',
      'dist/index.esm.mjs',
      'dist/index.dev.cjs',
      'dist/index.dev.esm.mjs'
    ]
  },
  compatibility: {
    node: '>=14.0.0',
    browsers: ['Chrome 61+', 'Firefox 60+', 'Safari 10.1+'],
    moduleFormats: ['CommonJS', 'ES Modules', 'UMD (future)']
  },
  features: {
    dualPackage: true,
    typeScript: true,
    sourceMaps: true,
    minification: true,
    treeShaking: true
  }
};

logProESM(complexData, {
  filename: 'project-info.json',
  show_timestamp: true,
  folder: 'metadata',
  line_breaks: 2
});

// 4. 性能对比测试
console.log('--- 性能对比测试 ---');

const performanceTest = async () => {
  const iterations = 100;
  
  // ES Modules 性能测试
  const esmStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    logProESM(`ESM Performance Test ${i}`, { 
      filename: 'esm-performance.txt',
      folder: 'performance'
    });
  }
  const esmEnd = performance.now();
  
  // CommonJS 性能测试
  const cjsStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    logProCJS(`CJS Performance Test ${i}`, { 
      filename: 'cjs-performance.txt',
      folder: 'performance'
    });
  }
  const cjsEnd = performance.now();
  
  const results = {
    iterations,
    esm: {
      time: esmEnd - esmStart,
      avgPerCall: (esmEnd - esmStart) / iterations
    },
    cjs: {
      time: cjsEnd - cjsStart,
      avgPerCall: (cjsEnd - cjsStart) / iterations
    }
  };
  
  logProESM(results, {
    filename: 'performance-results.json',
    show_timestamp: true,
    folder: 'performance'
  });
  
  return results;
};

const perfResults = await performanceTest();
console.log('性能测试完成:', {
  ESM: `${perfResults.esm.time.toFixed(2)}ms`,
  CJS: `${perfResults.cjs.time.toFixed(2)}ms`
});

// 5. 错误处理测试
console.log('--- 错误处理测试 ---');

try {
  // 测试循环引用对象
  const circularObj = { name: 'test' };
  circularObj.self = circularObj;
  
  logProESM(circularObj, { 
    filename: 'circular-test.txt',
    folder: 'error-handling'
  });
} catch (error) {
  logProESM(`错误处理测试: ${error.message}`, { 
    filename: 'error-log.txt',
    folder: 'error-handling'
  });
}

console.log('\n✅ 双格式支持演示完成！');
console.log('📁 请检查 logProLog 目录中生成的文件');
console.log('📊 查看不同格式版本的输出对比');

// 输出文件结构信息
const fileStructure = {
  'logProLog/': {
    'comparison/': ['esm-data.json', 'cjs-data.json'],
    'advanced/': ['default-export.txt'],
    'metadata/': ['project-info.json'],
    'performance/': ['esm-performance.txt', 'cjs-performance.txt', 'performance-results.json'],
    'error-handling/': ['circular-test.txt', 'error-log.txt'],
    'root': ['esm-version.txt', 'cjs-version.txt']
  }
};

logProESM(fileStructure, {
  filename: 'file-structure.json',
  show_timestamp: true,
  folder: 'metadata'
});
