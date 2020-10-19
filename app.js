const express = require('express');
const fs = require('fs');
const path = require('path');

// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require('body-parser');
// 引入multer中间件，用于处理上传的文件数据
const multer = require('multer');
//处理html文件转pdf文件
const pdf = require('html-pdf');


const app = express();
const prot = 3000;

// 读取静态资源
app.use(express.static('public'));
// 通过配置multer的dest属性， 将文件储存在项目下的tmp文件中
app.use(multer({ dest: './tmp/' }).any());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/updata.html')
});

app.post('/api/createPDF', (req, res) => {

    //重命名一下
    console.log(req.files[0].path);
    const filename = req.files[0].path + path.parse(req.files[0].originalname).ext;
    //pdf文件名
    const reportName = req.body.username + ' ' + req.body.reportDate + '.pdf';
    fs.rename(req.files[0].path, filename, (err) => {
        if (err) {
            res.send({
                code: 1,
                msg: '文件重命名出错！'
            });
        } else {
            console.log('上传的html文件重命名成功');
        };
    })
    console.log(filename);
    //读出来
    let html = fs.readFileSync(filename, 'utf8');
    const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    let cleanHtml = html;
    while (SCRIPT_REGEX.test(cleanHtml)) {
        cleanHtml = cleanHtml.replace(SCRIPT_REGEX, "");
    };
    // html-pdf 转换参数配置
    const options = {
        format: 'Letter',
        //phantomPath: "node_modules/phantomjs-prebuilt/bin/phantomjs"
    };
    pdf.create(cleanHtml, options).toFile('./tmp/123.pdf', (err, data) => {
        if (err) {
            res.send({
                code: 1,
                msg: '转换出错！'
            })
        } else {
            res.sendFile(data)
        }
    });
    res.send('ok');
    // pdf.create(html, options).toStream((err, stream) => {
    //     stream.pipe(() => {
    //         let pass = new stream.PassThrough();

    //     })
    // })
})

app.listen(prot, () => {
    console.log('服务启动了！');
})