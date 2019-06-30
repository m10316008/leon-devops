var express = require('express');
var router = express.Router();
var asyncMiddleWare = require('../async-middle-ware');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const machineDao = require('../../db/machine');
var StaticInfoDao = require('../../db/static-info');
const Redis = require('ioredis');
const redis = new Redis();

router.get('/machine.json', asyncMiddleWare(async (req, res, next) => {
    let rediskey = 'nginxboss:machineJson';
    let redisResult = await redis.get(rediskey);
    if(redisResult){
        res.json(JSON.parse(redisResult));
    }else{
        let machines = await machineDao.findAll({
            where:{
                mtype:{
                    [Op.in]:['type8','protect','type7','type9']
                }
            }
        }).map(res=>{
            return res.dataValues;
        });
        let json = [];
        for(let idx in machines){
            let _obj = {
                mcode:machines[idx].mcode,
                vcode:machines[idx].vcode,
                mtype:machines[idx].mtype,
                ip:machines[idx].primaryIp,
                ips:machines[idx].fullip.split(','),
                enable:machines[idx].enable
            }
            json.push(_obj);
        }
        res.json(json);
        redis.setex(rediskey,1800,JSON.stringify(json));
    }
}));
module.exports = router;