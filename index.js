const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
app.get("/user/:user", async function (req, res) {
    let user = req["params"]["user"];
    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    let page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(`https://twitter.com/${user}`, { waitUntil: 'networkidle0' });
    let text = await page.$eval('*', el => el.innerText);
    //console.log(text);
    res.end(text);
    await browser.close();
});
app.listen(8080);
