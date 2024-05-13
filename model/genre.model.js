const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Assuming you have a db configuration file

class Genre extends Model {}

Genre.init({
  // Define attributes of the Genre model
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // We need to pass the connection instance
  timestamps: false,
  modelName: 'Genre' // We choose the model name
});

module.exports = Genre;



