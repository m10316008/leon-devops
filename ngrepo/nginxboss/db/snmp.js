const Sequelize = require('sequelize');
const db = require('./_db');

const Snmp = db.define('snmp', {
        timestamp: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            validate: {}
        },
        mcode: {
            type: Sequelize.STRING(80),
            allowNull: false,
            validate: {}
        },
        value: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {}
        }
    },
    {
        indexes:[{
            fields: ['mcode','timestamp']
        }],
        tableName: 'mt_snmp'
    });

module.exports = Snmp;
