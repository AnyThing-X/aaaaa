var ytScraper = require("yt-scraper")
var http = require('http'), url = require('url')
http.createServer(async function (req, res) {
    let query = url.parse(req.url, true).query;
    if (query.id) {
        ytScraper.videoInfo(query.id)
        .then(data => {
            res.end(`Title : ${data.title}\nDescription : ${data.description}\n${data.url}`)
        });
    }
}).listen(8080);
