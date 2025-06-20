const { logPro, clearLogProLogs } = require('../index');

// 先生成一些日志文件
console.log('生成测试日志文件...');

// 生成临时日志
logPro('临时日志1', {
  filename: 'temp1.log'
});

logPro('临时日志2', {
  filename: 'temp2.log'
});

logPro('临时子文件夹日志', {
  filename: 'subfolder.txt',
  folder: 'debug'
});

// 生成持久化日志
logPro('持久化日志1', {
  filename: 'persist1.log',
  clear_on_restart: false
});

logPro('持久化日志2', {
  filename: 'persist2.log',
  clear_on_restart: false
});

console.log('日志文件已生成');
console.log('清理所有临时日志文件...');

// 清理所有临时日志（不包括持久化日志）
clearLogProLogs();

console.log('临时日志已清理');
console.log('清理所有日志文件（包括持久化日志）...');

// 清理所有日志（包括持久化日志）
clearLogProLogs(true);

console.log('所有日志已清理'); 