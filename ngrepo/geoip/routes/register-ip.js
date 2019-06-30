var express = require('express');
var router = express.Router();

var asyncMiddleWare = require('./async-middle-ware');
var getIp = require('../services/get-ip');
var ipQuery = require('../services/ip-query');
var redis = require('../services/redis');

router.get('/', asyncMiddleWare(async (req, res, next) => {
    res.redirect(302, '/hkbnpccw982/check?tt=' + (new Date()).getTime());
}));

router.get('/check', asyncMiddleWare(async (req, res, next) => {
    var ipAddr = getIp(req);
    if (req.query.ip) {
        ipAddr = req.query.ip;
    }

    res.render('hkbnpccw982/register-ip', { ip: ipAddr });
}));

router.post('/check', asyncMiddleWare(async (req, res, next) => {
    var ipAddr = req.body.ip;
    var password = req.body.hostname;

    if (password === '2018') {
        //console.log('saved');
        await redis.setex('temp:whitelist:' + ipAddr, 7200, 'a');
        res.render('hkbnpccw982/saved', { ip: ipAddr });
    } else {
        res.render('error', { message: '查詢失敗' });
    }
}));

module.exports = router;