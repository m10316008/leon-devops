var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        switch (req.user.userRole) {
            case 'admin':
            //res.redirect('/admin/');
            //break;
            case 'support':
                res.redirect('/support/');
                break;
            default:
                res.send('unknown userRole <a href="/logout">logout</a>');
                break;
        }
    } else {
        res.render('login', { layout: false });
    }
});
router.post('/base/api', function (req, res, next) {
    var action = req.body.action;
    var check;
    switch(action){
        case 'check_session':
            if(req.isAuthenticated()){
                //console.log('uid',req.user.username);
                check=1;
            }else{
                check=0;
            }
            break;
    }
    if(process.env.DEV.toString()=='true'){
        check=1;
    }
    var rs={
        nginxBossVersion:req.app.get('config').nginxBossVersion.version,
        success:check
    }
    res.json(rs);
});
module.exports = router;
