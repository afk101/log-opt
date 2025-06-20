// CommonJS 格式测试文件
console.log('=== 测试 CommonJS 格式导入 ===');

// 方式1: 使用原始的 index.js (CommonJS)
const { logPro: logProOriginal, clearLogProLogs: clearOriginal } = require('../index');

// 方式2: 使用构建后的 CommonJS 版本
const { logPro: logProCJS, clearLogProLogs: clearCJS } = require('../dist/index.cjs');

// 方式3: 使用开发版本的 CommonJS
const { logPro: logProDev, clearLogProLogs: clearDev } = require('../dist/index.dev.cjs');

console.log('✅ 所有 CommonJS 导入成功');

// 测试原始版本
console.log('\n--- 测试原始 CommonJS 版本 ---');
logProOriginal('测试原始CommonJS版本', { filename: 'test-original.txt' });

// 测试构建版本
console.log('--- 测试构建 CommonJS 版本 ---');
logProCJS('测试构建CommonJS版本', { filename: 'test-cjs.txt' });

// 测试开发版本
console.log('--- 测试开发 CommonJS 版本 ---');
logProDev('测试开发CommonJS版本', { filename: 'test-dev.txt' });

// 测试对象输出
const testData = {
  name: 'CommonJS测试',
  version: '1.0.0',
  features: ['双格式支持', 'Rollup构建', '向后兼容'],
  timestamp: new Date().toISOString()
};

logProCJS(testData, { 
  filename: 'test-object.json',
  show_timestamp: true 
});

console.log('✅ CommonJS 测试完成，请检查 logProLog 目录中的文件');
