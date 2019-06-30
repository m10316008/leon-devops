const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')

const Brand = db.define('brand', {
        vcode: {
            type: Sequelize.STRING(10),
            allowNull: false,
            primaryKey: true,
            validate: {}
        },
        brand: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {}
        },
        uat1_url: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {}
        },
        uat2_url: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {}
        },
        cf_proxied_0: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {}
        },
        cf_proxied_1: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {}
        },
        disabled: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            defaultValue:0
        }
    },
    {
        tableName: 'mt_brand'
    });
module.exports = Brand;
