var express = require('express');
var router = express.Router();
const {promisify} = require('util');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var asyncMiddleWare = require('../async-middle-ware');
var CloudflareAccountDBO = require('../../db/cloudflare-account');
var CloudflareDomainDBO = require('../../db/cloudflare-domain');
var Cloudflare = require('cloudflare');
var Brand = require('../../db/brand');
const dns  = require('dns');
dns.setServers([
    '8.8.8.8',
    '1.1.1.1',
    '8.8.4.4'
]);
const cloudflareTools = require('../../utils/cloudflare-tools');

router.get('/', asyncMiddleWare(async (req, res, next) => {
    let brands = await Brand.findAll();
    let brandsMap = {};
    brands.map(b => {
        brandsMap[b.vcode] = b.brand;
    });
    res.render('support/cloudflare',{
        brandList: brands
    });
}));

router.post('/api',asyncMiddleWare(async(req,res,next)=>{
    let action_case = req.body.action_case;
    let rs = [];
    switch(action_case){
        case 'update_vcode':
            console.log(req.body);
            var domain = req.body.domain;
            var vcode = req.body.vcode;
            var opt={
                where:{
                    domain:domain
                }
            };
            var data={
                vcode:vcode
            };
            await CloudflareDomainDBO.update(data,opt);
            rs['success'] = 1;
            break;
        case 'purge':
            var domain = req.body.domain;
            let whereObj = {
                where:{
                    domain:domain
                }
            };
            var cfdomain = await CloudflareDomainDBO.findOne({
                where:{
                    domain:domain
                }
            });
            var cfAc = await CloudflareAccountDBO.findOne({
                where:{
                    email:cfdomain.dataValues.cf_ac
                }
            });
            try{
                var purge = await cloudflareTools.purge_api(cfAc.dataValues.email,cfAc.dataValues.api_key,cfdomain.dataValues.zone_id);
                //console.log('purge:',purge);
            }catch(e){
                //console.log(e);
            }
            res.json(purge);
            break;
    }
    res.json(rs);
}));

router.get('/render_table',asyncMiddleWare(async(req,res,next)=>{
    var opt={
        order: ['vcode']
    }
    var info = await CloudflareDomainDBO.findAll(opt).map(row=>{
        let action = '';
        action ='<button class="btn btn-primary action" data-action_case="purge" data-domain="'+row.dataValues.domain+'">Purge Everything</button>';
        row.dataValues.action='';
        if(row.dataValues.vcode==null){
            row.dataValues.vcode_content='<button id="btn_sel_vcode" data-domain="row.dataValues.domain">Select a vcode</button>';
        }else{
            row.dataValues.vcode_content=row.dataValues.vcode;
        }
        row.dataValues.action=action;
        return row.dataValues;
    });
    res.json(info);
}));

router.get('/update',asyncMiddleWare(async (req, res, next) => {
    var cf_acs = await CloudflareAccountDBO.findAll({
        //limit:1
    });
    var counter = [];
    let zone_ids = [];
    for(var cf_ac of cf_acs){
        var cf_ac_obj = cf_ac.dataValues;
        var cf = new Cloudflare({
        //var cf = require('cloudflare')({
            email:cf_ac_obj.email,
            key:cf_ac_obj.api_key
        });
        var zones = await cf.zones.browse();
        for(var zone of zones.result){
            var domain = zone.name;
            var zone_id = zone.id;
            var dns_record_obj = await cf.dnsRecords.browse(zone.id);
            var proxied = 0;
            var content = '';
            for(var dns_record of dns_record_obj.result){
                if(dns_record.name===domain && (dns_record.type==='CNAME' || dns_record.type==='A')){
                    if(dns_record.proxied==true){
                        proxied = 1;
                    }else{
                        proxied = 0;
                    }
                    content = dns_record.content;
                }
            }
            zone_ids.push(zone.id);
            var vcode='';
            if(/1717/.test(domain)){
                vcode = 've5';
            }
            if(/ldc/.test(domain)){
                vcode = 'vb2';
            }
            if(/9393/.test(domain)){
                vcode = 'vc3';
            }
            if(/3535/.test(domain)){
                vcode = 'va1';
            }
            if(/567/.test(domain)){
                vcode = 'vi9';
            }
            if(/68bet/.test(domain)){
                vcode = 'vh8';
            }

            var data={
                domain:domain,
                zone_id:zone_id,
                proxied:proxied,
                cf_ac:cf_ac_obj.email,
                vcode:vcode,
                content:content
            };
            //console.log(data);
            var match = await CloudflareDomainDBO.findOne({
                where:{
                    zone_id:zone_id
                }
            });
            if(match){
                await CloudflareDomainDBO.update(data,{
                    where:{
                        zone_id:zone_id
                    }
                });
                counter['update']+=1;
            }else{
                await CloudflareDomainDBO.create(data);
                counter['create']+=1;
            }
            let resdomain = domain;
            var resolveResult = await resolvesoa(resdomain);
            console.log('resolveResult:',resolveResult);
            //var resolveResult = await resolvesoa(resdomain);
            if(resolveResult!=null){
                console.log('resolveResult:',resolveResult);
            }
            if(resolveResult!=undefined){
                var data={
                    nsname:resolveResult[0]
                };
                await CloudflareDomainDBO.update(data,{
                    where:{
                        zone_id:zone_id
                    }
                });
            }
        }
    }
    //console.log('zone_ids:',zone_ids);
    await CloudflareDomainDBO.destroy({
        where:{
            zone_id:{
                [Op.notIn]:zone_ids
            }
        }
    });
    var rs = {
        counter:JSON.stringify(counter),
        success:1
    };
    res.json(rs);
}));
async function resolvesoa(domain){
    return new Promise((resolve,reject)=>{
        console.log('start resolve');
        dns.resolveNs(domain,function(error,response){
            console.log('response:',response);
            console.log('error:',error);
            resolve(response);
        });
    });
}
/*async function resolvesoa(domain){
    return new Promise(async (resolve,reject)=>{
        //console.log('domain:',domain);
        var _result = await promisify(dns.resolveSoa).bind(dns)(domain).catch((err)=>{
            //console.log('err: ',err);
            reject(err);
        });
        //console.log('_result:',_result);
        if(_result!=undefined){
            resolve(_result);
        }
    });
}*/

module.exports = router;