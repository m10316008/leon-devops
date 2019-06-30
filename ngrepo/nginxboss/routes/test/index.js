var express = require('express');
var router = express.Router();
var format = require('../../utils/format');
var healthcheck = require('../../tools/health-check');
var snmpcheck = require('../../tools/snmp-check');
var asyncMiddleWare = require('../../routes/async-middle-ware');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../../db/machine');
const encryptTools = require('../../utils/encrypt-tools');
const deploy = require('../../utils/deploy');
const nbconfigs = require('../../utils/nbconfigs');
const fs = require('fs');
const path = require('path');
var rsaPath = path.join(__dirname, '..', '..', '.rsa');
var pubPem = fs.readFileSync(path.join(rsaPath, 'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath, 'mykey.pem'));
var cfTools = require('../../utils/cloudflare-tools');
const takeAction = require('../../tools/take-action');
const http = require('http');
const request = require('request');
let moment = require("moment-timezone");
const mysqlssh = require('mysql-ssh');
const rentalDao = require('../../db/machine-rental');
const Redis = require("ioredis");
const redis = new Redis();



async function getavengerips(){
    return new Promise(resolve=>{
        let json={};
        let stream = redis.scanStream({
            match: "openresty:ratelimit:all:block:*",
        });
        stream.on("data", async function(resultKeys) {
            let ips = [];
            for (let idx in resultKeys) {
                let key = resultKeys[idx];
                let spliter = key.split(':');
                let ip = spliter[4];
                ips.push(ip);
            }
            json.ips = ips;
            resolve(json);
        });
    });
}
router.get('/avengerboss', asyncMiddleWare(async (req, res, next) => {
    let json = await getavengerips();
    res.json(json);
}));
router.get('/prodcurrent', asyncMiddleWare(async (req, res, next) => {
    var json = require('../../public/prod_current');
    res.send(json.vg7);
}));
router.get('/searchtag', asyncMiddleWare(async (req, res, next) => {
    var search = await rentalDao.findAll({
        //attributes: [[ Sequelize.fn('JSON_VALUE', Sequelize.col('remarktag'), '$[0].value'), '付款人']]
        where:{
            [Op.and]:[
                Sequelize.where(Sequelize.fn('JSON_VALUE', Sequelize.col('remarktag'), '$[0].value'), '蘋果'),
                {
                    vcode:{
                        [Op.eq]:'va1'
                    }
                }
            ]
        }
    }).map(row => {
        return row.dataValues;
    });
    console.log(search);

    res.send('done');
}));
router.get('/uat4sql', asyncMiddleWare(async (req, res, next) => {
    var machines = await Machine.findAll({
        where: {
            mtype: 'uat4'
        }
    }).map(row => {
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username, priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password, priPem);
        return row.dataValues;
    });
    //console.log('machines:', machines);
    var publicPath = path.join(__dirname, '..', '..', 'public');
    var cmd_line = fs.readFileSync(path.join(publicPath, 'mt_system_setting.sql')).toString().split("\n");
    for (cmdidx in cmd_line) {
        for (idx in machines) {
            var machine = machines[idx];
            var sql_result = await new Promise(function (resolve, reject) {
                console.log('sql mcode:', machine.mcode);
                mysqlssh.connect(
                    {
                        host: machine.primaryIp,
                        port: machine.primaryPort,
                        user: machine.username,
                        password: machine.password
                    },
                    {
                        host: machine.uat4_db_host,
                        user: machine.uat4_db_user,
                        password: machine.uat4_db_password,
                        database: 'crm'
                    }
                ).then(client => {
                    /*cmd_line[cmdidx]*/
                    /*select * from mt_system_setting where param_name ='AG_REPORT_FTP_DAYS' or param_name ='AG_REPORT_HTTP_HOURS'*/
                    client.query("select * from mt_system_setting where param_name ='AG_REPORT_FTP_DAYS' or param_name ='AG_REPORT_HTTP_HOURS'", function (err, results, fields) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(results);
                            resolve(results);
                            mysqlssh.close();
                        }
                    })
                }).catch(err => {
                    reject(err);
                })
            });
        }
    }

    console.log('sql done');
    res.send('sql done');
}));
router.get('/config', function (req, res, next) {
    console.log(req.app.get('config').nginxBossVersion.version);
    res.send('config');
});
router.get('/lingducsv', asyncMiddleWare(async (req, res, next) => {
    var publicPath = path.join(__dirname, '..', '..', 'public');
    console.log(path.join(publicPath, 'feng.csv'));
    var columns = ['dc_location', 'brand', 'vcode', 'pay_by', 'mcode', 'remark', 'ip', 'pay_day', 'price1', 'useless1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var csvtoarray = await new Promise(function (resolve, reject) {
        require("csv-to-array")({
            file: path.join(publicPath, 'lingdu.csv'),
            columns: columns
        }, function (err, array) {
            resolve(array);
        });
    });
    var csv_array = csvtoarray;
    for (idx in csv_array) {
        //console.log(csv_array[idx]);
        if (csv_array[idx].ip != '') {
            //console.log('ip:',csv_array[idx].ip);
            var ips = csv_array[idx].ip.split('-');
            console.log('ips:', ips);
            console.log(ips[0].trim() + 'ip0');
            var machine = await Machine.findOne({
                where: {
                    fullip: {
                        [Op.like]: '%' + ips[0].trim() + '%'
                    },
                    //price:null,
                    firstPayment: {
                        [Op.lt]: '2018-01-01'
                    }
                }
            });
            if (machine) {
                console.log('ips:', ips);
                console.log('ip:', csv_array[idx].ip);
                console.log('machine info:', machine.mcode);
                console.log('price1:', Number(csv_array[idx].price1));
                console.log('price2:', csv_array[idx].price2);
                var count = 0;
                var firstday;
                for (var i = 1; i <= 12; i++) {
                    if (count == 0) {
                        var idxkey = i.toString();
                        if (csv_array[idx][idxkey] != '') {
                            var new_date = moment(csv_array[idx][idxkey]);
                            //var formate_date = moment(csv_array[idx][idxkey]).format('YYYY-MM-DD');
                            firstday = moment(csv_array[idx][idxkey]).format('YYYY-MM') + '-' + csv_array[idx]['pay_day'];
                            count++;
                        }
                    }
                }
                var db_data = {
                    price: Number(csv_array[idx].price1),
                    firstPayment: firstday
                };
                console.log(db_data);
                await Machine.update(db_data, {
                    where: {
                        mcode: machine.mcode
                    }
                });
            } else {
                console.log('not find:');
            }
        }
    }
    res.send('csv');
}));
//var asyncMiddleware = require('../async-middle-ware');
router.get('/fengcsv', asyncMiddleWare(async (req, res, next) => {
    var publicPath = path.join(__dirname, '..', '..', 'public');
    console.log(path.join(publicPath, 'feng.csv'));
    var columns = ['dc_location', 'brand', 'vcode', 'pay_by', 'mcode', 'remark', '64ip', 'ip', 'pay_day', 'price1', 'price2', 'stop_rental', 'useless1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var csvtoarray = await new Promise(function (resolve, reject) {
        require("csv-to-array")({
            file: path.join(publicPath, 'feng.csv'),
            columns: columns
        }, function (err, array) {
            resolve(array);
        });
    });
    var csv_array = csvtoarray;
    for (idx in csv_array) {
        //console.log(csv_array[idx]);
        if (csv_array[idx].ip != '') {
            //console.log('ip:',csv_array[idx].ip);
            var ips = csv_array[idx].ip.split('-');
            //console.log('ips:',ips);
            var machine = await Machine.findOne({
                where: {
                    fullip: {
                        [Op.like]: '%' + ips[0] + '%'
                    },
                    //price:null,
                    firstPayment: {
                        [Op.lt]: '2018-01-01'
                    }
                }
            });
            if (machine) {
                console.log('ips:', ips);
                console.log('ip:', csv_array[idx].ip);
                console.log('machine info:', machine.mcode);
                console.log('price1:', Number(csv_array[idx].price1));
                console.log('price2:', csv_array[idx].price2);
                var count = 0;
                var firstday;
                for (var i = 1; i <= 12; i++) {
                    if (count == 0) {
                        var idxkey = i.toString();
                        if (csv_array[idx][idxkey] != '') {
                            var new_date = moment(csv_array[idx][idxkey]);
                            var formate_date = moment(csv_array[idx][idxkey]).format('YYYY-MM-DD');
                            firstday = moment(csv_array[idx][idxkey]).format('YYYY-MM') + '-' + csv_array[idx]['pay_day'];
                            count++;
                        }
                    }
                }
                var db_data = {
                    price: Number(csv_array[idx].price1),
                    firstPayment: firstday
                };
                console.log(db_data);
                await Machine.update(db_data, {
                    where: {
                        mcode: machine.mcode
                    }
                });
            } else {
                console.log('not find:');
            }
        }
    }
    res.send('csv');
}));

router.get('/cfcheck', asyncMiddleWare(async (req, res, next) => {
    var zone_id = '1e1f19af4b017154caf1884639c4b9c2';
    var cfcheck = await cfTools.getDnsRecord(zone_id);
    res.send('cfcheck');
}));

router.get('/sql', asyncMiddleWare(async (req, res, next) => {
    var wobj = {
        where: {
            enable: 1,
            mtype: {
                [Op.notIn]: ['64ip']
            }
        }
    };
    var machines = await Machine.findAll(wobj).map(row => {
        return row.dataValues;
    });
    console.log(machines);
    for (var machine of machines) {
        console.log(machine.mcode);
    }
    res.send('sql');
}));

router.get('/get64ip', asyncMiddleWare(async (req, res, next) => {
    var returnbody = '';
    var ips = [
        '118.99.43.1',
        '119.47.84.1'
    ];
    for (idx in ips) {
        var mainip = ips[idx];
        var fullip = await new Promise(function (resolve, reject) {
            const url = "http://" + mainip + ":8091/checkallipaddress?password=1416";
            try {
                request.get(url, (error, response, body) => {
                    let json = JSON.parse(body);
                    if (error) {
                        reject('error', error);
                    } else {
                        resolve(json);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
        //console.log(fullip);
        var haha = new Array();
        while (haha.length < 18) {
            var item = fullip[Math.floor(Math.random() * fullip.length)];
            var a = haha.indexOf(item);
            if (a == -1) {
                haha.push(item);
            }

        }
        //console.log(haha);
        var count=1;
        for (idx in haha) {
            console.log(haha[idx]);
            returnbody += haha[idx] + '<br/>';
            if(count % 6 == 0){
                returnbody +='<br/>';
            }
            count++;
        }
    }
    res.send(returnbody);
}));


router.get('/checkout', asyncMiddleWare(async (req, res, next) => {
    var workspacepath = './public/workspace/nginxclient/';
    var scan = fs.existsSync(workspacepath);
    console.log(scan);
    var svnClient = require('svn-spawn');
    var client = new svnClient({
        cwd: workspacepath,
        username: 'cosarea', // optional if authentication not required or is already saved
        password: 'cs7ctt0sogk0', // optional if authentication not required or is already saved
        noAuthCache: true, // optional, if true, username does not become the logged in user on the machine
    });
    var url = 'http://202.59.250.139:9800/svn/ngrepo/nginxclient';
    var checkout = await client.checkout(url);
    console.log(checkout);
    res.send('checkout');
}));

router.get('/rsa', asyncMiddleWare(async (req, res, next) => {
    //var pubPem = fs.readFileSync('./.rsa/mykey.pub');
    //var priPem = fs.readFileSync('./.rsa/mykey.pem');

    var str = encryptTools.publicEncrypt("0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789a0123456789", pubPem);
    console.log('public encrypt str:', str);
    var prideStr = encryptTools.privateDecrypt(str, priPem);
    console.log('private decrypt Str:', prideStr);


    var str = encryptTools.privateEncrypt("abcd1234", priPem);
    console.log('private encrypt str:', str);
    var decodestr = encryptTools.publicDecrypt(str, pubPem);
    console.log('public decrypt Str:', decodestr);
    console.log('finish RSA : ' + (new Date()).toISOString());

    //var pubPem = fs.readFileSync(path.join());
    res.send('rsa');
}));

router.get('/', asyncMiddleWare(async (req, res, next) => {
    //for testing healthcheck
    var check = await healthcheck.healthcheck();
    res.send('test');
}));
router.get('/takeaction', asyncMiddleWare(async (req, res, next) => {
    //for testing healthcheck
    console.log('start test snmpcheck');
    var check = await takeAction.run();
    res.send('testing snmpcheck');
}));
router.get('/snmp', asyncMiddleWare(async (req, res, next) => {
    //for testing healthcheck
    console.log('start test snmpcheck');
    var check = await snmpcheck.snmpcheck();
    res.send('testing snmpcheck');
}));

router.get('/testswitchcore', asyncMiddleWare(async (req, res, next) => {
    console.log('start testswitchcore');
    let response = await takeAction.autoSwitchCore();
    res.send('testing');
}));

router.get('/fullip', asyncMiddleWare(async (req, res, next) => {
    //for calculate netmask
    console.log('fullip Start');
    var where = {
        where: {
            //mcode:'vb2_fun_city_feng008'
            enable:true,
            fullip: {
                [Op.or]:[
                    null,
                    ''
                ]
            }
        }
    };
    var machines = await Machine.findAll(where).map(row => {
        try {
            row.dataValues.brand = brandsMap[row.dataValues.vcode];
        } catch (err) {
            row.dataValues.brand = '';
        }
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username, priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password, priPem);
        row.dataValues.sshKey = encryptTools.privateDecrypt(row.dataValues.sshKey, priPem);
        return row.dataValues;
    });

    var rs = [];
    for (var machine of machines) {
        //console.log(machine);
        console.log('fullip:',machine.mcode);
        var temp = await deploy.getFullIp(machine.mcode, machine.primaryIp, machine.username, machine.password, machine.primaryPort);
        rs.push(temp);
    }
    res.send(rs);
}));
router.get('/netmask/:brand', asyncMiddleWare(async (req, res, next) => {
    //for aws white list

    console.log(req.query);
    var where = {
        where: {
            //mcode:'vb2_fun_city_feng008'
            enable: true
            //fullip:null
        }
    };
    var machines = await Machine.findAll(where).map(row => {
        try {
            row.dataValues.brand = brandsMap[row.dataValues.vcode];
        } catch (err) {
            row.dataValues.brand = '';
        }
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password);
        row.dataValues.sshKey = encryptTools.privateDecrypt(row.dataValues.sshKey);
        return row.dataValues;
    });
    var rs = [];
    for (machine of machines) {
        //console.log(machine);
        var temp = await deploy.netmaskCal(machine.fullip);
        var obj = {
            mcode: machine.mcode,
            fullip: machine.fullip,
            nmask: temp.join(',')
        };
        rs.push(obj);
    }
    res.send(rs);
}));

router.get('/deploy', asyncMiddleWare(async (req, res, next) => {
    req.setTimeout(88888888);
    //var preDeploy = await deploy.preDeploy();
    console.log('pre deploy End, starting deploy');
    var wObj = {
        attributes: ['mcode'],
        where: {
            //enable:1,
            //vcode:'vi9'
            mcode: 'va1_apple_feng006'
        }
    };
    let machines = await Machine.findAll(wObj);
    for (let machine of machines) {
        let mcode = machine.dataValues.mcode;
        await deploy.deployClient(mcode);
    }
    //var deployclient = await deploy.deployClient(mcode);
    res.send('deploy');
}));
module.exports = router;
