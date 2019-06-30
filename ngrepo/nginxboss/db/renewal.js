const Sequelize = require('sequelize')
const db = require('./_db')

const Renewal = db.define('renewal', {
    mcode: {
        type: Sequelize.STRING(80),
        primaryKey: true,
        allowNull: false,
        validate: {
        }
    },
    renewalDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
        }
    }
},
    {
        tableName: 'jl_renewal'
    });

module.exports = Renewal;
