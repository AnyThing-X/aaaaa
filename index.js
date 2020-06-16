const express = require('express')
const puppeteer = require('puppeteer');
const app = express();
app.get('/user/:user', async function (req, res) {
    let browser = await puppeteer.launch({ headless: true, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    let page = await browser.newPage();
    await page.goto(`https://twitter.com/${req['params']['user']}`, { waitUntil: 'networkidle0' });
    try {
        let [ele1] = await page.$x('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div/div/div/div[2]/div[1]/span');
        let rawTxt1 = await (await ele1.getProperty('textContent')).jsonValue();
        
        if (rawTxt1 == 'Caution: This account is temporarily restricted') {
            res.end('restricted');
            return
        }
        else if (rawTxt1 == 'Account suspended') {
            res.end('suspended');
            return
        }
        else if (rawTxt1 == 'This account doesn’t exist') {
            res.end('notfound');
            return
        }
        await browser.close();
    } catch (e) {
        try {
            let [ele2] = await page.$x('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[1]/div/div/div/div/nav/div[2]/div[1]/a/div/span');
            let rawTxt2 = await (await ele2.getProperty('textContent')).jsonValue();
            if (rawTxt2 == 'Tweets') {
                res.end('working');
                await browser.close();
                return
            }
        } catch (e) {
            res.end('notfound');
            await browser.close();
            return
        }
    }

});
app.listen(3000);
