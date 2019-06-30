var express = require('express');
var router = express.Router();
var asyncMiddleWare = require('./async-middle-ware');

var setting = require("../setting.json");
var odds6url = require("../odds6url.json");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


/*
nginx should add a header for detect with brand
proxy_set_header brand "va1";
proxy_set_header brand "vb2";
*/
router.get("/odds5/oddsHost6", asyncMiddleWare(async (req, res, next) => {
    var brand = req.headers.brand;
    var targetUrl = setting.odds6[odds6url.no_brand];

    try {
        if (brand && odds6url.with_brand) {
            console.log("brand:" + brand);
            targetUrl = setting.brand[brand].odds6;
        } else {
            console.log("no brand , use default");
        }
    } catch (err) {
        console.log("brand code error , use default");
    }

    console.log(targetUrl);
    var result = { "oddsHost": { "type": 6, "url": targetUrl, "desktop_url": targetUrl } }

    res.json(result);
}));

module.exports = router;
