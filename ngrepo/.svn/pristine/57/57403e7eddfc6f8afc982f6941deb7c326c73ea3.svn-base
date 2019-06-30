var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var format = require('../../utils/format');
var asyncMiddleWare = require('../async-middle-ware');
var Machine = require('../../db/machine');
var Brand = require('../../db/brand');
var Cmd = require('../../db/cmd');
var MachineVendor = require('../../db/machine-vendor');
const encryptTools = require('../../utils/encrypt-tools');
const nbconfigs = require('../../utils/nbconfigs');
const fs = require('fs');
var pubPem = fs.readFileSync('./.rsa/mykey.pub');
var priPem = fs.readFileSync('./.rsa/mykey.pem');
const deploy = require('../../utils/deploy');
var request = require('request');
const _ = require('lodash');

router.get('/', asyncMiddleWare(async (req, res, next) => {
    //console.log(req.query);
    var whereObj = {
        where: {}
    };
    //if
    console.log('req.query.show_disable:' + req.query.show_disable);
    if (!(req.query.show_disable)) {
        whereObj.where.enable = {
            [Op.eq]: 1
        };
    }
    if (req.query.value) {
        whereObj.where[Op.or] = [{
            vcode: {
                [Op.like]: '%' + req.query.value + '%'
            }
        }, {
            primaryIp: {
                [Op.like]: '%' + req.query.value + '%'
            }
        }, {
            mtype: {
                [Op.like]: '%' + req.query.value + '%'
            }
        }, {
            mclass: {
                [Op.like]: '%' + req.query.value + '%'
            }
        }, {
            mcode: {
                [Op.like]: '%' + req.query.value + '%'
            }
        },{
            fullip: {
                [Op.like]: '%' + req.query.value + '%'
            }
        }];
        console.log(whereObj);
    }
    var machineVendorMap = {};
    var machineVendors = await MachineVendor.findAll();
    machineVendors.map(m => {
        machineVendorMap['id'] = m.id;
        machineVendorMap['name'] = m.name;
    });

    var brandsMap = {};
    var brands = await Brand.findAll();
    brands.map(b => {
        brandsMap[b.vcode] = b.brand;
    });
    //console.log(brandsMap);
    //console.log('uid',req.user);

    console.log('xterm:',xterm);

    var defaultPayStart = new Date('2018-01-01');

    var machines = await Machine.findAll(whereObj).map(row => {
        try {
            row.dataValues.brand = brandsMap[row.dataValues.vcode];
        } catch (err) {
            row.dataValues.brand = '';
        }
        //console.log('price:',row.dataValues.price);
        //console.log('firstPayment:',row.dataValues.firstPayment);
        //console.log('firstPayment2:',new Date(row.dataValues.firstPayment));
        if(defaultPayStart>new Date(row.dataValues.firstPayment) || row.dataValues.price==null){
            //console.log('Require rental info!!');
            row.dataValues.rentalinfoalert=1;
        }else{
            row.dataValues.rentalinfoalert=0;
        }

        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username,priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password,priPem);
        row.dataValues.sshKey = encryptTools.privateDecrypt(row.dataValues.sshKey,priPem);
        row.dataValues.createdAt = format.dateTimeFormat(row.dataValues.createdAt);
        row.dataValues.updatedAt = format.dateTimeFormat(row.dataValues.updatedAt);
        return row.dataValues
    });
    var xterm = false;
    var userrights = req.user.rights;
    if(userrights!=null && userrights!=''){
        console.log('userrights:',userrights);
        var rights = JSON.parse(userrights);
        console.log('userrights.xterm:',rights.xterm);
        if(rights.xterm){
            xterm= rights.xterm;
        }
    }
    res.render('support/machine', {
        machinelist: machines,
        brandList: brands,
        machineVendorList: machineVendors,
        mtypeList: nbconfigs.mtypeList,
        machineLocation:  nbconfigs.machineLocation,
        classList:  nbconfigs.classList,
        xterm:xterm
    });
}));

router.put('/machine', asyncMiddleWare(async (req, res, next) => {
    var data = req.body;
    delete data.password1;

    try {
        data.remarktag = JSON.parse(data.remarktag);
    } catch (e) {
        console.log("not JSON:",e);
        data.remarktag = JSON.parse('""');
    }
    var row = Machine.create(data).then(row => {
        rs = {
            'success': 1
        };
        res.json(rs);
    }).catch((err) => {
        rs = {
            'success': 0,
            'debug': err
        };
        res.json(rs);
    });
    await deploy.getFullIp(data.mcode,data.primaryIp,data.username,data.password,data.primaryPort);
}));

router.patch('/machine', asyncMiddleWare(async (req, res, next) => {
    var data = req.body;
    delete data.password1;
    if (data.password == '*****') {
        delete data.password;
    }
    try {
        data.remarktag = JSON.parse(data.remarktag);
    } catch (e) {
        console.log("not JSON:",e);
        data.remarktag = JSON.parse('""');
    }

    //delete data.remarktag;
    //console.log('remarktag:',data.remarktag);
    //console.log('data:',data);
    Machine.update(data, {where: {mcode: req.body.mcode}}).then(affectedRows => {
        rs = {
            'success': 1
        };
        res.json(rs);
    }).catch(err => {
        rs = {
            'success': 0,
            'debug': err
        };
        res.json(rs);
    });
}));

async function check64ipconnection(ip){
    return new Promise(function (fulfill, reject) {
        var url = 'http://'+ip+':8091';
        console.log('url:',url);
        try {
            request({
                method: 'GET',
                uri: url,
                gzip: true,
                timeout:100
            }, function (error, response, body) {
                if (error) {
                    console.log('error:',error);
                    fulfill(false);
                } else {
                    var regex = /(Express)/gi;
                    //console.log('body:', body);
                    var matches = regex.exec(body);
                    if (matches[1]) {
                        fulfill(true);
                    }
                }
            });
        } catch (e) {
            reject('error:', e);
        }
    });
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
router.post('/api', asyncMiddleWare(async (req, res, next) => {
    var post_data = req.body;
    var action = post_data.action;
    switch(action){
        case 'get_ips':
            var mcode = req.body.mcode;
            var machine_data = await Machine.findOne({
                where:{
                    mcode:mcode
                }
            });
            var ip64v2=0;
            var ip64v2_data=[];
            var fullip = machine_data.dataValues.fullip;
            var dead_ip = [];

            if(fullip==null || fullip===''){
                var newnetmaskCal='';
            }else{
                var netmaskCal=deploy.netmaskCal(fullip);
                fullip = fullip.split(',');
                newnetmaskCal = netmaskCal.join(',');
                if(fullip.length>=1){
                    var mainip = fullip[0];
                    if((machine_data.mtype==='ip64v2' || machine_data.mtype==='188core') && fullip.length>=10){
                        var randomip='';
                        var randArray = new Array();
                        var clone_fullip = fullip;
                        var shuffleips = shuffle(clone_fullip);
                        for(var i=0;i<=shuffleips.length;i++ ){
                            //var item = fullip[Math.floor(Math.random() * fullip.length)];
                            var item = shuffleips[i];
                            var a = randArray.indexOf(item);
                            if (a == -1 && item!=mainip) {
                                var checkResult = await check64ipconnection(item);
                                console.log('checkResult:',checkResult);
                                if(checkResult==true){
                                    console.log('ip Pass');
                                    randArray.push(item);
                                }else{
                                    dead_ip.push(item);
                                }
                            }
                        }
                        /*while (randArray.length < 18) {
                            var item = fullip[Math.floor(Math.random() * fullip.length)];
                            var a = randArray.indexOf(item);
                            if (a == -1 && item!=mainip) {
                                randArray.push(item);
                            }
                        }*/
                        ip64v2=1;
                        ip64v2_data=randArray;
                    }
                }
            }
            var rs = {
                primaryIp:machine_data.dataValues.primaryIp,
                netmaskCal:newnetmaskCal,
                fullip:fullip,
                ip64v2:ip64v2,
                ip64v2_data:ip64v2_data,
                dead_ip:dead_ip
            };
            break;
    }
    res.json(rs);
}));

router.get('/machine', asyncMiddleWare(async (req, res, next) => {
    //console.log(req.query);
    var machine = await Machine.findOne({
        where: {
            mcode: req.query.mcode
        }
    });
    machine.dataValues.username = encryptTools.privateDecrypt(machine.dataValues.username,priPem);
    machine.dataValues.password = encryptTools.privateDecrypt(machine.dataValues.password,priPem);
    machine.dataValues.sshKey = encryptTools.privateDecrypt(machine.dataValues.sshKey,priPem);
    //console.log(machine.dataValues);
    res.json(machine.dataValues);
}));

router.post('/xterm', asyncMiddleWare(async (req, res, next) => {
    var servers = req.body;
    var serverList = [];
    for (idx in servers) {
        var temp = {
            name: servers[idx]
        };
        serverList.push(temp);
    }
    ;
    var cmdList = await Cmd.findAll();
    //res.setHeader('Access-Control-Allow-Origin', '*');
    var xtermport = 8002;
    if(process.env.DEV.toString()=='false'){
        xtermport = 8002;
    }else{
        xtermport = 8001;
    }
    res.render('support/xterm', {
        xtermport:xtermport,
        serverList: serverList,
        serverListJson: JSON.stringify(serverList),
        cmdList: cmdList
    });
}));
router.post('/get_cmd', asyncMiddleWare(async (req, res, next) => {
    var cmd_id = req.body.cmd_id;
    var cmd = await Cmd.findOne({
        where: {
            id: cmd_id
        }
    });
    res.json({
        success: 1,
        cmd: cmd.cmd
    });
}));

module.exports = router;