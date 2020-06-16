const puppeteer = require('puppeteer');
let results = JSON.parse(`{"restricted": false,"suspended": false,"notfound": false,"working": false}`);
const express = require("express");
var app = express();
app.get('/:user', async function (req, res) {
  let browser = await puppeteer.launch({ headless: true, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  let page = await browser.newPage();
  await page.goto(`https://twitter.com/${req['params']['user']}`, { waitUntil: 'networkidle0' });
  try {
    let [ele1] = await page.$x(process.env.XPATH1);
    let rawTxt1 = await (await ele1.getProperty('textContent')).jsonValue();
    if (rawTxt1 == 'Caution: This account is temporarily restricted') { results['restricted'] = true; }
    else if (rawTxt1 == 'Account suspended') { results['suspended'] = true; }
    else if (rawTxt1 == 'This account doesn’t exist') { results['notfound'] = true; }
    await browser.close();
  } catch (e) {
    try {
      let [ele2] = await page.$x(process.env.XPATH2);
      let rawTxt2 = await (await ele2.getProperty('textContent')).jsonValue();
      if (rawTxt2 == 'Tweets') { results['working'] = true; await browser.close(); }
    } catch (e) {
      results['notfound'] = true; await browser.close();
    }
  }
  res.type('json').send(JSON.stringify(results, null, 2));
});
app.listen(process.env.PORT||8080);
