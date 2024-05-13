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
  logging: false // Disable SQL query logging
});

// Define your models here...

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Sync the models with the database
    await sequelize.sync({ force: false , alter: true });
    console.log('Models synchronized with the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

module.exports = sequelize;















// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const mySqlPool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_DATABASE || 'haridb',
//     connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, // Adjust based on your requirements
//     waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS || true // Adjust based on your requirements
// });

// mySqlPool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//     } else {
//         console.log('Connected to MySQL database');
//         connection.release();
//     }
// });

// module.exports = mySqlPool;
