const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')
const encryptTools = require('../utils/encrypt-tools');

const CloudflareAccount = db.define('cloudflareAccount', {
    email: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    api_key: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'mt_cloudflare_account',
    indexes: [{
        fields: ['email']
    }]
});

module.exports = CloudflareAccount;