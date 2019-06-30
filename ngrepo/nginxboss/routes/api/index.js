var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('ok');
});
var infoRouter = require('./info');
router.use('/info', infoRouter);

module.exports = router;
