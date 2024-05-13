const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a db configuration file

class Actor extends Model {}

Actor.init({
  // Define attributes of the Actor model
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // We need to pass the connection instance
  timestamps: false,
  modelName: 'Actor' // We choose the model name
});

module.exports = Actor;
