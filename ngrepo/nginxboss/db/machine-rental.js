const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const db = require('./_db');

const MachineRental = db.define('machine_rental', {
    mcode: {
        type: Sequelize.STRING(80),
        allowNull: false,
        validate: {}
    },
    vcode:{
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {}
    },
    rentalStart:{
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {}
    },
    rentalEnd:{
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {}
    },
    payDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {}
    },
    price:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        validate: {}
    },
    remarktag:{
        type: Sequelize.JSON,
        allowNull: false,
        validate: {}
    },
    paytag:{
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {}
    },
    remark:{
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {}
    },
    createdBy:{
        type: Sequelize.STRING(80),
        allowNull: false,
        validate: {}
    }
}, {
    tableName: 'mt_machine_rental',
    indexes: [{
        fields: ['mcode']
    }]
});

module.exports = MachineRental;