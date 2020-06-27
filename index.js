var http = require('http'), url = require('url'), puppeteer = require('puppeteer');
http.createServer(async function (req, res) {
  var query = url.parse(req.url, true).query;
  var browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  var page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
  await page.goto(`https://twitter.com/${query.user}`);
  try {
    var em = await page.waitForXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div/div/div/div[2]/div[1]/span', { timeout: 2500, visible: true })
    var raw = await (await em.getProperty('textContent')).jsonValue()
    if (raw == 'Caution: This account is temporarily restricted') {
      res.end('restricted');
    }
    else if (raw == 'Account suspended') {
      res.end('suspended');
    }
    else if (raw == 'This account doesn’t exist') {
      res.end('notfound');
    }
    else if (raw == 'These Tweets are protected') {
      res.end('protected');
    }
    await browser.close();
  } catch (e) {
    res.end('working');
    await browser.close();
  }
}).listen(process.env.PORT || 8080);
