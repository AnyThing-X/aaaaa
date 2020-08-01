const ytScraper = require("yt-scraper")
const http = require('http'), url = require('url')
http.createServer(async function (req, res) {
    let query = url.parse(req.url, true).query;
    if (query.user) {
        ytScraper.videoInfo(query.user)
        .then(data => {
            res.end(`Title : ${data.title}\nDescription : ${data.description}\n${data.url}`)
        });
    }
}).listen(8080);
