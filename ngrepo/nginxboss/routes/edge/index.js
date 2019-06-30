var express = require('express');
var router = express.Router();
var redis = require("redis"),
    client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

router.post('/report', function (req, res, next) {
    var postObj = req.body;
    if(postObj.mcode && postObj.cmcode){
        client.set(postObj.mcode, postObj.mcode, 'EX', 10);
        res.send('k');
    }else{
        res.send('404');
    }
});
module.exports = router;