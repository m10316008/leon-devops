const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')

const staticInfo = db.define('static_info', {
        id: {
            type: Sequelize.STRING(255),
            allowNull: false,
            primaryKey: true,
            validate: {}
        },
        value: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {}
        },
        type: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {}
        },
        remark: {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue:null,
            validate: {}
        }
    },
    {
        tableName: 'mt_static_info'
    });

module.exports = staticInfo;
