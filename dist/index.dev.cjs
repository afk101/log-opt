'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var process = require('process');
var child_process = require('child_process');

// ES模块入口文件 - 将CommonJS模块转换为ES模块导出

// 定义全局变量
let _temp_dir = null;
// 检查是否为生产环境
const _is_production = process.env.NODE_ENV === "production";

/**
 * 获取日志主目录和临时目录的路径
 * @returns {Array} 元组 [主目录路径, 临时目录路径]
 */
function _get_log_dirs() {
  // 主目录路径
  const root_dir = process.cwd();
  const main_log_dir = path.join(root_dir, "logProLog");

  // 临时目录路径（使用进程ID确保多进程安全）
  const temp_dir_name = `temp_${process.pid}`;
  const temp_log_dir = path.join(main_log_dir, temp_dir_name);

  return [main_log_dir, temp_log_dir];
}

/**
 * 检查进程是否存在
 * @param {number} pid 进程ID
 * @returns {boolean} 进程是否存在
 */
function _pid_exists(pid) {
  try {
    // 在不同操作系统上检查进程是否存在
    if (process.platform === 'win32') {
      // Windows
      child_process.execSync(`tasklist /FI "PID eq ${pid}" /NH`);
      return true;
    } else {
      // Linux/Mac
      process.kill(pid, 0);
      return true;
    }
  } catch (e) {
    return false;
  }
}

/**
 * 初始化日志目录，如果发现旧的临时目录则进行清理
 */
function _initialize_log_dirs() {
  // 如果是生产环境，不执行任何操作
  if (_is_production) {
    return;
  }

  const [main_log_dir, temp_log_dir] = _get_log_dirs();
  _temp_dir = temp_log_dir;

  // 创建主日志目录（如果不存在）
  if (!fs.existsSync(main_log_dir)) {
    fs.mkdirSync(main_log_dir, { recursive: true });
  }

  // 检查是否存在旧的临时目录（可能是由于上次程序异常退出导致）
  const temp_parent_dir = path.dirname(temp_log_dir);
  if (fs.existsSync(temp_parent_dir)) {
    fs.readdirSync(temp_parent_dir).forEach(item => {
      // 只处理temp_开头的目录
      if (item.startsWith("temp_") && fs.statSync(path.join(temp_parent_dir, item)).isDirectory()) {
        try {
          // 从目录名提取进程ID
          const pid_str = item.split('_')[1];
          const pid = parseInt(pid_str);
          
          // 检查进程是否仍在运行
          if (!_pid_exists(pid)) {
            // 进程不存在，可以安全删除临时目录
            const old_temp_dir = path.join(temp_parent_dir, item);
            fs.rmSync(old_temp_dir, { recursive: true, force: true });
          }
        } catch (e) {
          // 目录名格式不正确或其他错误，不处理
          console.error(`清理旧临时目录时出错: ${e.message}`);
        }
      }
    });
  }

  // 创建新的临时目录
  if (!fs.existsSync(temp_log_dir)) {
    fs.mkdirSync(temp_log_dir, { recursive: true });
  }
}

/**
 * 将内容写入到根目录的logProLog文件夹下的指定文件中，支持多种数据类型的输出。
 * 在生产环境中，此函数不执行任何操作。
 *
 * @param {any} content 要输出的内容，可以是任意类型（字符串、对象、数组等）
 * @param {Object} [options] 配置选项
 * @param {string} [options.filename="default.txt"] 输出文件名，支持各种扩展名如.txt、.json、.js等。如果没有提供后缀，将自动添加.txt
 * @param {boolean} [options.clear_on_restart=true] 是否在服务重启时清空输出文件
 * @param {boolean} [options.show_timestamp=false] 是否显示时间戳
 * @param {number} [options.line_breaks=1] 每条记录之间的空行数，默认为1（即一条记录后空一行）
 * @param {string|null} [options.folder=null] 子文件夹路径，例如'block'或'block/text'
 * @param {boolean} [options.forceWrite=true] 是否强制使用写入模式（覆盖已有内容）
 */
function logPro(content, options = {}) {
  // 处理配置参数
  let filename = options.filename || "default.txt";
  const clear_on_restart = options.clear_on_restart !== undefined ? options.clear_on_restart : true;
  const show_timestamp = options.show_timestamp || false;
  const line_breaks = options.line_breaks !== undefined ? options.line_breaks : 1;
  const folder = options.folder || null;
  const forceWrite = options.forceWrite !== undefined ? options.forceWrite : true;

  // 在生产环境中，此函数不执行任何操作
  if (_is_production) {
    return;
  }

  // 确保日志目录已初始化
  if (_temp_dir === null) {
    _initialize_log_dirs();
  }

  const [main_log_dir, temp_log_dir] = _get_log_dirs();

  // 检查文件名是否包含后缀，如果不包含则添加.txt后缀
  if (!filename.includes(".")) {
    filename = `${filename}.txt`;
  }

  // 根据clear_on_restart参数决定文件的存放位置和命名
  let log_dir;
  let log_file;
  
  if (clear_on_restart) {
    // 非持久化文件，放在临时目录中
    log_dir = temp_log_dir;
    // 如果指定了folder，则在临时目录下创建相应的子文件夹
    if (folder) {
      log_dir = path.join(log_dir, folder);
    }
    log_file = path.join(log_dir, filename);
  } else {
    // 持久化文件，添加前缀并放在主目录中（不考虑folder参数）
    log_dir = main_log_dir;
    if (!filename.startsWith("persistent_")) {
      filename = `persistent_${filename}`;
    }
    log_file = path.join(log_dir, filename);
  }

  // 确保目录存在
  if (!fs.existsSync(log_dir)) {
    fs.mkdirSync(log_dir, { recursive: true });
  }

  // 处理不同类型的内容
  let output;
  if (typeof content === 'object') {
    try {
      // 尝试将内容格式化为JSON字符串
      output = JSON.stringify(content, null, 2);
    } catch {
      // 如果无法转为JSON，则直接转为字符串
      output = String(content);
    }
  } else {
    output = String(content);
  }

  // 构建输出字符串
  let formatted_output = "";

  // 添加时间戳（如果需要）
  if (show_timestamp) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 23);
    formatted_output += `[${timestamp}]\n`;
  }

  // 添加内容
  formatted_output += output;

  // 添加结尾的换行
  formatted_output += '\n'.repeat(line_breaks + 1);

  // 根据参数和文件状态选择写入模式
  // 1. 如果clear_on_restart=false，则始终使用追加模式
  // 2. 如果clear_on_restart=true，则根据forceWrite和文件初始化情况决定
  let write_mode = 'a';
  if (clear_on_restart) {
    if (
      forceWrite ||
      !fs.existsSync(log_file) ||
      !logPro._initialized_files
    ) {
      write_mode = 'w';
      // 创建已初始化文件集合（如果不存在）
      if (!logPro._initialized_files) {
        logPro._initialized_files = new Set();
      }
      // 记录此文件已被初始化
      logPro._initialized_files.add(log_file);
    }
  }

  // 写入文件
  fs.writeFileSync(log_file, formatted_output, { encoding: 'utf-8', flag: write_mode });
}

/**
 * 将源目录中的所有文件移动到目标目录
 *
 * @param {string} source_dir 源目录路径
 * @param {string} target_dir 目标目录路径
 */
function _migrate_files(source_dir, target_dir) {
  if (_is_production || !fs.existsSync(source_dir)) {
    return;
  }

  // 确保目标目录存在
  if (!fs.existsSync(target_dir)) {
    fs.mkdirSync(target_dir, { recursive: true });
  }

  // 首先清空目标目录中的非持久化文件（处理带时间戳文件名的情况）
  if (fs.existsSync(target_dir)) {
    fs.readdirSync(target_dir).forEach(item => {
      // 保留持久化文件和临时目录
      if (item.startsWith("persistent_") || item.startsWith("temp_")) {
        return;
      }

      const target_path = path.join(target_dir, item);
      try {
        if (fs.statSync(target_path).isFile()) {
          fs.unlinkSync(target_path);
        } else if (fs.statSync(target_path).isDirectory()) {
          fs.rmSync(target_path, { recursive: true, force: true });
        }
      } catch (e) {
        console.error(`删除目标目录文件/文件夹 ${target_path} 时出错: ${e.message}`);
      }
    });
  }

  // 遍历源目录中的所有文件和子目录
  fs.readdirSync(source_dir).forEach(item => {
    const source_path = path.join(source_dir, item);
    const target_path = path.join(target_dir, item);

    if (fs.statSync(source_path).isFile()) {
      // 如果目标目录已存在同名文件，先删除
      if (fs.existsSync(target_path)) {
        fs.unlinkSync(target_path);
      }
      // 移动文件
      fs.renameSync(source_path, target_path);
    } else if (fs.statSync(source_path).isDirectory()) {
      // 如果是子目录，递归处理
      _migrate_files(source_path, target_path);
    }
  });
}

/**
 * 清理指定目录中的所有非持久化文件
 *
 * @param {string} directory 要清理的目录路径
 */
function _cleanup_non_persistent_files(directory) {
  if (_is_production || !fs.existsSync(directory)) {
    return;
  }

  fs.readdirSync(directory).forEach(item => {
    // 跳过临时目录和持久化文件
    if (item.startsWith("temp_") || item.startsWith("persistent_")) {
      return;
    }

    const path_item = path.join(directory, item);
    try {
      if (fs.statSync(path_item).isFile()) {
        fs.unlinkSync(path_item);
      }
    } catch (e) {
      console.error(`删除文件 ${path_item} 时出错: ${e.message}`);
    }
  });
}

/**
 * 执行清理和迁移操作：
 * 1. 清理主目录中的非持久化文件
 * 2. 将临时目录中的文件移动到主目录
 * 3. 删除临时目录
 */
function _cleanup() {
  // 在生产环境中，不执行任何操作
  if (_is_production) {
    return;
  }

  // 如果临时目录未初始化，则无需清理
  if (_temp_dir === null) {
    return;
  }

  const [main_log_dir, temp_log_dir] = _get_log_dirs();

  try {
    // 1. 清理主目录中的非持久化文件
    _cleanup_non_persistent_files(main_log_dir);

    // 2. 将临时目录中的文件移动到主目录
    _migrate_files(temp_log_dir, main_log_dir);

    // 3. 删除临时目录
    if (fs.existsSync(temp_log_dir)) {
      fs.rmSync(temp_log_dir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error(`执行清理操作时出错: ${e.message}`);
  }
}

/**
 * 清空logProLog目录下的文件
 *
 * @param {boolean} include_persistent 是否包括持久化文件，默认为false
 */
function clearLogProLogs(include_persistent = false) {
  // 在生产环境中，不执行任何操作
  if (_is_production) {
    return;
  }

  const [main_log_dir] = _get_log_dirs();

  if (fs.existsSync(main_log_dir)) {
    try {
      if (include_persistent) {
        // 如果包括持久化文件，则删除整个目录并重新创建
        fs.rmSync(main_log_dir, { recursive: true, force: true });
        fs.mkdirSync(main_log_dir, { recursive: true });
      } else {
        // 否则，只删除非持久化文件
        fs.readdirSync(main_log_dir).forEach(item => {
          // 跳过持久化文件
          if (item.startsWith("persistent_")) {
            return;
          }

          const item_path = path.join(main_log_dir, item);
          try {
            if (fs.statSync(item_path).isFile()) {
              fs.unlinkSync(item_path);
            } else if (fs.statSync(item_path).isDirectory()) {
              fs.rmSync(item_path, { recursive: true, force: true });
            }
          } catch (e) {
            console.error(`清空logProLog目录时出错: ${e.message}`);
          }
        });
      }
    } catch (e) {
      console.error(`清空logProLog目录时出错: ${e.message}`);
    }
  }
}

// 注册程序退出时的清理函数
if (!_is_production) {
  process.on('exit', _cleanup);
  // 捕获意外终止信号
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, () => {
      _cleanup();
      process.exit(0);
    });
  });
}

// 在导入模块时初始化日志目录（非生产环境）
if (!_is_production) {
  _initialize_log_dirs();
}

// 默认导出
var index_esm = {
  logPro,
  clearLogProLogs,
  _initialize_log_dirs,
  _cleanup
};

exports._cleanup = _cleanup;
exports._initialize_log_dirs = _initialize_log_dirs;
exports.clearLogProLogs = clearLogProLogs;
exports.default = index_esm;
exports.logPro = logPro;
//# sourceMappingURL=index.dev.cjs.map
