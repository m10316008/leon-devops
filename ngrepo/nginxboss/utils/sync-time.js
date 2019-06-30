const axios = require('axios-https-proxy-fix');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
var machineDao = require('../db/machine');
var TelegramBot = require('node-telegram-bot-api');
var token = '643159086:AAHLD53T4eQeYJvnF1-waCapo6cYVHZFQIo';
const tgalert_chart_id='-291145804';
const bot = new TelegramBot(token);
const SSH2Promise = require('ssh2-promise');
const encryptTools = require('./encrypt-tools');
const fs = require('fs');
var path = require('path');
var rsaPath = path.join(__dirname, '..', '.rsa');
var pubPem = fs.readFileSync(path.join(rsaPath,'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath,'mykey.pem'));

async function myget(url){
    return new Promise(resolve=>{
        axios.get(url).then(res=>{
            resolve(res);
        }).catch(e=>{
            resolve(e);
        });
    });
}


async function verify(){
    console.log('verify time processing...');
    let machines = await machineDao.findAll({
        where:{
            mtype:{
                [Op.in]:['type8','protect','188core']
            },
            mcode:{
                [Op.notIn]:['vv_central_company_odds6_feng194']
            },
            enable:true
        }
    }).map(rows=>{
        rows.dataValues.username = encryptTools.privateDecrypt(rows.dataValues.username,priPem);
        rows.dataValues.password = encryptTools.privateDecrypt(rows.dataValues.password,priPem);
        return rows.dataValues;
    });
    let count =0 ;
    for(let machineIdx in machines){
        let machine = machines[machineIdx];
        //console.log(machine.primaryIp);
        let ip = machine.primaryIp;
        let mcode = machine.mcode;
        let mtype = machine.mtype;
        let url = `http://${ip}`;
        let res = await myget(url);
        let valid;
        let serverTime;
        if(res && res.response && res.response.headers && res.response.headers.date){
            valid = true;
            serverTime = res.response.headers.date;
            let serverTimeMoment = moment(serverTime);
            let localTimeMoment = moment();
            let diff = localTimeMoment.diff(serverTimeMoment);
            /*console.log({
                localTimeMoment,
                serverTimeMoment,
                serverTime,
                diff
            });*/

            if(Math.abs(diff)>2000){
                console.log('Time Error:',ip);
                var resp = 'Time diff is over 2 secounds\n'+machine.mcode+ '\nip:'+machine.primaryIp;
                serverTimeMoment.tz('Asia/Hong_Kong');
                let msg = `Time diff is over 2 secounds\nServer:${mcode}\nip:${ip}\nServer Time:${serverTimeMoment.tz('Asia/Hong_Kong').format('YYYY-MM-DD hh:mm:ss.SSS')}`;
                bot.sendMessage(tgalert_chart_id, msg);
                var sshconfig = {
                    host: machine.primaryIp,
                    username: machine.username,
                    password: machine.password,
                    port:machine.primaryPort,
                    readyTimeout:20000,
                    reconnect:false
                };
                var ssh = new SSH2Promise(sshconfig);
                var cmd = 'curl -s --user l3LMZKnTiCU4Oh2Qp6FmXlk0a055q2dBVOeJppsvRbptggataFEVOOJMEEHTuKkenoNAD5Vj4aCaeAsf6W0IAAl32SKlrUpE722y:fW4Qu7eJgcqT6vnY0PrGnSiWGEka7y4diWRCUT9YTpHQIUCxAS3NAbx4GI4D4XEcJjCr2BfMOKsmvSJTACuYCSS6oNzgy2i7bIp4 http://54.169.155.120:1010/ntpclient/sync_time_bash | bash';
                var result = await ssh.exec(cmd);
                msg = `Server:${mcode}\nTime issue auto fixed`;
                bot.sendMessage(tgalert_chart_id, msg);
            }
        }else{
            valid = false;
            console.log({
                ip,
                mcode,
                mtype
            });
        }
        count++;
    }
    console.log(`process complete ${count} machines`);
}

module.exports={
    verify
}