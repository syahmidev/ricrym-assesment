const sequelize = require('./config/db');
const Account = require('./models/Account');
const Character = require('./models/Character');
const Score = require('./models/Score');
const { faker } = require('@faker-js/faker');

const seedDatabase = async () => {
    try {
        // Delete existing data
        await sequelize.sync({ force: true });

        const accounts = [];
        const characters = [];
        const scores = [];

        for (let i = 0; i < 20000; i++) {
            const account = await Account.create({
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: 'password',
            });

            const character = await Character.create({
                acc_id: account.id,
                class_id: faker.number.int({ min: 1, max: 8 }),
            });

            scores.push({
                char_id: account.id,
                reward_score: faker.number.int({ min: 10, max: 100 }),
            });
        }

        // Bulk insert scores after creating characters
        await Score.bulkCreate(scores);

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        process.exit();
    }
};

seedDatabase();
