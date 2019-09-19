const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const koaStatic = require('koa-static');

const SERVER_PORT = 6300;

const os = require('os');
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
const myHost = getIPAdress();

const DOMAIN = '' || `http://${myHost}:${SERVER_PORT}`;

const staticPath = path.join(__dirname, '../static');

const FILE_PATH = 'file';
const FILE_PATH_LOCAL = path.join(staticPath, FILE_PATH);
try {
  fs.accessSync(staticPath, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  fs.mkdirSync(staticPath);
}
try {
  fs.accessSync(FILE_PATH_LOCAL, fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
  fs.mkdirSync(FILE_PATH_LOCAL);
}

router.post(
  '/upload',
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 1024 * 1024 * 1024, // 设置上传文件大小最大限制 1GB
    },
  }),
  ctx => {
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path);
    let filePath = FILE_PATH_LOCAL + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);

    console.log(`${filePath} saved.`);

    // => POST body
    ctx.body = {
      meta: { code: 200, message: 'ok' },
      data: `${DOMAIN}/${FILE_PATH}/${file.name}`,
    };
  }
);

app.use(koaStatic(staticPath));

app.use(router.routes());

app.listen(SERVER_PORT);
console.log('curl -i http://localhost:3000/users -d "name=test"');
