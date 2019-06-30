var express = require('express');
var router = express.Router();
var brandDao = require('../../db/brand');
var machineDao = require('../../db/machine');
const configDao = require('../../db/configs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const encryptTools = require('../../utils/encrypt-tools');
const nbconfigs = require('../../utils/nbconfigs');
const fs = require('fs');
var pubPem = fs.readFileSync('./.rsa/mykey.pub');
var priPem = fs.readFileSync('./.rsa/mykey.pem');
var asyncMiddleWare = require('../../routes/async-middle-ware');
const tgalert_chart_id='-291145804';
const sleep = require('await-sleep');
var SSH2Promise = require('ssh2-promise');
var TelegramBot = require('node-telegram-bot-api');
var token = '643159086:AAHLD53T4eQeYJvnF1-waCapo6cYVHZFQIo';
var bot = new TelegramBot(token);
const _ = require('lodash');
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./utils/aws/config.json');

const deployUtils = require('../../utils/deploy');


router.get('/', asyncMiddleWare(async (req, res, next) => {
    res.send('deploy index');
}));

router.post('/restart_openresty/api', asyncMiddleWare(async (req, res, next) => {
    let action_case = req.body.action_case;
    var rs = {};
    switch (action_case) {
        case 'initial_table':
            var brands = await brandDao.findAll({
                where:{
                    disabled:0
                }
            }).map(rows=>{
                return rows.dataValues;
            });
            rs['success']=1;
            rs['brands']=brands;
            break;
        case 'initial_restart':
            var vcode = req.body.vcode;
            console.log('body:',req.body.vcode);
            console.log('vcode:',vcode);
            var machines = await machineDao.findAll({
                where:{
                    vcode:vcode,
                    enable:1,
                    mtype:{
                        [Op.in]:['type7','type8','protect']
                    }
                }
            }).map(rows=>{
                return rows.dataValues.mcode
            });
            rs['success']=1;
            rs['machines']=machines;
            break;
        case 'process_restart':
            var mcode = req.body.mcode;
            var machine = await machineDao.findOne({
                where:{
                    mcode:mcode,
                    enable:1,
                    mtype:{
                        [Op.in]:['type7','type8','protect']
                    }
                }
            });
            machine.dataValues.username = encryptTools.privateDecrypt(machine.dataValues.username,priPem);
            machine.dataValues.password = encryptTools.privateDecrypt(machine.dataValues.password,priPem);
            machine.dataValues.sshKey = encryptTools.privateDecrypt(machine.dataValues.sshKey,priPem);
            if(process.env.DEV.toString()=='false') {
                var resp = machine.dataValues.mcode+' openresty restarted';
                bot.sendMessage(tgalert_chart_id, resp);
            }
            var sshconfig = {
                host: machine.dataValues.primaryIp,
                username: machine.dataValues.username,
                password: machine.dataValues.password,
                port:machine.dataValues.primaryPort,
                readyTimeout:20000,
                reconnect:false
            };
            var ssh = new SSH2Promise(sshconfig);
            var cmd = 'systemctl stop openresty';
            var result = await ssh.exec(cmd);
            await sleep(100);
            console.log('cmd:','systemctl stop openresty');
            var cmd = 'rm -rf /apps/temp/cache';
            var result = await ssh.exec(cmd);
            await sleep(100);
            var cmd = 'redis-cli flushall';
            var result = await ssh.exec(cmd);
            await sleep(100);
            var cmd = 'rm -rf /apps/temp/tmpcache';
            var result = await ssh.exec(cmd);
            await sleep(100);
            var cmd = 'rm -rf /usr/local/openresty/nginx/xcache';
            var result = await ssh.exec(cmd);
            await sleep(100);
            var cmd = 'rm -rf /usr/local/openresty/nginx/x0cache';
            var result = await ssh.exec(cmd);
            await sleep(100);
            var cmd = 'systemctl start openresty';
            var result = await ssh.exec(cmd);
            await sleep(100);
            var cmd = 'systemctl status openresty';
            var result = await ssh.exec(cmd);
            rs['success']=1
            rs['result'] = result;
            break;
    }
    res.send(rs);
}));
router.get('/restart_openresty',asyncMiddleWare(async(req,res,next)=>{
    console.log('restart openresty');

    res.render('deploy/restart_openresty');
}));
router.get('/clear_cache', asyncMiddleWare(async (req, res, next) => {
    //res.send('clear_cache index');
    res.render('support/deploy', {

    });
}));

router.post('/api', asyncMiddleWare(async (req, res, next) => {
    res.send('api');
}));

router.get('/odds_core_switch', asyncMiddleWare(async (req, res, next) => {
    let configs = await configDao.findAll().map(rows=>{
        return rows.dataValues;
    });
    console.log({
        configs
    });
    res.render('deploy/odds_core_switch',{
        existingZone:_.find(configs,{
            key:"188core_zone"
        }).value,
        lastUpdate:_.find(configs,{
            key:"188core_zone"
        }).updatedAt,
        oddsGroups:[
            "taipo_4",
            "tsuenwan_1",
            //"tsuenwan_2",
            "tsuenwan_6",
            "kwaichung_7"
        ]
    })
}));
router.post('/odds_core_switch/api', asyncMiddleWare(async (req, res, next) => {
    let body = req.body;
    let id =body.id;
    await deployUtils.switch188Core(id);
    let rs = {};
    res.json(rs);
}));

module.exports = router;