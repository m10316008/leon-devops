var ConnectRoles = require('connect-roles');
var connectRoles = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when 
        // user fails authorisation 
        var accept = req.headers.accept || '';
        res.status(403);
        if (~accept.indexOf('html')) {
            //res.render('access-denied', { action: action });
            //res.send('<h2>Access Denied html - You don\'t have permission to: ' + action + '</h2>');
            res.render('error/503', { layout: false });
        } else {
            //res.send('Access Denied - You don\'t have permission to: ' + action);
            res.json({ error: 503 });
        }
    }
});

connectRoles.use('admin', function (req) {
    return req.isAuthenticated()
        && req.user.userRole === 'admin';
});

connectRoles.use('support', function (req) {
    return req.isAuthenticated() &&
        (req.user.userRole === 'admin' || req.user.userRole === 'support');
});

module.exports = connectRoles;
