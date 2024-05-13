const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'newdb2',
  pool: {
    max: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false 
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    await sequelize.sync({ force: false , alter: true });
    console.log('Models synchronized with the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

module.exports = sequelize;