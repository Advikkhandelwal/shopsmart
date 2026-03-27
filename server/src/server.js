const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5001;

sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        // Only sync if explicitly told to via environment variable
        if (process.env.SYNC_DB === 'true') {
            sequelize.sync().then(() => console.log('Database synced (SYNC_DB=true)'));
        }
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });
