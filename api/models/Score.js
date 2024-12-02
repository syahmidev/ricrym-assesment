const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Character = require('./Character');

const Score = sequelize.define('Score', {
    char_id: { type: DataTypes.INTEGER, references: { model: Character, key: 'id' } },
    reward_score: { type: DataTypes.INTEGER },
});

module.exports = Score;
