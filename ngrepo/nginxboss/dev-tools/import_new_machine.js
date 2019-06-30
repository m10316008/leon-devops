const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../db/machine');
const encryptTools = require('../utils/encrypt-tools');
const deploy = require('../utils/deploy');
const fs = require('fs');
const path = require('path');
var rsaPath = path.join(__dirname, '..', '.rsa');
var pubPem = fs.readFileSync(path.join(rsaPath, 'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath, 'mykey.pem'));
async function main(){
    console.log('start');
    var columns = ['prefix', 'code', 'mcode', 'ip', 'port', 'password', 'hosting', 'type','location','net'];
    var exclude=[
        'geoip',
        'redirect',
        '中轉'
    ];
    var csvtoarray = await new Promise(function (resolve, reject) {
        require("csv-to-array")({
            file: 'warrior_newmachine_43.csv',
            columns: columns
        }, function (err, array) {
            resolve(array);
        });
    });
    //console.log('csvtoarray:',csvtoarray);
    var counter =0;
    for(record of csvtoarray){
        if(record.code!='code'){
            if(exclude.indexOf(record.type)== -1){
                //console.log('record:',record);
                console.log(record.type);
                counter++;
                console.log('mcode:',record.mcode);
                await Machine.destroy({
                    where:{
                        mcode:record.mcode
                    }
                });
                var vendor;
                var location;
                switch(record.hosting){
                    case 'feng':
                        vendor=2;
                        break;
                    case 'zero':
                        vendor=3;
                        break;
                }
                switch(record.location){
                    case '柴湾':
                        location='cw';
                        break;
                    case '荃湾':
                        location='tw';
                        break;
                }
                var data={
                    mcode:record.mcode,
                    vcode:'vg7',
                    vendor:vendor,
                    location:location,
                    mclass:'openresty',
                    mtype:record.type,
                    primaryIp:record.ip,
                    primaryPort:record.port,
                    price:0,
                    firstPayment:'2018-10-25',
                    enable:false,
                    remark:"",
                    remarktag:"",
                    username:'root',
                    password:record.password,
                    sshKey:"--",
                    fullip:"",
                    uat4_db_host:null,
                    uat4_db_user:null,
                    uat4_db_password:null
                }
                console.log('data:',data);
                await Machine.create(data);
            }
        }
    }
    console.log('counter:',counter);
    process.exit();
}
main();