const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../db/machine');
var Snmp = require('../db/snmp');
const encryptTools = require('../utils/encrypt-tools');
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
const sleep = require('await-sleep');
var expire_time = 2*60*60;
const tgalert_chart_id='-291145804';
var whereObj = {
    where: {
        enable:1,
        mtype:{
            [Op.in]:['type9','type7','type8','protect','188core','ip64v2']
        }
        //mcode:'va1_apple_feng005'
    }
};
const oids = [
    '1.3.6.1.2.1.1.3.0',    //uptime
    '1.3.6.1.4.1.2021.5000.4.1.2.15.99.104.101.99.107.95.111.112.101.110.114.101.115.116.121.1',    //openresty
    '1.3.6.1.4.1.2021.5010.4.1.2.13.99.104.101.99.107.95.110.111.100.101.49.56.56.1',   //node188
    '1.3.6.1.2.1.31.1.1.1.6', //intraffic
    '1.3.6.1.2.1.31.1.1.1.10', //outtraffic
    '1.3.6.1.4.1.2021.10.1.3.1', //cpu load
    '1.3.6.1.4.1.2021.4.3.0', //ram total
    '1.3.6.1.4.1.2021.4.11.0', //ram free
    //'1.3.6.1.4.1.2021.5011.4.1.2.9.99.114.109.95.115.112.101.101.100.1', // crm speed test
    '1.3.6.1.4.1.2021.5012.4.1.2.16.111.112.101.110.114.101.115.116.121.95.117.112.116.105.109.101.1' //openresty uptime
];
var snmptimeout=0;
if(process.env.DEV.toString()=='false'){
    snmptimeout=5000;
}else{
    snmptimeout=200;
}
const snmpOptions = {
    port: 161,
    retries: 3,
    timeout: snmptimeout,
    transport: "udp4",
    //trapPort: 162,
    version: snmp.Version2c,
    idBitsSize: 64
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
                var get_data=[
                    'dead'
                ];
                snmpsession.close ();
                //console.log('snmp level 1 error:',error);
                resolve(get_data);
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
                        var get_data=[
                            0
                        ];
                        //console.error('snmp level 2 error:',error);
                    }else{
                        for (var i = 0; i < varbinds.length; i++) {
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
                                /*case temp_oids[8]:
                                    var crm_speed= ''+varbinds[i].value;
                                    var js_str = ''+varbinds[i].value;
                                    if (/^[\],:{}\s]*$/.test(js_str.replace(/\\["\\\/bfnrtu]/g, '@').
                                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                                        var temp = JSON.parse(js_str);
                                    }else{
                                        var temp = JSON.parse('""');
                                    }
                                    crm_speed = temp;
                                    break;*/
                                case temp_oids[8]:
                                    //console.log(''+varbinds[i].value);

                                    var openresty_uptime_str = ''+varbinds[i].value;
                                    var js_str = ''+varbinds[i].value;
                                    if (/^[\],:{}\s]*$/.test(js_str.replace(/\\["\\\/bfnrtu]/g, '@').
                                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                                        var temp = JSON.parse(js_str);
                                    }else{
                                        var temp = JSON.parse('""');
                                    }
                                    var openresty_uptime=temp;
                                    //console.log('openresty_uptime:',openresty_uptime);
                                    break;
                            }
                        }
                        if(last_data['success']==1){
                            if(last_data['data'][0]=='dead'){
                                var inspeed = 0;
                                var outspeed = 0;
                                var total_traffic = 0;
                            }else{
                                timediff = timestamp-last_data['timestamp'];
                                var indiff = intraffic-last_data['data'][3];
                                var outdiff = outtraffic-last_data['data'][4];
                                var inspeed = speed_cal(indiff,timediff);
                                var outspeed = speed_cal(outdiff,timediff);
                                var total_traffic = Number((inspeed+outspeed).toFixed(3));
                            }
                        }else{
                            var inspeed = 0;
                            var outspeed = 0;
                            var total_traffic = 0;
                            //var crm_speed=''
                            var openresty_uptime = ''
                        }
                        var get_data=[
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
                            total_traffic,
                            //crm_speed,
                            openresty_uptime
                        ];
                        //console.log('get_data:',get_data);
                    }
                    snmpsession.close ();
                    resolve(get_data);
                });
            }
        });
    });
}
async function snmpRun(machine,timestamp){
    //console.log('start snmpRun');
    var snmpsession = snmp.createSession(machine.primaryIp, "public", snmpOptions);
    //console.log('snmpRun snmpsession ok');
    var snmp_record = await Snmp.findOne({
        where:{
            mcode:machine.mcode
        },
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['timestamp', 'DESC']
        ]
    });
    //console.log('snmp load session ok');
    var last_data = new Array();
    if(snmp_record){
        //console.log('load snmp_record');
        //console.log(snmp_record.dataValues);
        last_data['success']=1;
        last_data['data']=JSON.parse(snmp_record.dataValues.value);
        last_data['timestamp']=snmp_record.dataValues.timestamp;
    }else{
        //console.log('no snmp_record');
        //console.log('no last data');
        last_data['success']=0;
    }
    try{
        //console.log('try snmpget');
        var get_result = await snmpget(last_data,snmpsession,timestamp,machine);
        var db_data={
            timestamp:timestamp,
            mcode:machine.mcode,
            value:JSON.stringify(get_result)
        };
        await Snmp.create(db_data);
        //return get_result;
        return 'done snmpRun:'+machine.mcode;
    }catch(e){
        console.log('snmpgeterror:',e);
        return 'snmpgeterror';
    }

}
exports.snmpcheck = async function(){
    var timestamp = Math.floor(Date.now() / 1000);
    await Snmp.destroy({
        where:{
            timestamp:{
                [Op.lt]:timestamp-(expire_time)
            }
        }
    });
    //console.log('DEV:',process.env.DEV);
    //console.log('snmmp timeout:',snmpOptions.timeout);
    //console.log('snmmp retry:',snmpOptions.retries);
    var machines = await Machine.findAll(whereObj).map(row => {
        return row.dataValues;
    });
    for(idx in machines){
        var machine = machines[idx];
        try{
            //console.log('start snmpRun:',machine.mcode);
            var snmprs = await snmpRun(machine,timestamp);
            //console.log(snmprs);
        }catch (e) {
            console.log('snmpRunerror:',e);
        }
        await sleep(300);
    }
    console.log('End Snmp Check');
    rs = 1;
    return rs;
}