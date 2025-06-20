const { 
  logPro, 
  clearLogProLogs,
  _initialize_log_dirs,
  _cleanup
} = require('./src/logPro');
const { getCurrentVersion, checkForUpdates } = require('./src/versionCheck');

// 导入时自动检查版本
checkForUpdates();

module.exports = {
  logPro,
  clearLogProLogs,
  _initialize_log_dirs,
  _cleanup
};
