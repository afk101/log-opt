const https = require('https');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // 用于控制台颜色输出

/**
 * 获取当前包的版本号
 * @returns {string} 当前包版本号
 */
function getCurrentVersion() {
  try {
    // 首先尝试获取已安装包的版本
    const packageName = 'log-opt';
    try {
      const packageMainPath = require.resolve(packageName);
      const packageDirPath = path.dirname(packageMainPath);
      const packageJsonPath = path.join(packageDirPath, 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        if (packageJson.name === packageName) {
          return packageJson.version || '1.0.0';
        }
      }
    } catch (e) {
      // 忽略错误
    }
    
    // 如果无法找到模块版本，回退到工作目录检查
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      if (packageJson.name === 'log-opt') {
        return packageJson.version || '1.0.0';
      }
    }
    
    return '1.0.0'; // 默认版本号
  } catch (error) {
    return '1.0.0'; // 默认版本号
  }
}

/**
 * 从npm registry获取最新的包版本
 * @param {string} packageName - npm包名称
 * @param {Function} callback - 回调函数，参数为最新版本号
 */
function getLatestVersion(packageName, callback) {
  const options = {
    hostname: 'registry.npmjs.org',
    path: `/${packageName}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    timeout: 8000 // 8秒超时
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const packageData = JSON.parse(data);
        const latestVersion = packageData['dist-tags'] && packageData['dist-tags'].latest;
        callback(null, latestVersion || null);
      } catch (error) {
        callback(error, null);
      }
    });
  });

  req.on('error', (error) => {
    callback(error, null);
  });

  req.on('timeout', () => {
    req.destroy();
    callback(new Error('请求超时'), null);
  });

  req.end();
}

/**
 * 检查包是否有新版本
 * @param {string} packageName - npm包名称
 * @param {number} maxRetries - 最大重试次数
 */
function checkForUpdates(packageName = 'log-opt', maxRetries = 2) {
  let retryCount = 0;
  const currentVersion = getCurrentVersion();
  
  const checkVersion = () => {
    getLatestVersion(packageName, (error, latestVersion) => {
      if (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkVersion, 500); // 延迟500毫秒后重试
        }
        return; // 静默处理错误
      }

              // 比较版本
        if (latestVersion && currentVersion !== latestVersion) {
          const updateMessage = `WARNING: Please install the latest version of ${packageName} ==>  npm install ${packageName}@latest`;
          
          // 检查是否支持彩色输出
        if (chalk.supportsColor) {
          console.warn(chalk.red(updateMessage));
        } else {
          console.warn(updateMessage);
        }
      }
    });
  };

  // 异步执行版本检查
  setTimeout(checkVersion, 0);
}

module.exports = {
  getCurrentVersion,
  checkForUpdates
}; 