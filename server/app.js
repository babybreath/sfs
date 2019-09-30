const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const conf = require('../config');

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
    let filePath = conf.FILE_PATH_LOCAL + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);

    console.log(`${filePath} saved.`);

    // => POST body
    ctx.body = {
      meta: { code: 200, message: 'ok' },
      data: `${conf.HOST || conf.LOCALHOST}/${FILE_PATH}/${file.name}`,
    };
  }
);

app.use(koaStatic(path.join(__dirname, conf.STATIC_PATH)));

app.use(router.routes());

app.listen(conf.SERVER_PORT);
console.log('server start...');
