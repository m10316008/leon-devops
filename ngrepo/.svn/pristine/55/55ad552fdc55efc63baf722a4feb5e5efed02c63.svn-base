var express = require('express');
var router = express.Router();

var asyncMiddleWare = require('../async-middle-ware');
var ipTools = require('../../utils/ip-tools');

/* GET home page. */
router.get('/heartbeat', asyncMiddleWare(async (req, res, next) => {
    var realIp = ipTools.parseIpv4(req);
    res.json(realIp);
}));


module.exports = router;
