const http = require('http'), url = require('url'), puppeteer = require('puppeteer');
http.createServer(async function (req, res) {
    let query = url.parse(req.url, true).query;
    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    let page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(`https://twitter.com/${query.user}`);
    try {
        let em = await page.waitForXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div/div/div/div[2]/div[1]/span', { timeout: 2500, visible: true })
        let raw = await (await em.getProperty('textContent')).jsonValue()

        if (raw == 'Caution: This account is temporarily restricted') {
            res.end('restricted');
        }
        else if (raw == 'Account suspended') {
            res.end('suspended');
        }
        else if (raw == 'This account doesn’t exist') {
            res.end('notfound');
        }
        await browser.close();
    } catch (e) {
        res.end('working');
        await browser.close();
    }
}).listen(process.env.PORT || 8080);
