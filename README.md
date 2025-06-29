# log-opt

增强版日志工具，支持多种数据类型输出和临时/持久化存储。现在支持 **CommonJS** 和 **ES Modules** 双格式输出！

## 🚀 功能特点

- ✅ **双模块格式支持**: CommonJS 和 ES Modules
- ✅ **多种数据类型输出**: 字符串、对象、数组等
- ✅ **临时/持久化日志**: 灵活的存储策略
- ✅ **自动清理**: 过期日志自动清理
- ✅ **时间戳支持**: 可选的时间戳功能
- ✅ **多级目录**: 支持子文件夹组织
- ✅ **生产环境优化**: 自动禁用日志功能
- ✅ **TypeScript 支持**: 完整的类型定义
- ✅ **Rollup 构建**: 优化的打包输出

## 📦 安装

```bash
# 推荐作为开发依赖安装
npm install -D log-opt

# 或者作为生产依赖安装
npm install log-opt
```

## 🔧 使用方法

### CommonJS (传统方式)

```javascript
const { logPro, clearLogProLogs } = require('log-opt');

// 基本用法
logPro('这是一条普通日志');
```

### ES Modules (现代方式)

```javascript
// 命名导入
import { logPro, clearLogProLogs } from 'log-opt';

// 默认导入
import logOpt from 'log-opt';
const { logPro, clearLogProLogs } = logOpt;

// 混合导入
import logOpt, { logPro } from 'log-opt';
```

### 基本示例

```javascript
// 输出字符串
logPro('这是一条普通日志');

// 输出对象
logPro({ name: '测试', value: 123, data: [1, 2, 3] });

// 输出到指定文件（带时间戳）
logPro('带时间戳的日志', {
  filename: 'debug.log',
  show_timestamp: true
});

// 输出到子文件夹
logPro('子文件夹日志', {
  filename: 'sublog.txt',
  folder: 'api/debug'
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

## 📁 构建输出

项目提供多种构建格式：

- `dist/index.cjs` - 压缩的 CommonJS 版本
- `dist/index.esm.mjs` - 压缩的 ES Modules 版本
- `dist/index.dev.cjs` - 开发版 CommonJS
- `dist/index.dev.esm.mjs` - 开发版 ES Modules

## 🛠️ 构建脚本

```bash
# 完整构建
npm run build

# 开发版本构建
npm run build:dev

# 生产版本构建
npm run build:prod

# 清理构建文件
npm run clean

# 测试 CommonJS
npm run test:cjs

# 测试 ES Modules
npm run test:esm
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

## 🌍 环境变量

在生产环境中，log-opt 会自动禁用所有日志功能以提升性能。支持以下环境变量：

- `NODE_ENV`: 设置为 "production" 或 "prod" 时禁用日志
- `ENVIRONMENT`: 设置为 "production" 或 "prod" 时禁用日志
- `ENV`: 设置为 "production" 或 "prod" 时禁用日志
- `APP_ENV`: 设置为 "production" 或 "prod" 时禁用日志

```bash
# 任何一种方式都可以禁用日志功能
NODE_ENV=production node your-app.js
ENVIRONMENT=prod node your-app.js
ENV=production node your-app.js
APP_ENV=prod node your-app.js
```

## 📝 TypeScript 支持

```typescript
import { logPro, LogProOptions } from 'log-opt';

const options: LogProOptions = {
  filename: 'typed.log',
  show_timestamp: true,
  folder: 'typescript'
};

logPro('TypeScript 支持', options);
```

## 🔧 兼容性

- **Node.js**: >= 14.0.0
- **浏览器**: 支持 ES2015+ 的现代浏览器
- **模块系统**: CommonJS 和 ES Modules

## 📂 文件结构

```
项目根目录/
├── logProLog/                 # 主日志目录
│   ├── temp_[PID]/           # 临时目录（按进程ID）
│   │   ├── default.txt       # 默认日志文件
│   │   ├── custom.log        # 自定义文件
│   │   └── debug/            # 子文件夹
│   │       └── api.txt
│   └── persistent_*.log      # 持久化文件
```

## ⚠️ 注意事项

1. **临时日志**: 存储在 `logProLog/temp_[进程ID]/` 目录下
2. **持久化日志**: 存储在 `logProLog/` 目录下，文件名前缀为 `persistent_`
3. **自动清理**: 程序正常退出时会自动清理临时目录
4. **异常恢复**: 程序异常退出后，下次启动时会自动清理不再运行的进程的临时目录
5. **生产环境**: 设置任何支持的环境变量为 `production` 或 `prod` 时，所有日志函数都不会执行

## 📖 更多示例

查看 `examples/` 目录中的示例文件：

- `examples/basic.js` - 基本用法示例
- `examples/test-cjs.js` - CommonJS 测试
- `examples/test-esm.mjs` - ES Modules 测试
- `examples/dual-format-demo.mjs` - 双格式支持演示

## 📄 许可证

MIT License