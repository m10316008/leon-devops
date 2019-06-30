var express = require('express');
var router = express.Router();

var Login = require('../db/login');
var bcryptjs = require('bcryptjs');

/* GET home page. 
router.get('/', function (req, res, next) {
    res.render('index', { title: '/common/' });
});
*/

router.use(function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('503');
    }
});

router.get('/password', function (req, res, next) {
    res.render('common/password');
});

router.post('/password', function (req, res, next) {
    Login
        .findOne({ where: { username: req.user.username } })
        .then(row => {
            if (row && row.dataValues && bcryptjs.compareSync(req.body.password, row.dataValues.password)) {
                //console.log(req.body.newPassword);
                var tmpLogin = {
                    password: req.body.newPassword
                }
                //console.log(tmpLogin);
                Login
                    .update(tmpLogin, { where: { username: req.user.username } })
                    .then(affectedRow => {
                        //console.log('affectedRow:' + affectedRow);
                        res.json(true);
                    });
            } else {
                res.json(false);
            }
        });

});


module.exports = router;
