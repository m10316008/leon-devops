var express = require('express');
var Brand = require('../db/brand');
var BrandCrm = require('../db/brand-crm');
var Machine = require('../db/machine');
var MachineRental = require('../db/machine-rental');
var Configs = require('../db/configs');
var Cmd = require('../db/cmd');
var Login = require('../db/login');
var MachineVendors = require('../db/machine-vendor');
var CloudflareAccount = require('../db/cloudflare-account');
var CloudflareDomain = require('../db/cloudflare-domain');
var Snmp = require('../db/snmp');
var deploy = require('../utils/deploy');
var StaticInfoDao = require('../db/static-info');
var ChinanetcenterDomain = require('../db/chinanetcenter-domain');
async function main() {
    /*await Login.sync({
       force:true
    });*/
    /*var brandJson = require('./mt_');*/

    await Brand.sync({
        force: true
    });
    var brandJson = require('./brand');
    var brands = brandJson;
    await Brand.bulkCreate(brands);

    /*await BrandCrm.sync({
        force: true
    });
    var brand_crms = require('./brand-crm');
    await BrandCrm.bulkCreate(brand_crms);*/

    /*await Machine.sync({
        force: true
    });
    var machines = require('./machine.json');
    await Machine.bulkCreate(machines);*/
    /*for(var idx in machines){
        await deploy.getFullIp(machines[idx].mcode,machines[idx].primaryIp,machines[idx].username,machines[idx].password,machines[idx].primaryPort);
    }*/
    /*await StaticInfoDao.sync({
        force:true
    });
    var staticInfo = require('./static-info.json');
    await StaticInfoDao.bulkCreate(staticInfo);*/
    /*await MachineRental.sync({
        force:true
    });*/

    /*await Configs.sync({
        force:true
    });*/


    /*await MachineVendors.sync({force:true});

    var machine_vendors =[
        {name:'alicloud'},
        {name:'feng'},
        {name:'lingdu'},
        {name:'aws'},
        {name:'others'}
    ];
    await MachineVendors.bulkCreate(machine_vendors);*/

    /*await Cmd.sync({
        force: true
    });
    var cmds = [{
        name: 'openresty_status',
        cmd: 'systemctl status openresty'
    }, {
        name: 'node188_status',
        cmd: 'systemctl status node188'
    }, {
        name: 'nginx_status',
        cmd: 'systemctl status nginx'
    }];
    await Cmd.bulkCreate(cmds);*/

    /*await CloudflareAccount.sync({
        force:true
    });
    var cf_acs = [{
        email:'bmazongalaxy@outlook.com',
        api_key:'94f4fe3375227a4c1f83c16239ba3908e83f7'
    },{
        email:'mike@vgt.com.hk',
        api_key:'12a7a79e2a1750a478f161f53172c7b3eadf2'
    },{
        email:'bmazonempire@outlook.com',
        api_key:'5ebc84db87e1b602d45a44f9c77c425e26d22'
    },{
        email:'le1.tech005@gmail.com',
        api_key:'53618641242f2a732a7fa8aef438c48528660'
    }];
    await CloudflareAccount.bulkCreate(cf_acs);*/

    /*await CloudflareDomain.sync({
        force:true
    });*/
    /*await Snmp.sync({
        force:true
    });*/
    /*await ChinanetcenterDomain.sync({
        force:true
    });*/

    process.exit();
}
main();