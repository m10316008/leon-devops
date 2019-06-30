const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const db = require('./_db');

const encryptTools = require('../utils/encrypt-tools');
const fs = require('fs');
var path = require('path');

var rsaPath = path.join(__dirname, '..', '.rsa');

var pubPem = fs.readFileSync(path.join(rsaPath, 'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath, 'mykey.pem'));

const Machine = db.define('machine', {
    mcode: {
        type: Sequelize.STRING(80),
        primaryKey: true,
        allowNull: false,
        validate: {}
    },
    vcode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {}
    },
    vendor: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {}
    },
    location: {
        type: Sequelize.STRING(10),
        allowNull: false,
        validate: {}
    },
    mclass: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {}
    },
    mtype: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {}
    },
    primaryIp: {
        type: Sequelize.STRING(45),
        allowNull: false,
        validate: {}
    },
    primaryPort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {}
    },
    price: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        validate: {}
    },
    firstPayment: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {}
    },
    enable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {}
    },
    remark: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {}
    },
    remarktag:{
        type: Sequelize.JSON,
        allowNull: false,
        validate: {}
    },
    username: {
        type: Sequelize.STRING(512),
        allowNull: false,
        set(val) {
            this.setDataValue('username', encryptTools.publicEncrypt(val, pubPem));
        },
        validate: {}
    },
    password: {
        type: Sequelize.STRING(512),
        allowNull: false,
        set(val) {
            this.setDataValue('password', encryptTools.publicEncrypt(val, pubPem));
        },
        validate: {}
    },
    sshKey: {
        type: Sequelize.STRING(512),
        allowNull: false,
        set(val) {
            this.setDataValue('sshKey', encryptTools.publicEncrypt(val, pubPem));
        },
        validate: {}
    },
    fullip: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {}
    },
    uat4_db_host: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {}
    },
    uat4_db_user:{
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: {}
    },
    uat4_db_password:{
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: {}
    }
}, {
    tableName: 'mt_machine',
    indexes: [{
        fields: ['vcode', 'enable']
    }]
});

module.exports = Machine;