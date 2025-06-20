/**
 * log-opt TypeScript 类型定义
 * 增强版日志工具，支持多种数据类型输出和临时/持久化存储
 */

/**
 * 日志配置选项
 */
export interface LogProOptions {
  /** 输出文件名，支持各种扩展名如.txt、.json、.js等。如果没有提供后缀，将自动添加.txt */
  filename?: string;
  /** 是否在服务重启时清空输出文件，默认为true */
  clear_on_restart?: boolean;
  /** 是否显示时间戳，默认为false */
  show_timestamp?: boolean;
  /** 每条记录之间的空行数，默认为1（即一条记录后空一行） */
  line_breaks?: number;
  /** 子文件夹路径，例如'block'或'block/text' */
  folder?: string | null;
  /** 是否强制使用写入模式（覆盖已有内容），默认为true */
  forceWrite?: boolean;
}

/**
 * 将内容写入到根目录的logProLog文件夹下的指定文件中，支持多种数据类型的输出。
 * 在生产环境中，此函数不执行任何操作。
 * 
 * @param content 要输出的内容，可以是任意类型（字符串、对象、数组等）
 * @param options 配置选项
 */
export function logPro(content: any, options?: LogProOptions): void;

/**
 * 清空logProLog目录下的文件
 * 
 * @param include_persistent 是否包括持久化文件，默认为false
 */
export function clearLogProLogs(include_persistent?: boolean): void;

/**
 * 初始化日志目录，如果发现旧的临时目录则进行清理
 * 内部函数，通常不需要手动调用
 */
export function _initialize_log_dirs(): void;

/**
 * 执行清理和迁移操作：
 * 1. 清理主目录中的非持久化文件
 * 2. 将临时目录中的文件移动到主目录
 * 3. 删除临时目录
 * 内部函数，通常不需要手动调用
 */
export function _cleanup(): void;

/**
 * 默认导出对象，包含所有可用的函数
 */
declare const logOpt: {
  logPro: typeof logPro;
  clearLogProLogs: typeof clearLogProLogs;
  _initialize_log_dirs: typeof _initialize_log_dirs;
  _cleanup: typeof _cleanup;
};

export default logOpt;

/**
 * CommonJS 兼容性导出
 * 当使用 require() 导入时的类型定义
 */
export = logOpt;
