const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Account = require('./Account');

const Character = sequelize.define('Character', {
    acc_id: { type: DataTypes.INTEGER, references: { model: Account, key: 'id' } },
    class_id: { type: DataTypes.INTEGER },
});

module.exports = Character;
