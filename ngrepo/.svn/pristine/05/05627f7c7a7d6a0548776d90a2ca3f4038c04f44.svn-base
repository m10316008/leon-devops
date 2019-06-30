var express = require('express');
var router = express.Router();
var asyncMiddleWare = require('../async-middle-ware');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const machineDao = require('../../db/machine');
var StaticInfoDao = require('../../db/static-info');
const Redis = require('ioredis');
const redis = new Redis();

router.get('/', asyncMiddleWare(async (req, res, next) => {
    var datas = await StaticInfoDao.findAll().map(row=>{
        return row.dataValues;
    });

    var cloudflare = new Array();
    var noip = new Array();
    var chinanetcenter = new Array();
    for(idx in datas){
        switch(datas[idx].type){
            case 'cloudflare':
                cloudflare.push(datas[idx]);
                break;
            case 'noip':
                noip.push(datas[idx]);
                break;
            case 'chinanetcenter':
                chinanetcenter.push(datas[idx]);
                break;
        }
    }
    var rs = {
        noip:noip,
        cloudflare:cloudflare,
        chinanetcenter:chinanetcenter
    };
    res.render('support/static-info', rs);
}));
router.get('/info/machine.json', asyncMiddleWare(async (req, res, next) => {
    let rediskey = 'nginxboss:machineJson';
    let redisResult = await redis.get(rediskey);
    if(redisResult){
        res.json(JSON.parse(redisResult));
    }else{
        let machines = await machineDao.findAll({
            where:{
                mtype:{
                    [Op.in]:['type8','protect','type7']
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

router.post('/api', asyncMiddleWare(async (req, res, next) => {
    var rs={
        success:0
    };
    switch (req.body.action) {
        case 'get_info':
            var success;
            var info;
            try{
                if(req.user.userRole=='admin'){
                    success = 1;
                    if(req.body.id){
                        var id = req.body.id;
                        var info = await StaticInfoDao.find({
                            where:{
                                id:id
                            }
                        });
                    }
                }else{
                    info={};
                    success = 0;
                }
            }catch(e){
                info={
                    error:e
                };
                success = 0;
            }
            rs={
                info:info,
                success:success
            };
            break;
        case 'submit':
            if(req.body.value=='*****'){
                delete req.body.value;
            }
            delete req.body.value1;
            delete req.body.action;
            var id = req.body.id;
            delete req.body.id;

            var data = req.body;
            //console.log('id:',id);
            console.log('data:',data);
            await StaticInfoDao.update(data, {
                where: {
                    id: id
                }
            });
            rs={
                success:1
            };
            break;
    }
    res.json(rs);
}));

module.exports = router;