var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: '/admin/' });
});

var staffRouter = require('./staff');
router.use('/staff', staffRouter);
module.exports = router;
