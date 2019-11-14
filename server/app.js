const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const conf = require('../config');

app.use(koaStatic(conf.STATIC_PATH));

router.post(
  conf.UPLOAD_PATH,
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: conf.UPLOAD_FILE_MAX_SIZE, // 设置上传文件大小最大限制
    },
  }),
  async ctx => {
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path);
    let filePath = conf.FILE_PATH_LOCAL + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 返回下载地址
    const downloadUrl = `${conf.HOST || conf.LOCALHOST}/${conf.FILE_PATH}/${
      file.name
    }`;

    // 可读流通过管道写入可写流
    await new Promise((resolve, reject) => {
      reader
        .pipe(upStream)
        .on('error', err => {
          reject(err);
        })
        .on('finish', () => {
          console.log(`${filePath} saved.`);
          resolve();
        });
    });
    ctx.body = {
      meta: { code: 200, message: 'ok' },
      data: downloadUrl,
    };
  }
);

app.use(router.routes());

app.listen(conf.SERVER_PORT);
// 错误处理
app.on('error', err => {
  console.log(err);
});
console.log(`server start at ${conf.HOST || conf.LOCALHOST}`);
