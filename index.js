
var http = require('http'),url = require('url');
const puppeteer = require('puppeteer');

http.createServer(async function (req, res) {
  var query = url.parse(req.url, true).query;
  try {
  let browser = await puppeteer.launch({ headless: true,args: ['--no-sandbox'] });
  let page = await browser.newPage();
  await page.goto(`https://twitter.com/${query.user}`, { waitUntil: 'networkidle0' });

    let [ele1] = await page.$x(process.env.XPATH1);
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
        res.end('working');
        await browser.close();
    } catch (e) {
      res.end('notfound');
      await browser.close();
    }
    
  }
}).listen(process.env.PORT || 8080);

