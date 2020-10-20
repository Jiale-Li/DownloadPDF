const express = require('express');
// 引入poppeteer中间件，用来模拟一个浏览器
const puppeteer = require('puppeteer');

// 引入body-parser中间件，用来处理post请求body中的数据
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();




const app = express();
const prot = 3000;

// 读取静态资源
//app.use(express.static('public'));
app.use(jsonParser);

app.post('/api/createPDF', (req, res) => {
    //console.log(req.body);
    //解析请求体
    let { username, reportDate, url } = req.body;
    //pdf文件命名
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

    //转pdf
    (async() => {
        //加载浏览器
        const browser = await puppeteer.launch();
        //加载页面
        const page = await browser.newPage();
        //打开网址
        await page.goto(url, { waitUntil: 'networkidle2' });
        //打印pdf
        await page.pdf(options);
        //关闭浏览器
        await browser.close();
        res.send({ code: 0, msg: 'ok' });
        console.log(reportName + '已创建    ' + Date().toLocaleString());
    })();
})

app.listen(prot, () => {
    console.log('服务启动了！');
})