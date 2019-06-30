const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../db/machine');
const encryptTools = require('../utils/encrypt-tools');
var SSH2Promise = require('ssh2-promise');
var TelegramBot = require('node-telegram-bot-api');
var token = '643159086:AAHLD53T4eQeYJvnF1-waCapo6cYVHZFQIo';
var sortObj = require('sort-object');
var bot = new TelegramBot(token);
const fs = require('fs');
var path = require('path');
var rsaPath = path.join(__dirname, '..', '.rsa');

var pubPem = fs.readFileSync(path.join(rsaPath,'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath,'mykey.pem'));

var snmp = require("net-snmp");
var Int64 = require('node-int64');
var bigInt = require('big-integer');
const {promisify} = require('util');
var redis = require("redis"), client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
var expire_time = 2*60*60;

//const tgalert_chat_id='503951965';
const tgalert_chart_id='-291145804';
var whereObj = {
    where: {
        enable:1,
        mtype:{
            [Op.notIn]:['ip64v2']
        }
    }
};
async function run_check(item,machine){
    console.log('checking:',machine.mcode);
    var rs;
    var sshconfig = {
        host: machine.primaryIp,
        username: machine.username,
        password: machine.password,
        port:machine.primaryPort,
        readyTimeout:8000,
        reconnect:false
    };
    var ssh = new SSH2Promise(sshconfig);
    switch(item){
        case 'node188':
            var cmd = 'systemctl status node188';
            var regex = /Active\:\s+active\s+\(running\)/;
            break;
    }
    try{
        var result = await ssh.exec(cmd);
        var match = await regex.test(result);
        if(match){
            rs = {
                success:1,
                msg:'checked normal'
            };
        }else{
            rs = {
                success:0,
                msg:'checked fail, node188 inactive'
            };
            var cmd = 'wget -q http://app-store-update.com/cos/reinstall_node188 -O /apps/shell/reinstall_node188';
            var result = await ssh.exec(cmd);
            var cmd = 'bash /apps/shell/reinstall_node188';
            var result = await ssh.exec(cmd);
        }
        await ssh.close();
    }catch(e){
        rs = {
            success:2,
            msg:'ssh connection fail',
            debug:e
        };
    }
    return rs;
}
exports.healthcheck = async function(){
    var check_arr = [];
    var rs=[];
    var machines = await Machine.findAll(whereObj).map(row => {
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username,priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password,priPem);
        return row.dataValues;
    });
    for(idx in machines){
        var check = await run_check('node188',machines[idx]);
        switch(check.success){
            case 0:
                console.log(JSON.stringify(check.msg));
                var resp = 'node188 fail\n'+machines[idx].mcode+ '\nip:'+machines[idx].primaryIp;
                bot.sendMessage(tgalert_chart_id, resp);
                break;
            case 1:
                console.log(JSON.stringify(check.msg));
                break;
            case 2:
                console.log(JSON.stringify(check.msg));
                var resp = 'Server no response\n'+machines[idx].mcode+ '\nip:'+machines[idx].primaryIp;
                bot.sendMessage(tgalert_chart_id, resp);
                break;
        }
        check_arr.push(JSON.stringify(check));
        console.log('check:',check);
    }
    rs['check']=check_arr;
    rs['success'] = 1;
    return rs;
};

const oids = [
    '1.3.6.1.2.1.1.3.0',    //uptime
    '1.3.6.1.4.1.2021.5000.4.1.2.15.99.104.101.99.107.95.111.112.101.110.114.101.115.116.121.1',    //openresty
    '1.3.6.1.4.1.2021.5010.4.1.2.13.99.104.101.99.107.95.110.111.100.101.49.56.56.1',   //node188
    '1.3.6.1.2.1.31.1.1.1.6', //intraffic
    '1.3.6.1.2.1.31.1.1.1.10', //outtraffic
    '1.3.6.1.4.1.2021.10.1.3.1', //cpu load
    '1.3.6.1.4.1.2021.4.3.0', //ram total
    '1.3.6.1.4.1.2021.4.11.0' //ram free
];
const snmpOptions = {
    port: 161,
    retries: 1,
    timeout: 200,
    transport: "udp4",
    //trapPort: 162,
    version: snmp.Version2c,
    idBitsSize: 32
};
function speed_cal(traffic_diff,time_diff){
    var temp = ((traffic_diff*8)/time_diff)/1024/1024;
    var rs = Number((temp).toFixed(3));
    return rs;
}
var snmpget = function(last_data,snmpsession,timestamp,machine){
    return new Promise(function(resolve, reject) {
        snmpsession.get(['1.3.6.1.4.1.2021.4000.4.1.2.15.99.104.101.99.107.95.99.97.114.100.105.110.100.101.120.1'], async function (error, varbinds) {
            if(error){
                redisdata=[
                    timestamp,
                    'dead'
                ];
                client.hmset( machine.mcode,timestamp,JSON.stringify(redisdata));
                client.expireat(machine.mcode, parseInt((+new Date)/1000) + expire_time);
                var resp = 'Server no response\n'+machine.mcode+ '\nip:'+machine.primaryIp;
                if(process.env.DEV.toString()=='false'){
                    bot.sendMessage(tgalert_chart_id, resp);
                }
                //bot.sendMessage(tgalert_chart_id, resp);
                snmpsession.close ();
                //reject(error);
                reject('snmp fail');
            }else{
                var value = varbinds[0].value;
                var v2 = bigInt('0x' + value.toString());
                var cardindex = ''+v2.toString();
                var temp_oids = new Array(oids.length);
                for (var i = 0; i < oids.length; i++) {
                    switch(oids[i]){
                        case '1.3.6.1.2.1.31.1.1.1.6':
                            temp_oids[i] = oids[i]+'.'+cardindex;
                            break;
                        case '1.3.6.1.2.1.31.1.1.1.10':
                            temp_oids[i] = oids[i]+'.'+cardindex;
                            break;
                        default:
                            temp_oids[i] = oids[i];
                            break;
                    }
                }
                snmpsession.get(temp_oids, async function (error, varbinds) {
                    if (error) {
                        console.error(error);
                    }
                    for (var i = 0; i < varbinds.length; i++) {
                        //console.log(varbinds[i].oid, '' + varbinds[i].value, varbinds[i].type);
                        switch (varbinds[i].oid) {
                            case temp_oids[0]:
                                var uptime = '' + varbinds[i].value;
                                break;
                            case temp_oids[1]:
                                var openresty = '' + varbinds[i].value;
                                break;
                            case temp_oids[2]:
                                var node188 = '' + varbinds[i].value;
                                break;
                            case temp_oids[3]:
                                var value = varbinds[i].value;
                                var v2 = bigInt('0x' + value.toString('hex'));
                                var intraffic = '' + v2.toString(10);
                                break;
                            case temp_oids[4]:
                                var value = varbinds[i].value;
                                var v2 = bigInt('0x' + value.toString('hex'));
                                var outtraffic = '' + v2.toString(10);
                                break;
                            case temp_oids[5]:
                                var cpuload = '' + varbinds[i].value;
                                break;
                            case temp_oids[6]:
                                var ramtotal = '' + varbinds[i].value;
                                break;
                            case temp_oids[7]:
                                var ramfree = '' + varbinds[i].value;
                                break;
                        }
                    }
                    console.log('last_data success:',last_data['success']);
                    if(last_data['success']==1){
                        if(last_data['is_dead']==1){
                            var inspeed = 0;
                            var outspeed = 0;
                            var total_traffic = 0;
                        }else{
                            timediff = timestamp-last_data['time'];
                            //console.log('last_data:',last_data);
                            timediff = timestamp-last_data['time'];
                            //console.log('timediff:',timediff);
                            var indiff = intraffic-last_data['intraffic'];
                            var outdiff = outtraffic-last_data['outtraffic'];
                            var inspeed = speed_cal(indiff,timediff);
                            var outspeed = speed_cal(outdiff,timediff);
                            var total_traffic = Number((inspeed+outspeed).toFixed(3));
                            //console.log('inspeed:',inspeed+'Mbits');
                            //console.log('outspeed:',outspeed+'Mbits');
                            //console.log('total_traffic:',total_traffic+'Mbits');
                        }

                    }else{
                        var inspeed = 0;
                        var outspeed = 0;
                        var total_traffic = 0;
                    }

                    if(openresty!='active'){
                        var resp = 'Openresty inactive\n'+machine.mcode+ '\nip:'+machine.primaryIp;
                        if(machine.mclass=='openresty'){
                            bot.sendMessage(tgalert_chart_id, resp);
                        }
                    }

                    if(node188!='active'){
                        console.log('fix node188');
                        var resp = process.env.DEV.toString()+'Node188 inactive\n'+machine.mcode+ '\nip:'+machine.primaryIp;
                        //take action node188
                        if(process.env.DEV.toString()=='false'){
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
                            var cmd = 'wget -q http://app-store-update.com/cos/reinstall_node188 -O /apps/shell/reinstall_node188';
                            var result = await ssh.exec(cmd);
                            var cmd = 'chmod +x /apps/shell/reinstall_node188';
                            var result = await ssh.exec(cmd);
                            var cmd = 'nohup /apps/shell/reinstall_node188 `</dev/null` >nohup.out 2>&1 &';
                            var result = await ssh.exec(cmd);
                            await ssh.close(); 
                        }
                    }
                    redisdata=[
                        timestamp,
                        uptime,
                        openresty,
                        node188,
                        intraffic,
                        outtraffic,
                        cpuload,
                        ramtotal,
                        ramfree,
                        inspeed,
                        outspeed,
                        total_traffic
                    ];
                    client.hmset( machine.mcode,timestamp,JSON.stringify(redisdata));
                    client.expireat(machine.mcode, parseInt((+new Date)/1000) + expire_time);
                    snmpsession.close ();
                    resolve('finish snmp:',machine.mcode);
                });
                delete temp_oids;
            }
        });
    });
};
async function snmpRun(machine){
    var timestamp = Math.floor(Date.now() / 1000);
    var redisdata;
    console.log('start snmp:',machine.mcode);
    var snmpsession = snmp.createSession(machine.primaryIp, "public", snmpOptions);
    console.log('start load redis');
    var history;
    var hiskey=0;
    var history_time=0;
    var intraffichistory=0;
    var outtraffichistory=0;
    var last_data = new Array();
    last_data = await new Promise(function(resolve, reject){
        client.hgetall(machine.mcode,function(err,reply){
            var temp_rs = new Array();
            temp_rs['success']=0;
            if(err){
                console.log(err);
            }else{
                for(idx in reply){
                    var key_time = parseInt(idx);
                    if(key_time<(timestamp-(2*60*60))){
                        console.log('delete:',idx);
                        client.DEL(machine.mcode,idx);
                        delete reply.idx;
                    }else{
                        var tempkey = idx*1;
                        if(tempkey>hiskey){
                            history=reply[idx];
                        }
                    }
                }
                if(history){
                    var history = JSON.parse(history);
                    var intraffichistory;
                    if(history[1]=='dead'){
                        temp_rs['intraffic'] =0;
                        temp_rs['outtraffic'] =0;
                        temp_rs['is_dead']=1;
                    }else{
                        temp_rs['intraffic']=parseInt(history[4]);
                        temp_rs['outtraffic']=parseInt(history[5]);
                        temp_rs['is_dead']=0;
                    }
                    temp_rs['time']= history[0];
                    temp_rs['success']=1;
                }
            }
            resolve(temp_rs);
        });
    });
    try{
        var get_result = await snmpget(last_data,snmpsession,timestamp,machine);
        console.log('get_result',get_result);
        return get_result;
    }catch(e){
        console.log('snmpgeterror:',e);
        return 'snmpgeterror';
    }
}
exports.snmpcheck = async function(){
    console.log('DEV:',process.env.DEV);
    var machines = await Machine.findAll(whereObj).map(row => {
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username,priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password,priPem);
        return row.dataValues;
    });
    for(idx in machines){
        //console.log(machines[idx].mcode);
        try{
            var snmprs = await snmpRun(machines[idx]);
            console.log(snmprs);
        }catch (e) {
            console.log('snmpRunerror:',e);
        }
    }
    rs = 1;
    return rs;
}