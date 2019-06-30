const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../db/machine');
var BrandDao = require('../db/brand');
const configDao = require('../db/configs');
var Snmp = require('../db/snmp');
const encryptTools = require('../utils/encrypt-tools');
var SSH2Promise = require('ssh2-promise');
var TelegramBot = require('node-telegram-bot-api');
var token = '643159086:AAHLD53T4eQeYJvnF1-waCapo6cYVHZFQIo';
var token2='625882882:AAFxVFajvS1kzunXYpBwKYk6X-tT37PRO5I';
var sortObj = require('sort-object');
var bot = new TelegramBot(token);
var baBot = new TelegramBot(token2);
const fs = require('fs');
var path = require('path');
var rsaPath = path.join(__dirname, '..', '.rsa');
var pubPem = fs.readFileSync(path.join(rsaPath,'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath,'mykey.pem'));
const tgalert_chart_id='-291145804';
const tgbaalert_chart_id='-308551715';
const _ = require('lodash');
const deployUtils = require('../utils/deploy');

var whereObj = {
    where: {
        enable:1,
        mtype:{
            [Op.in]:['type7','type8','type9','protect']
        }
    }
};
async function checkhistory(machine){
    var history = await Snmp.findAll({
        where:{
            mcode:machine.mcode
        },
        order:[
            ['timestamp', 'DESC']
        ],
        limit: 3
    }).map(row=>{
        return row.dataValues
    });

    var no_response = 0;
    var openresty = 0;
    var node188 = 0;
    //var crm_speed = [];
    for(idx in history){
        var hisdata = history[idx];
        var values = JSON.parse(hisdata.value);
        if(values[0]!='dead'){
            if(values[1]!='active'){
                openresty=openresty+1;
            }
            if(values[2]!='active'){
                node188=node188+1;
            }
        }else{
            no_response=no_response+1;
        }
        //var crm_speed_result = values[11];
        /*for(idx2 in crm_speed_result){
            //console.log('ip:',crm_speed_result[idx2].ip);
            //console.log('speed:',crm_speed_result[idx2].speed);
            if(crm_speed_result[idx2].ip!=undefined){
                if(crm_speed[crm_speed_result[idx2].ip]==undefined ){
                    //console.log(undefined);
                    crm_speed[crm_speed_result[idx2].ip] = 0;
                }
                if((crm_speed_result[idx2].speed*1)<10000){
                    crm_speed[crm_speed_result[idx2].ip]+=1;
                }
            }
        }*/
    }
    //console.log('no_response:',no_response);
    //console.log('openresty:',openresty);
    //console.log('node188:',node188);
    /*if(node188>=2){
        if(process.env.DEV.toString()=='false'){
            var resp = 'Node188 inactive\n'+machine.mcode+ '\nip:'+machine.primaryIp;
            bot.sendMessage(tgalert_chart_id, resp);
            var sshconfig = {
                host: machine.primaryIp,
                username: machine.username,
                password: machine.password,
                port:machine.primaryPort,
                readyTimeout:20000,
                reconnect:false
            };
            var ssh = new SSH2Promise(sshconfig);
            var cmd = 'wget --quiet --user=l3LMZKnTiCU4Oh2Qp6FmXlk0a055q2dBVOeJppsvRbptggataFEVOOJMEEHTuKkenoNAD5Vj4aCaeAsf6W0IAAl32SKlrUpE722y --password=fW4Qu7eJgcqT6vnY0PrGnSiWGEka7y4diWRCUT9YTpHQIUCxAS3NAbx4GI4D4XEcJjCr2BfMOKsmvSJTACuYCSS6oNzgy2i7bIp4 -q http://54.169.155.120:1010/reinstall_node188 -O /apps/shell/reinstall_node188';
            var result = await ssh.exec(cmd);
            var cmd = 'chmod +x /apps/shell/reinstall_node188';
            var result = await ssh.exec(cmd);
            var cmd = 'nohup /apps/shell/reinstall_node188 `</dev/null` >nohup.out 2>&1 &';
            var result = await ssh.exec(cmd);
            await ssh.close();
        }
    }*/
    if(openresty>=3){
        if(process.env.DEV.toString()=='false') {
            var resp = 'Openresty inactive\n' + machine.mcode + '\nip:' + machine.primaryIp;
            if (machine.mclass == 'openresty') {
                bot.sendMessage(tgalert_chart_id, resp);
            }
        }
    }
    if(no_response>=3){
        var resp = 'Server no response\n'+machine.mcode+ '\nip:'+machine.primaryIp;
        if(process.env.DEV.toString()=='false'){
            bot.sendMessage(tgalert_chart_id, resp);
        }
    }

    /*for(idx in crm_speed){
        if(crm_speed[idx]>=3){
            var ip = idx;
            //console.log('ip:',ip);
            var resp = 'Crm connection too slow \n'+machine.mcode+ '\nip:'+machine.primaryIp+'\nCRM IP:'+ip;
            if(process.env.DEV.toString()=='false'){
                bot.sendMessage(tgalert_chart_id, resp);
            }
        }
    }*/

    /*if(machine.mcode=='va1_apple_feng073'){
        no_response=1;
    }*/
    var rs={
        no_response:no_response,
        openresty:openresty,
        node188:node188
    }
    return rs;
}
const run = async function(){
    var brand_alerts = new Array();
    var brands = await BrandDao.findAll({
        where:{
            vcode:{
                [Op.not]:'all'
            }
        }
    }).map(row=>{
        return row.dataValues;
    });
    
    var brand_result = {};
    var brand_name=new Array();
    for(var idx in brands){
        //console.log('brands[idx]:',brands[idx].vcode);
        brand_result[brands[idx].vcode]={
            total:0,
            no_response:0
        };
        brand_name[brands[idx].vcode]=brands[idx].brand;
    }

    //console.log('brands:',brands);
    //console.log('DEV:',process.env.DEV);
    
    var machines = await Machine.findAll(whereObj).map(row => {
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username,priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password,priPem);
        return row.dataValues;
    });
    for(idx in machines){
        var machine = machines[idx];
        try{
            var checkresult = await checkhistory(machine);

            brand_result[machine.vcode].total++;
            if(checkresult.no_response>=3){
                brand_result[machine.vcode].no_response++;
            }
            if(checkresult.node188>=2){
                brand_result[machine.vcode].node188++;
            }
            if(checkresult.openresty>=3){
                brand_result[machine.vcode].openresty++;
            }
            //console.log(checkresult);
        }catch (e) {
            console.log('checkhistory:',e);
        }
    }

    //console.log('brand_result:',brand_result);
    for(var idx in brand_result){
        if(brand_result[idx].no_response>0){
            var resp = 'No response error for '+idx+ '['+brand_name[idx]+'] \n'+brand_result[idx].no_response+'/'+brand_result[idx].total;
            baBot.sendMessage(tgbaalert_chart_id, resp);
        }
        if(brand_result[idx].node188>0){
            var resp = 'Node188 error for '+idx+ '['+brand_name[idx]+'] \n'+brand_result[idx].node188+'/'+brand_result[idx].total;
            baBot.sendMessage(tgbaalert_chart_id, resp);
        }
        if(brand_result[idx].openresty>0){
            var resp = 'Openresty error for '+idx+ '['+brand_name[idx]+'] \n'+brand_result[idx].openresty+'/'+brand_result[idx].total;
            baBot.sendMessage(tgbaalert_chart_id, resp);
        }
    }
    rs = 1;
    return rs;
}


const autoSwitchCore = async function(){
    console.log('Start Switch core group');
    let core_zoneObj = await configDao.findAll().map(rows=>{
        return rows.dataValues;
    })
    let existingCoreZone = _.find(core_zoneObj,{
        key:"188core_zone"
    }).value
    let oddsGroups = JSON.parse(_.find(core_zoneObj,{
        key:"oddsGroups"
    }).value);
    oddsGroups = _.without(oddsGroups,existingCoreZone)

    let randomGroup = _.sample(oddsGroups)

    await deployUtils.switch188Core(randomGroup);

    console.log(`Schedule switch group complete:${randomGroup}`);

    /*console.log({
        //core_zoneObj,
        existingCoreZone,
        oddsGroups,
        randomGroup
    })*/
}

module.exports={
    run,
    autoSwitchCore
}