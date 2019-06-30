var express = require('express');
var router = express.Router();

var Login = require('../../db/login');
var bcryptjs = require('bcryptjs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: '/support/' });
});
var machineRouter = require('./machine');
router.use('/machine', machineRouter);

var cloudflareRouter = require('./cloudflare');
router.use('/cloudflare',cloudflareRouter);

var chinanetcenterRouter = require('./chinanetcenter');
router.use('/chinanetcenter',chinanetcenterRouter);

var deployRouter = require('./deploy');
router.use('/deploy',deployRouter);


var prtgRouter = require('./prtg');
router.use('/prtg',prtgRouter);

var rentalRouter = require('./rental');
router.use('/rental',rentalRouter);

var staticInfoRouter = require('./static-info');
router.use('/static-info',staticInfoRouter);

module.exports = router;
