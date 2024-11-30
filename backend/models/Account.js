const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const Account = sequelize.define('Account', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    secretkey_2fa: { type: DataTypes.STRING },
});

// Hash password before saving to the database
Account.beforeCreate(async (account) => {
    account.password = await bcrypt.hash(account.password, 10); 
});

Account.beforeUpdate(async (account) => {
    if (account.changed('password')) {
        account.password = await bcrypt.hash(account.password, 10);
    }
});

module.exports = Account;