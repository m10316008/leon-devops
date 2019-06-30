var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var asyncMiddleWare = reqlib('/routes/async-middle-ware');
var staticinfoDao = reqlib('/db/static-info');
var moment = require('moment');
const utf8 = require('utf8');
var crypto = require('crypto');
const http = require('http');
const https = require('https');
var parseString = require('xml2js').parseString;
var chinanetcenterDominDao = reqlib('/db/chinanetcenter-domain');
var querystring = require('querystring');
var apiSuffix = '@123';
var request = require('request');
var sleep = require('await-sleep');

router.get('/', asyncMiddleWare(async (req, res, next) => {
    res.render('support/chinanetcenter', {});
}));

var clearreq = function (options, post_data) {
    console.log('post opts:', options);
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}
var myhttpsreq = function (options) {
    return new Promise((resolve, reject) => {
        var post_req = https.request(options, function (resa) {
            console.log('options:', options);
            let ret = '';
            resa.on('data', function (buffer) {
                ret += buffer.toString();
            });
            resa.on('end', function () {
                return resolve(ret);
            });
        });
        post_req.on('error', (e) => reject(e));
        post_req.end();
    });
};

async function mycurl(username, password, scope, domain = '') {
    var now = moment().subtract(8, 'hours').format("ddd, DD MMM YYYY HH:mm:ss").toString() + ' GMT';
    console.log('now:', now);
    var encode = {
        date: now,
        utf8date: utf8.encode(now.toString()),
        password: password,
        utf8password: utf8.encode(password),
        'hash_hmac(sha1),unraw': crypto.createHmac('sha1', utf8.encode(now)).update(password, 'utf8').digest('binary'),
        'hash_hmac(sha1)': crypto.createHmac('sha1', utf8.encode(now)).update(utf8.encode(password)).digest('binary'),
        finalKey: Buffer.from(crypto.createHmac('sha1', password).update(utf8.encode(now), 'utf8').digest()).toString('base64')
    }
    var auth = new Buffer(username + ':' + encode.finalKey).toString('base64');

    switch (scope) {
        case 'update_domain':
            var options = {
                method: 'GET',
                hostname: 'open.chinanetcenter.com',
                path: '/api/domain',
                port: 443,
                headers: {
                    'Authorization': 'Basic ' + auth,
                    'Date': encode.date,
                    'Content-Type': 'application/xml'
                }
            };
            var ret = await myhttpsreq(options, username, encode.finalKey);
            var result = await new Promise((resolve, reject) => parseString(ret, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }));
            if(result['domain-list']!=undefined){
                var summary = result['domain-list']['domain-summary'];
            }else{
                var summary = [];
            }
            var rs = {
                result: summary
            };
            break;
        case 'clear_cache':
            var post_data = {
                'urls': [
                    'http://' + domain + '/',
                    'https://' + domain + '/'
                ],
                'dirs': [
                    'http://' + domain + '/',
                    'https://' + domain + '/'
                ]
            };
            var options = {
                method: 'POST',
                uri: 'https://open.chinanetcenter.com/ccm/purge/ItemIdReceiver',
                json: post_data,
                headers: {
                    'Authorization': 'Basic ' + auth,
                    'Date': encode.date,
                    'Content-Type': 'application/json'
                }
            };
            var ret = await clearreq(options, username, encode.finalKey, post_data);
            var rs = {
                result: ret
            };
            break;
    }
    return rs;
}
router.post('/api', asyncMiddleWare(async (req, res, next) => {
    let action_case = req.body.action_case;
    switch (action_case) {
        case 'update_domain':
            await chinanetcenterDominDao.sync({
                force: true
            });
            var info = await staticinfoDao.findAll({
                where: {
                    type: 'chinanetcenter'
                }
            }).map(row => {
                return row.dataValues;
            });
            var count = 0;
            var domains = new Array();
            for (var account of info) {
                var username = account.id;
                var password = account.id + apiSuffix;
                var result = await mycurl(username, password, 'update_domain');
                var results = result.result;
                for (idx in results) {
                    var domainName = results[idx]['domain-name'];
                    await chinanetcenterDominDao.create({
                        account: username,
                        domain: domainName[0]
                    });
                    domains.push({
                        domain: domainName[0],
                        account: username
                    });
                }
                count++;
            }
            var rs = {
                domains: domains,
                domainCount: domains.length
            }
            break;
        case 'clear_cache':
            var username = req.body['target[account]'];
            var domain = req.body['target[domain]'];
            var password = username + apiSuffix;
            var result = await mycurl(username, password, 'clear_cache', domain);
            var itemId = result.result.itemId;
            await chinanetcenterDominDao.update({
                result:itemId
            },{
                where:{
                    domain:domain,
                    account:username
                }
            });
            var rs = {
                debug: req.body,
                user: username,
                domain: domain,
                password: password,
                itemId: itemId
            }
            await sleep(1000);
            break;
    }
    res.json(rs);
}));

module.exports = router;