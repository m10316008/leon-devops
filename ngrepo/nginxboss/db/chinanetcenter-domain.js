const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const db = require('../db/_db');
const chinanetcenterDomain = db.define('chinanetcenterDomain', {
    domain: {
        type: Sequelize.STRING(255)
    },
    account:{
        type: Sequelize.STRING(255)
    },
    result:{
        type: Sequelize.TEXT
    }
}, {
    tableName: 'mt_chinanetcenter_domain'
});

module.exports = chinanetcenterDomain;