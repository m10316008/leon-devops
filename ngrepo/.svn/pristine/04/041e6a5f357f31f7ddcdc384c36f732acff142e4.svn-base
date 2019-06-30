const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')
const encryptTools = require('../utils/encrypt-tools');

const Cmds = db.define('cmd', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        validate: {}
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    cmd: {
        type: Sequelize.TEXT,
        allowNull: false
    }

}, {
    tableName: 'mt_cmd',
    indexes: [{
        fields: ['id', 'name']
    }]
});

module.exports = Cmds;