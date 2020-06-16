const http = require('http'), url = require('url'), puppeteer = require('puppeteer');;
http.createServer(async function (req, res) {
    let query = url.parse(req['url'], true).query;
    let browser = await puppeteer.launch({ headless: true, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    let page = await browser.newPage();
    await page.goto(`https://twitter.com/${query['user']}`, { waitUntil: 'networkidle0' });
    try {
        let [ele1] = await page.$x(process.env.xpath1);
        let rawTxt1 = await (await ele1.getProperty('textContent')).jsonValue();
        if (rawTxt1 == 'Caution: This account is temporarily restricted') {
            res.end('restricted');
        }
        else if (rawTxt1 == 'Account suspended') {
            res.end('suspended');
        }
        else if (rawTxt1 == 'This account doesn’t exist') {
            res.end('notfound');
        }
        await browser.close();
    } catch (e) {
        try {
            let [ele2] = await page.$x(process.env.xpath2);
            let rawTxt2 = await (await ele2.getProperty('textContent')).jsonValue();
            if (rawTxt2 == 'Tweets') {
                res.end('working'); await browser.close();
            }
        } catch (e) {
            res.end('notfound'); await browser.close();
        }
    }
}).listen(process.env.PORT || 8080);
