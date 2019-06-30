var express = require('express');
var router = express.Router();
var asyncMiddleWare = require('../async-middle-ware');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../../db/machine');
var Snmp = require('../../db/snmp');
var redis = require("redis"), client = redis.createClient();

router.get('/', asyncMiddleWare(async (req, res, next) => {
    res.render('support/prtg');
}));
router.post('/render', asyncMiddleWare(async (req, res, next) => {
    let search = req.body.search;
    console.log(search);
    var whereObj={
        where:{
            mcode:{
                [Op.like]:'%'+search+'%'
            },
            enable:1
        },
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['mtype', 'DESC'],
        ]
    };
    var machines = await Machine.findAll(whereObj).map(row => {
        return row.dataValues;
    });
    var rs = [];
    for(idx in machines){
        console.log('idx:',idx);
        console.log(machines[idx].mcode);
        var tempobj={
            mtype:machines[idx].mtype,
            mcode:machines[idx].mcode
        };
        rs.push(tempobj);
    }
    res.json(rs);
}));

function sortObj( obj, order ) {
    "use strict";
    var key,
        tempArry = [],
        i,
        tempObj = {};

    for ( key in obj ) {
        tempArry.push(key);
    }
    tempArry.sort(
        function(a, b) {
            return a.toLowerCase().localeCompare( b.toLowerCase() );
        }
    );
    if( order === 'desc' ) {
        for ( i = tempArry.length - 1; i >= 0; i-- ) {
            tempObj[ tempArry[i] ] = obj[ tempArry[i] ];
        }
    } else {
        for ( i = 0; i < tempArry.length; i++ ) {
            tempObj[ tempArry[i] ] = obj[ tempArry[i] ];
        }
    }

    return tempObj;
}

router.post('/fetchnv', asyncMiddleWare(async (req, res, next) => {
    let mcode = req.body.mcode;
    //console.log(mcode);
    var history = await Snmp.findAll({
        where:{
            mcode:mcode
        },
        order:[
            ['timestamp','ASC']
        ]
    }).map(row=>{
        return row.dataValues;
    });
    var intraffic_vals=new Array();
    var outtraffic_vals=new Array();
    var totaltraffic_vals=new Array();
    var labels = new Array();
    var cpu = new Array();
    var ram_free = new Array();
    var ram_total = new Array();
    var openresty = new Array();
    var node188 = new Array();
    var last_idx;
    for(idx in history){
        var his_data = history[idx];
        var timestamp = his_data.timestamp;
        var date = new Date(timestamp*1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2);
        var datas = JSON.parse(his_data.value);
        labels.push(formattedTime);
        if(datas[0]=='dead'){
            intraffic_vals.push(0);
            outtraffic_vals.push(0);
            totaltraffic_vals.push(0);
            cpu.push(0);
            ram_free.push(0);
            ram_total.push(0);
            openresty.push(0);
            node188.push(0);
        }else{
            intraffic_vals.push(datas[8]);
            outtraffic_vals.push(datas[9]);
            totaltraffic_vals.push(datas[10]);
            cpu.push(datas[5]);
            ram_total.push(datas[6]);
            ram_free.push(datas[7]);
            if(datas[1]=='active'){
                openresty.push(1);
            }else{
                openresty.push(0);
            }
            if(datas[2]=='active'){
                node188.push(1);
            }else{
                node188.push(0);
            }
        }
        last_idx=idx;
    }
    var traffic={
        intraffic_vals:intraffic_vals,
        outtraffic_vals:outtraffic_vals,
        totaltraffic_vals:totaltraffic_vals
    };
    var is_dead = 0;
    var temp_data = JSON.parse(history[last_idx].value);
    if(temp_data[0]=='dead'){
        is_dead=1;
    }else{
        is_dead=0;
    }
    var rs={
        labels:labels,
        is_dead:is_dead,
        traffic:traffic,
        cpu:cpu,
        ram_total:ram_total,
        ram_free:ram_free,
        openresty:openresty,
        node188:node188
    };
    res.json(rs);
}));

router.post('/fetch', asyncMiddleWare(async (req, res, next) => {
    let mcode = req.body.mcode;
    last_data = await new Promise(function(resolve, reject){
        client.hgetall(mcode,function(err,reply){
            var temp_rs = new Array();
            temp_rs['success']=0;
            if(err){
                //console.log(err);
                reject('redis error');
            }else{
                temp_rs['success']=1;
                var history = sortObj(reply,'asc');
                //console.log(history);
                resolve(history);
            }
        });
    });
    var intraffic_x = new Array();
    var intraffic_y = new Array();
    var outtraffic_x = new Array();
    var outtraffic_y = new Array();
    var totaltraffic_x = new Array();
    var totaltraffic_y = new Array();
    var cpu_x= new Array();
    var cpu_y= new Array();
    var ram_total_x= new Array();
    var ram_total_y = new Array();
    var ram_free_x= new Array();
    var ram_free_y= new Array();
    var openresty_x= new Array();
    var openresty_y= new Array();
    var node188_x= new Array();
    var node188_y= new Array();

    var lasttime=0;
    for(idx in last_data){
        var date = new Date(parseInt(idx)*1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2);
        var datas = JSON.parse(last_data[idx]);
        if(datas[1]=='dead'){
            intraffic_y.push(0);
            outtraffic_y.push(0);
            totaltraffic_y.push(0);
            cpu_y.push(0);
            ram_total_y.push(0);
            ram_free_y.push(0);
            openresty_y.push(0);
            node188_y.push(0);
        }else{
            openresty_y.push(datas[2]);
            node188_y.push(datas[3]);
            cpu_y.push(datas[6]);
            ram_total_y.push(datas[7]);
            ram_free_y.push(datas[8]);
            intraffic_y.push(datas[9]);
            outtraffic_y.push(datas[10]);
            totaltraffic_y.push(datas[11]);
        }
        openresty_x.push(formattedTime);
        node188_x.push(formattedTime);
        cpu_x.push(formattedTime);
        ram_total_x.push(formattedTime);
        ram_free_x.push(formattedTime);
        intraffic_x.push(formattedTime);
        outtraffic_x.push(formattedTime);
        totaltraffic_x.push(formattedTime);
        if(parseInt(idx)>lasttime){
            lasttime = parseInt(idx);
        }
    }
    //console.log('lasttime:',lasttime);
    var is_dead = 0;
    var temp_data = JSON.parse(last_data[lasttime.toString()]);
    if(temp_data[1]=='dead'){
        is_dead=1;
    }else{
        is_dead=0;
    }
    var rs = {
        is_dead:is_dead,
        openresty:{
            x:openresty_x,
            y:openresty_y
        },
        node188:{
            x:node188_x,
            y:node188_y
        },
        cpu:{
            x:cpu_x,
            y:cpu_y
        },
        ram_total:{
            x:ram_total_x,
            y:ram_total_y
        },
        ram_free:{
            x:ram_free_x,
            y:ram_free_y
        },
        intraffic:{
            x:intraffic_x,
            y:intraffic_y
        },
        outtraffic:{
            x:outtraffic_x,
            y:outtraffic_y
        }
        ,
        totaltraffic:{
            x:totaltraffic_x,
            y:totaltraffic_y
        }
    };
    res.json(rs);
}));
module.exports = router;