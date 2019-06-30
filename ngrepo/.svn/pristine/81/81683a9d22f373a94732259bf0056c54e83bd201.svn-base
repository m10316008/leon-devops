var express = require('express');
var router = express.Router();

var Redis = require('ioredis');
var redis = new Redis(6379, '127.0.0.1');

var httpGet = require('../utils/http-get');

/* smallsix proxy */
router.get('/findSmallSixInfo.do', function (req, res, next) {

    console.log(req.connection.remoteAddress);
    var redisKey = 'lotogateway:smallsix';

    redis.get(redisKey).then((result) => {
        if (result) {
            console.log('found data from redis');
            res.send(result);
        } else {
            console.log('Cannot found data from redis');
            console.log(req.query);

            var targetUrl = 'https://1680660.com/smallSix/findSmallSixInfo.do?lotCode=' + req.query.lotCode;

            var headers = {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9",
                "cache-control:": "no-cache",
                "pragma": "no-cache",
                "upgrade-insecure-requests": 1,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
            }


            var postOptions = {
                //host: host188,
                isHttps: true,
                host: '1680660.com',
                port: 443,
                path: targetUrl,
                method: 'GET',
                //headers: headers
            }


            httpGet(postOptions).then(response => {
                console.log(response.text);
                redis.setex(redisKey, 3600, response.text);
                res.send(response.text);
            });
        }
    });





    //res.send('sssssssssssssss');
});

module.exports = router;