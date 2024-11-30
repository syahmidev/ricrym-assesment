const { Op } = require('sequelize');
const Score = require('../models/Score');
const Character = require('../models/Character');
const Account = require('../models/Account');

Character.belongsTo(Account, { foreignKey: 'acc_id' });
Score.belongsTo(Character, { foreignKey: 'char_id' });

const getScores = async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    const scores = await Score.findAndCountAll({
        include: [
            {
                model: Character,
                include: [Account],
            },
        ],
        where: search
            ?   {
                    '$Character.Account.username$': {
                        [Op.iLike]: `%${search}%`,
                    },
                }
            : {},
        limit,
        offset,
        distinct: true, // Prevent duplicate results
    });

    return {
        scores: scores.rows,
        totalPages: Math.ceil(scores.count / limit),
    };
};

module.exports = { getScores };
