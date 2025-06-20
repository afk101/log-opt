const { logPro, clearLogProLogs } = require('../index');

// 基本用法 - 输出字符串
logPro('这是一条基本日志信息');

// 输出对象
logPro({ 
  name: '测试对象', 
  value: 123,
  nested: {
    a: 1,
    b: 2
  }
});

// 输出数组
logPro([1, 2, 3, 'test', { key: 'value' }]);

// 输出到指定文件（带时间戳）
logPro('带时间戳的日志信息', 'timestamp.log', true, true);

// 输出到子文件夹
logPro('子文件夹日志', 'subfolder.txt', true, false, 1, 'debug');

// 持久化日志（服务重启不会清除）
logPro('这是一条持久化日志', 'important.log', false);

// 多行日志（增加行间距）
logPro('第一条日志', 'multiline.txt');
logPro('第二条日志（增加行间距）', 'multiline.txt', true, false, 3);
logPro('第三条日志', 'multiline.txt');

console.log('日志已写入 logProLog 目录'); 