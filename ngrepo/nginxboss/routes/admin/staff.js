var express = require('express');
var router = express.Router();

var format = require('../../utils/format');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var Login = require('../../db/login');

//var asyncMiddleware = require('../async-middle-ware');

router.get('/', function (req, res, next) {
    Login
        .findAll({where: {superAdmin: {[Op.ne]: 1}, username: {[Op.ne]: req.user.username}}})
        .then(rows => {
            var userlist = rows.map(row => {
                row.dataValues.password = '';
                row.dataValues.createdAt = format.dateTimeFormat(row.dataValues.createdAt);
                row.dataValues.updatedAt = format.dateTimeFormat(row.dataValues.updatedAt);
                return row.dataValues
            });

            res.render('admin/staff', {userlist: userlist});
        });

});

router.get('/staff', function (req, res, next) {
    Login
        .findOne({where: {superAdmin: {[Op.ne]: 1}, username: req.query.username}})
        .then(row => {
            row.dataValues.password = '';
            res.json(row.dataValues);
        });
});

router.put('/staff', function (req, res, next) {
    var newStaff = req.body;
    newStaff.createdBy = req.user.username;
    newStaff.rights = JSON.stringify({
        xterm: false
    });
    Login.create(newStaff).then(row => {
        //console.log(row);
        res.json(true);
    }).catch((err) => {
        //console.log(err);
        res.json(false);
    });

});

router.patch('/staff', function (req, res, next) {
    //console.log('patch staff');
    //console.log(req.body);
    Login
        .update(req.body, {where: {username: req.body.username}})
        .then(affectedRows => {
            //console.log('affectedRows:' + affectedRows);
            res.json(true);
        })
        .catch(err => {
            res.json(false);
        });
});


module.exports = router;
