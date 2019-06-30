var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');


var Login = require('../db/login');
passport.use(
    new Strategy(
        { passReqToCallback: true },
        function (req, username, password, cb) {
            Login.findById(username).then(
                row => {
                    if (row && row.dataValues) {
                        var dbUser = row.dataValues;

                        if (dbUser.active) {
                            bcryptjs
                                .compare(password, dbUser.password)
                                .then(
                                    isPasswordSame => {
                                        if (isPasswordSame) {
                                            req.session.userRole = dbUser.userRole;
                                            //console.log(req.session.userRole);
                                            userStore[username] = dbUser;
                                            cb(null, dbUser);
                                        } else {
                                            //cb('USERNAME_PASSWORD_INCORRECTED');
                                            cb(null, false);
                                        }
                                    },
                                    () => {
                                        //cb('USERNAME_PASSWORD_INCORRECTED');
                                        cb(null, false);
                                    }
                                );
                        } else {
                            //cb('USER_SUSPENDED');
                            cb(null, false);
                        }

                    } else {
                        //cb('USERNAME_PASSWORD_INCORRECTED');
                        cb(null, false);
                    }
                },
                error => {
                    cb(error);
                }
            );
        }
    )
);

passport.serializeUser(function (user, cb) {
    //console.log('\t===>\tserializeUser');
    cb(null, user.username);
});

var userStore = {};

passport.deserializeUser(function (username, cb) {
    //console.log('\t===>\tdeserializeUser');

    if (userStore[username]) {
        cb(null, userStore[username]);
    } else {
        console.log('Cannot find user in userStore{}');
        Login.findById(username).then(
            row => {
                if (row.dataValues) {
                    var dbUser = row.dataValues;
                    if (dbUser && dbUser) {
                        userStore[username] = dbUser;
                        cb(null, userStore[username]);
                    } else {
                        cb(error);
                    }
                }
            },
            error => {
                cb(error);
            }
        );
    }
    /*
    */
});

module.exports = passport;
