var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });

    if (req.hostname === 'ceshi789.com' || req.hostname === 'www.ceshi789.com' || req.hostname === "3.0.3.176") {
    //if (req.hostname === 'ceshi789.com' || req.hostname === 'www.ceshi789.com') {
        console.log('host : ' + req.hostname + ', redirect');
        res.redirect(302, '/hkbnpccw982/');
    } else {
        res.status(404);
        res.send('404');
    }

});

/* show headers */
router.get('/headers', function (req, res, next) {
    res.render(
        'headers',
        {
            title: 'Express',
            headers: JSON.stringify(req.headers),
            addr: req.connection.remoteAddress.replace('::ffff:', '')
        }
    );
});

router.get('/google/*', function (req, res, next) {
    var tt = (new Date()).getTime() + '';
    tt = tt.substr(0, tt.length - 3);

    var destUrl = '/cnzz/' + tt;
    if (req.query.ip) {
        destUrl += '?ip=' + req.query.ip;
    }

    res.redirect(302, destUrl);
});

var getIp = require('../services/get-ip');
router.get('/test', function (req, res, next) {

    var clientIp = getIp(req);
    if (req.query.ip) {
        clientIp = req.query.ip;
    }


    var ipInfo = require('../services/ip-info');
    res.json(ipInfo.maxmind(clientIp));
});

module.exports = router;
