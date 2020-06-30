













var express = require("express");
var app = express();

app.get("/user/:user", async function (req, res) {
    var user = req["params"]["user"];
    try {
        var puppeteer = require("puppeteer");
        var browser = await puppeteer.launch({headless: true,args: ["--no-sandbox"]});
        let page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
        await page.goto(`https://twitter.com/${user}`);
        let em = await page.waitForXPath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div/div/div/div[2]/div[1]/span',{ visible: true });
        let eme = await em.getProperty("textContent");
        let raw = await eme.jsonValue();
        if (raw == "Caution: This account is temporarily restricted") {
            res.end("restricted");
        } else if (raw == "Account suspended") {
            res.end("suspended");
        } else if (raw == "This account doesn’t exist") {
            res.end("notfound");
        } else if (raw == "These Tweets are protected") {
            res.end("protected");
        }
        await browser.close();
    } catch (e) {
        console.log(e.message);
        res.end("working");
        await browser.close();
    }
});
app.listen(8080);
