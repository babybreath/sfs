// 配置文件
const fs = require('fs');
const os = require('os');
const path = require('path');
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
const localIp = getIPAdress();
const SERVER_PORT = 6300;

const conf = {
  // 服务端口
  SERVER_PORT,
  // 自定义域名
  HOST: '',
  // 否则使用本地IP
  LOCALHOST: `http://${localIp}:${SERVER_PORT}`,
  // 静态处理路径
  STATIC_PATH: '../static',
  // 文件根路径
  FILE_PATH: 'file',
};

conf.FILE_PATH_LOCAL = path.join(conf.STATIC_PATH, conf.FILE_PATH);

// 创建静态文件路径文件夹
try {
  fs.accessSync(conf.STATIC_PATH, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  fs.mkdirSync(conf.STATIC_PATH);
}
try {
  fs.accessSync(conf.FILE_PATH_LOCAL, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  fs.mkdirSync(conf.FILE_PATH_LOCAL);
}

exports = conf;
