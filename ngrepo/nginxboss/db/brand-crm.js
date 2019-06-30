const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')

const BrandCrm = db.define('brandCrm', {
        vcode: {
            type: Sequelize.STRING(10),
            allowNull: false,
            validate: {}
        },
        url: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {}
        }
    },
    {
        tableName: 'mt_brand_crm'
    });

module.exports = BrandCrm;
