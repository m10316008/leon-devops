const Sequelize = require('sequelize')
const bcryptjs = require('bcryptjs');
const db = require('./_db')

const Login = db.define('login', {
    username: {
        type: Sequelize.STRING(32),
        primaryKey: true,
        allowNull: false,
        validate: {
        }
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        set(val) {
            this.setDataValue('password', bcryptjs.hashSync(val, 10));
        },
        validate: {
        }
    },
    userRole: {
        type: Sequelize.STRING(32),
        allowNull: false,
        validate: {
        }
    },
    superAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
        }
    },
    brand: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
        }
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
        }
    },
    rights:{
        type:Sequelize.JSON,
        allowNull: false,
    },
    createdBy: {
        type: Sequelize.STRING(32),
        allowNull: false,
        validate: {
        }
    }
},
    {
        tableName: 'mt_login',
        indexes: [{ fields: ['userRole'] }]
    });

module.exports = Login;
