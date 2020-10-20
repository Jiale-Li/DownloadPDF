const express = require('express');
const fs = require('fs');
const path = require('path');

// 引入poppeteer中间件，用来模拟一个浏览器
const puppeteer = require('puppeteer');

// 引入body-parser中间件，用来处理post请求体body中的数据
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();




const app = express();
const prot = 3000;

// 读取静态资源
app.use(express.static('public'));
app.use(jsonParser);






app.get('/', (req, res) => {
    res.sendFile(__dirname + '/updata.html')
});

app.post('/api/createPDF', (req, res) => {
    console.log(req.body);
    let { username, reportDate, url } = req.body;
    let reportName = username + reportDate + '.pdf';
    //转pdf的配置信息
    const options = {
        path: __dirname + '/tmp/' + reportName,
        format: 'A4',
        margin: {
            top: '1.5cm',
            left: '1.5cm',
            right: '1.5cm',
            bottom: '1.5cm'
        }

    };
    (async() => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.pdf(options);
        await browser.close();
        res.send({ code: 0, msg: 'ok' });
        console.log(reportName + '已创建');
    })();
})

app.listen(prot, () => {
    console.log('服务启动了！');
})