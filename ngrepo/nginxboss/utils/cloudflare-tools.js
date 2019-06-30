const request = require('request-promise');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var CloudflareAccountDBO = require('../db/cloudflare-account');
var CloudflareDomainDBO = require('../db/cloudflare-domain');
var Cloudflare = require('cloudflare');

async function purge_api(email, api_key, zone_id) {
    var dataString = '{"purge_everything":true}';
    var options = {
        uri: 'https://api.cloudflare.com/client/v4/zones/' + zone_id + '/purge_cache',
        body: {
            purge_everything: true
        },
        method: 'POST',
        headers: {
            'X-Auth-Email': email,
            'X-Auth-Key': api_key,
            'Content-Type': 'application/json'
        },
        json: true
    };
    try {
        var result = await request(options);
        var rs = {
            success: 1,
            data: result
        }
    } catch (err) {
        var result = err;
        var rs = {
            success: 0,
            data: err
        }
    }
    return rs;
}

async function getDnsRecord(zone_id){
    var domainInfo = await CloudflareDomainDBO.findOne({
        where:{
            zone_id:zone_id
        }
    });
    //console.log(domainInfo.dataValues);
    var cfAcEmail = domainInfo.dataValues.cf_ac;
    var acInfo = await CloudflareAccountDBO.findOne({
        where:{
            email:cfAcEmail
        }
    });
    //console.log(acInfo.dataValues);
    var cf = new Cloudflare({
        //var cf = require('cloudflare')({
        email:acInfo.dataValues.email,
        key:acInfo.dataValues.api_key
    });
    var dns_record_obj = await cf.dnsRecords.browse(zone_id)

    console.log(dns_record_obj);
}
exports.getDnsRecord=getDnsRecord;
exports.purge_api = purge_api;

