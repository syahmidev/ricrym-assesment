const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Auth 
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// API 
const apiRoutes = require('./routes/scores');
app.use('/', apiRoutes);


app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// app.listen(3000, async () => {
//     await sequelize.sync();
//     console.log('Backend running at http://localhost:3000');
// });

module.exports = app;