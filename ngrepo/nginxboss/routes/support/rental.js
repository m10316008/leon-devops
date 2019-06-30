var express = require('express');
var router = express.Router();
var asyncMiddleWare = require('../async-middle-ware');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var Machine = require('../../db/machine');
var Machine_rental = require('../../db/machine-rental');
var moment = require('moment');
var Configs = require('../../db/configs');
router.get('/tag', asyncMiddleWare(async (req, res, next) => {
    var tags = await Configs.findOne({
        key: 'rental_tags'
    });
    if (tags.dataValues.value == '' || tags.dataValues.value == null) {
        var tags = '';
    } else {
        var tags = JSON.parse(tags.dataValues.value).join(',');
    }
    res.render('support/rental/tag', {
        tags: tags
    });
}));
router.post('/tag/api', asyncMiddleWare(async (req, res, next) => {
    var req_action = req.body;
    switch (req_action.action) {
        case 'submit':
            var tags = req_action.tag.split(",");
            var db_data = {
                value: JSON.stringify(tags)
            }
            await Configs.update(db_data, {
                where: {
                    key: 'rental_tags'
                }
            });
            var rs = {
                success: 1
            };
            break;
    }
    res.json(rs);
}));
router.get('/debt', asyncMiddleWare(async (req, res, next) => {
    var tags_data = await Configs.findOne({
        where: {
            key: 'rental_tags'
        }
    });
    var tags = new Array();
    if (tags_data.dataValues.value == '' || tags_data.dataValues.value == null) {

    } else {
        var temp_tags = JSON.parse(tags_data.dataValues.value);
        for (idx in temp_tags) {
            var tag_obj = {
                id: temp_tags[idx],
                value: temp_tags[idx]
            }
            tags.push(tag_obj)
        }
    }
    res.render('support/rental/debt', {
        tags: tags
    });
}));
router.post('/debt/api', asyncMiddleWare(async (req, res, next) => {
    var req_action = req.body;
    var now = new moment();
    switch (req_action.action) {
        case 'submit':
            var post_data = req_action;
            var temp_paytag = post_data.paytag;
            console.log('temp_paytag:',temp_paytag);
            if (temp_paytag) {
                if(Array.isArray(temp_paytag)){
                }else{
                    temp_paytag = temp_paytag.split(',');
                }
                console.log(temp_paytag);
                paytag = JSON.stringify(temp_paytag);
            } else {
                paytag = '';
            }

            if(req.isAuthenticated()){
                var username = req.user.username;
            }else{
                username='UNKNOWN';
            }
            try {
                var remarktag = JSON.parse(post_data.remarktag);
            }catch(e){
                var remarktag = JSON.parse("");
            }

            var db_data = {
                mcode: post_data.mcode,
                vcode: post_data.vcode,
                rentalStart: post_data.rentalStart,
                rentalEnd: post_data.rentalEnd,
                price: Number(post_data.price * 1),
                paytag: paytag,
                remark: post_data.remark,
                payDate: post_data.payDate,
                remarktag:remarktag,
                createdBy:username
            };
            await Machine_rental.create(db_data);
            var rs = {
                success: 1
            };
            res.json(rs);

            break;
        case 'render_debt_table':
            var whereObj = {
                where: {}
            };
            var whereand = new Array();
            var mcodes;
            var createdBy;
            if (req.isAuthenticated()) {
                createdBy = req.user.username
            } else {
                createdBy = '';
            }
            var thisYear = (new Date()).getFullYear();
            var start = new Date("1/8/" + thisYear);
            if(req_action['options[mcodes]']!=undefined && req_action['options[mcodes]']!=''){
                mcodes = JSON.parse(req_action['options[mcodes]']);
                if(mcodes.length>=1){
                    whereand.push({
                        mcode:{
                            [Op.in]:mcodes
                        }
                    });
                    console.log('mcodes:',mcodes);
                    console.log('mcodes.length:',mcodes.length);
                }
            }
            whereand.push({
                enable: 1
            });
            whereand.push({
                price: {
                    [Op.not]: 0
                }
            });
            whereand.push({
                firstPayment: {
                    [Op.gt]: '2018-01-01'
                }
            });
            whereObj.where[Op.and]=whereand;

            var machines = await Machine.findAll(whereObj).map(row => {
                var d_value = row.dataValues;
                var temp_obj = {
                    vcode: d_value.vcode,
                    mtype: d_value.mtype,
                    mcode: d_value.mcode,
                    price: d_value.price,
                    firstPayment: d_value.firstPayment,
                    remark: d_value.remark,
                    remarktag:JSON.stringify(d_value.remarktag)
                }
                return temp_obj;
            });
            var cards = [];
            var today = moment().add(21, 'd');
            //console.log('today:',today);
            for (var machine of machines) {
                var start_date = moment(machine.firstPayment);
                while (today.diff(start_date, 'days') > 1) {
                    var matchpayment = await Machine_rental.findAndCountAll({
                        where: {
                            mcode: machine.mcode,
                            rentalStart: start_date.format('YYYY-MM-DD')
                        }
                    });
                    if (matchpayment.count == 0) {
                        var end_date = new moment(start_date);
                        end_date.add(1, 'M');
                        var card = {
                            vcode: machine.vcode,
                            mcode: machine.mcode,
                            rentalStart: start_date.format('YYYY-MM-DD'),
                            rentalEnd: end_date.format('YYYY-MM-DD'),
                            price: machine.price,
                            mtype: machine.mtype,
                            remark: machine.remark,
                            firstPayment: machine.firstPayment,
                            remarktag:machine.remarktag,
                            createdBy: createdBy
                        };
                        cards.push(card);
                    }
                    start_date.add(1, 'M');
                }
            }
            var rs = {
                cards: cards
            };
            res.json(rs);
            break;
        case 'search_by_ip':
            var ips = req_action.formSearchByIp_ips.split('\n');
            var ip_list = new Array();
            var not_found = new Array();
            for (idx in ips) {
                var regex = /\d+\.\d+\.\d+\.\d+/g;
                var row = ips[idx];
                var matches;
                //var matches = row.match(regex);
                do {
                    matches = regex.exec(row);
                    if (matches) {
                        console.log(matches);
                        console.log('ip:', matches[0]);
                        var ip = matches[0];
                        var machine = await Machine.findOne({
                            where: {
                                fullip: {
                                    [Op.like]: '%' + ip + '%'
                                }
                            }
                        });
                        if (machine) {
                            var temp_obj = {
                                ip: ip,
                                mcode: machine.dataValues.mcode
                            }
                        } else {
                            var temp_obj = {
                                ip: ip,
                                mcode: 'UNKNOWN'
                            }
                        }
                        ip_list.push(temp_obj);
                    }
                } while (matches);
            }
            var rs = {
                ip_list: ip_list
            }
            res.json(rs);
            break;
    }
}));
router.get('/report', asyncMiddleWare(async (req, res, next) => {
    var tags_data = await Configs.findOne({
        where:{
            "key": 'rental_tags'
        }
    });
    var tags = new Array();
    if (tags_data.dataValues.value == '' || tags_data.dataValues.value == null) {

    } else {
        var temp_tags = JSON.parse(tags_data.dataValues.value);
        for (idx in temp_tags) {
            var tag_obj = {
                id: temp_tags[idx],
                value: temp_tags[idx]
            }
            tags.push(tag_obj)
        }
    }
    res.render('support/rental/report',{
        tags:tags
    });
}));
router.post('/report/api', asyncMiddleWare(async (req, res, next) => {
    var post_data = req.body;
    switch (post_data.action) {
        case 'render_table':
            console.log('action:','render_table');
            //var search_tag = post_data['tag[]'];
            if(post_data['search_tag']!=''){
                var search_tag = JSON.parse(post_data['search_tag']);
                console.log('search_tag:',search_tag);
            }
            var whereAnd = new Array();
            for(idx in search_tag){
                //console.log('key:',idx);
                //console.log('value:',search_tag[idx]);
                if(search_tag[idx]!=''){
                    whereAnd.push(
                        Sequelize.where(Sequelize.fn('JSON_VALUE', Sequelize.col('remarktag'), '$.'+idx),search_tag[idx])
                    );
                }
            }
            //console.log('whereAnd:',whereAnd);
            var whereObj = {
                [Op.and]:whereAnd
            };


            var results = await Machine_rental.findAll({
                where:whereObj
                //where
            }).map(row=>{
                return row.dataValues;
            });
            var data= new Array();
            for(idx in results){
                var action = '';
                var temp = new Array();
                temp.push(results[idx].mcode);
                temp.push(results[idx].vcode);
                temp.push(results[idx].rentalStart);
                temp.push(results[idx].rentalEnd);
                temp.push(results[idx].payDate);
                temp.push(results[idx].price);
                temp.push(results[idx].remarktag);
                temp.push(results[idx].remark);
                temp.push(action);
                data.push(temp);
            }

            var rs={
                draw: post_data.draw,
                recordsTotal:data.length,
                recordsFiltered:data.length,
                data:data
            };
            res.json(rs);
            break;
    }
}));

router.get('/', asyncMiddleWare(async (req, res, next) => {
    res.render('support/rental/index');
}));

module.exports = router;