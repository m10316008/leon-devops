var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./security/passport');
var connectRoles = require('./security/connect-roles');
var app = express();
var nginxBossVersion = require('./version');
var appConfig={
    nginxBossVersion:nginxBossVersion
};
global.reqlib = require('app-root-path').require;

app.use(require('compression')());
require('dotenv').config();
app.set('config', appConfig);


// begin of adding block function
var hbs = require('hbs');
var blocks = {};
hbs.registerHelper('extend', function (name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(context.fn(this));
});


hbs.registerHelper('empty', function (args1, args2, context) {
    if (args1 === '' || args1===null) {
        return context.fn(this);
    } else {
        if (typeof(args1) === 'number' && args1.toString() === args2.toString()) {
            return context.fn(this);
        }
        return context.inverse(this);
    }
});

hbs.registerHelper('equal', function (args1, args2, context) {
    if (args1 === args2) {
        //满足添加继续执行
        return context.fn(this);
    } else {
        if (typeof(args1) === 'number' && args1.toString() === args2.toString()) {
            return context.fn(this);
        }
        //不满足条件执行{{else}}部分
        return context.inverse(this);
    }
});

hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');
    blocks[name] = []; // clear the block
    return val;
});

hbs.__switch_stack__ = [];
hbs.registerHelper( "switch", function( value, options ) {
    hbs.__switch_stack__.push({
        switch_match : false,
        switch_value : value
    });
    var html = options.fn( this );
    hbs.__switch_stack__.pop();
    return html;
} );
hbs.registerHelper( "case", function( value, options ) {
    var args = Array.from( arguments );
    var options = args.pop();
    var caseValues = args;
    var stack = hbs.__switch_stack__[hbs.__switch_stack__.length - 1];

    if ( stack.switch_match || caseValues.indexOf( stack.switch_value ) === -1 ) {
        return '';
    } else {
        stack.switch_match = true;
        return options.fn( this );
    }
} );
hbs.registerHelper( "default", function( options ) {
    var stack = hbs.__switch_stack__[hbs.__switch_stack__.length - 1];
    if ( !stack.switch_match ) {
        return options.fn( this );
    }
});
// end of adding block function


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// passportjs
app.use(require('express-session')({
    secret: 'hulkbuster',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * (60000)
    },
    rolling: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectRoles.middleware());
app.use(function (req, res, next) {
    try {
        res.locals.isAdmin = req.user.userRole === 'admin' ? true : false;
    } catch (err) {
        res.locals.isAdmin = false;
    }
    next();
});

app.get(
    '/login',
    function (req, res) {
        res.render('login', {
            layout: false
        });
    }
);

app.post(
    '/login',
    passport.authenticate(
        'local', {
            successReturnToOrRedirect: '/',
            failureRedirect: '/login'
        }
    )
);

app.get(
    '/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    }
);
// end of passportjs




// Begin of router config
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const commonRouter = require('./routes/common');
app.use('/common', commonRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', connectRoles.can('admin'), adminRouter);

const supportRouter = require('./routes/support');
if(process.env.DEV.toString()=='false'){
    app.use('/support', connectRoles.can('support'), supportRouter);
}else{
    app.use('/support', supportRouter);
}
const testRouter = require('./routes/test');
app.use('/test',  testRouter);

const healthRouter = require('./routes/health');
app.use('/health', healthRouter);

const edgeRouter = require('./routes/edge');
app.use('/edge',edgeRouter);

// End of router config
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    next();
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;