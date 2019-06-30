const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const db = require('./_db');

const MachineVendors = db.define('machine_vendor', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(20),
        //primaryKey: true,
        allowNull: false,
        validate: {
        }
    }
},
    {
        tableName: 'mt_machine_vendor'
    });

module.exports = MachineVendors;
