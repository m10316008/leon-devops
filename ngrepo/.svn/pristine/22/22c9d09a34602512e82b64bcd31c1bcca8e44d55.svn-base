const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const db = require('./_db');

const Configs = db.define('configs', {
    key:{
        type:Sequelize.STRING(80),
        primaryKey: true,
        allowNull: false,
        validate: {}
    },
    value: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {}
    }
}, {
    tableName: 'mt_configs',
    indexes: [{
        fields: ['key']
    }]
});

module.exports = Configs;