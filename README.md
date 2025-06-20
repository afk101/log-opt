# logPro

增强版日志工具，支持多种数据类型输出和临时/持久化存储。

## 功能特点

- 支持多种数据类型输出（字符串、对象、数组等）
- 支持临时日志和持久化日志
- 支持自动清理过期日志
- 支持添加时间戳
- 支持多级目录结构
- 生产环境自动禁用日志功能
- 简洁直观的参数传递方式

## 安装

```bash
npm install log-pro
```

## 使用方法

```javascript
const { logPro, clearLogProLogs } = require('log-pro');

// 基本用法
logPro('这是一条普通日志');

// 输出对象
logPro({ name: '测试', value: 123 });

// 输出到指定文件（带时间戳）
logPro('带时间戳的日志', {
  filename: 'debug.log',
  show_timestamp: true
});

// 输出到子文件夹
logPro('子文件夹日志', {
  filename: 'sublog.txt',
  folder: 'subfolder'
});

// 持久化日志（服务重启不会清除）
logPro('这是一条持久化日志', {
  filename: 'important.log',
  clear_on_restart: false
});

// 清理所有临时日志
clearLogProLogs();

// 清理所有日志（包括持久化日志）
clearLogProLogs(true);
```

## API

### logPro(content, options)

将内容写入到指定文件中。

#### 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | any | - | 要输出的内容，可以是任意类型（字符串、对象、数组等） |
| options | object | {} | 配置选项对象 |

#### options 配置选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| filename | string | "default.txt" | 输出文件名 |
| clear_on_restart | boolean | true | 是否在服务重启时清空输出文件 |
| show_timestamp | boolean | false | 是否显示时间戳 |
| line_breaks | number | 1 | 每条记录之间的空行数 |
| folder | string | null | 子文件夹路径 |
| forceWrite | boolean | true | 是否强制使用写入模式（覆盖已有内容） |

### clearLogProLogs(include_persistent)

清空日志目录下的文件。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| include_persistent | boolean | false | 是否包括持久化文件 |

## 环境变量

- `ENVIRONMENT`: 设置为 "production" 时，禁用所有日志功能

## 注意事项

1. 临时日志存储在 `logProLog/temp_[进程ID]/` 目录下
2. 持久化日志存储在 `logProLog/` 目录下，文件名前缀为 `persistent_`
3. 程序正常退出时会自动清理临时目录
4. 程序异常退出后，下次启动时会自动清理不再运行的进程的临时目录 