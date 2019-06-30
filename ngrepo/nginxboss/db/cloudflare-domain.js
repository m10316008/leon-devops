const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')
const encryptTools = require('../utils/encrypt-tools');

const CloudflareDomain = db.define('cloudflareDomain', {
    domain: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    vcode: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    zone_id:{
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: true
    },
    proxied:{
        type:Sequelize.INTEGER(1),
        allowNull:false
    },
    content:{
        type: Sequelize.STRING(50),
        allowNull: true
    },
    cf_ac:{
        type:Sequelize.STRING(50),
        allowNull:false
    },
    nsname:{
        type:Sequelize.TEXT,
        allowNull:true
    }
}, {
    tableName: 'mt_cloudflare_domain',
    indexes: [{
        fields: ['domain','vcode']
    }]
});

module.exports = CloudflareDomain;